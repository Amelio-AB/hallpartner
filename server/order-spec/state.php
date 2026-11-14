<?php
declare(strict_types=1);

/** Private filesystem locks; no state files or generated PDFs in public_html. */
function hp_os_state_dir(array $config): string
{
    // The configured directory must be an absolute, already-existing PRIVATE
    // path. PHP realpath('') resolves to '/' on some builds; never accept it.
    $configured = $config['state_dir'] ?? null;
    if (!is_string($configured) || trim($configured) === '' ||
        !str_starts_with($configured, DIRECTORY_SEPARATOR) ||
        str_contains($configured, "\0")) {
        throw new RuntimeException('Private order state directory unavailable');
    }
    $dir = realpath($configured);
    if ($dir === false || $dir === DIRECTORY_SEPARATOR ||
        !is_dir($dir) || !is_writable($dir) ||
        str_contains($dir, '/public_html') || str_contains($dir, '\\public_html')) {
        throw new RuntimeException('Private order state directory unavailable');
    }
    // A world/group-accessible parent state directory allows state deletion,
    // interference with idempotency and possibly exposure of personal data.
    // Require owner-only permissions, not merely is_writable().
    $mode = fileperms($dir);
    if ($mode === false || ($mode & 0077) !== 0) {
        throw new RuntimeException('Private order state directory permissions unsafe');
    }
    return rtrim($dir, DIRECTORY_SEPARATOR);
}
function hp_os_state_key(array $config, string $purpose, string $value): string
{
    return hash_hmac('sha256', $purpose . ':' . $value, $config['rate_secret']);
}
function hp_os_locked_file(array $config, string $basename, callable $callback): mixed
{
    $path = hp_os_state_dir($config) . DIRECTORY_SEPARATOR . $basename . '.json';
    $handle = fopen($path, 'c+');
    if ($handle === false) throw new RuntimeException('Private state unavailable');
    @chmod($path, 0600);
    try {
        if (!flock($handle, LOCK_EX)) throw new RuntimeException('Private state lock unavailable');
        rewind($handle);
        $raw = stream_get_contents($handle);
        $record = $raw !== '' ? json_decode($raw, true) : null;
        if ($raw !== '' && !is_array($record)) throw new RuntimeException('Invalid private state');
        $result = $callback($record);
        if (!is_array($result) || !array_key_exists('next', $result)) throw new LogicException('Invalid state callback');
        $next = $result['next'];
        if (!is_array($next)) throw new LogicException('Invalid next state');
        $encoded = json_encode($next, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        rewind($handle);
        if (!ftruncate($handle, 0) || fwrite($handle, $encoded) !== strlen($encoded)) {
            throw new RuntimeException('Private state write failed');
        }
        fflush($handle);
        return $result['value'] ?? null;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}
/**
 * Persistent shared limiter with atomic per-bucket limits. Even the "verify
 * address" endpoint is throttled. Call all IP/email/recipient/global buckets.
 */
function hp_os_limit(array $config, string $bucket, string $value, int $max, int $period): void
{
    $name = 'rate-' . hp_os_state_key($config, $bucket, $value);
    hp_os_locked_file($config, $name, static function (?array $record) use ($max, $period): array {
        $now = time();
        $timestamps = array_values(array_filter($record['events'] ?? [],
            static fn($t) => is_int($t) && $t > $now - $period && $t <= $now));
        if (count($timestamps) >= $max) throw new RuntimeException('Rate limit reached');
        $timestamps[] = $now;
        return ['next'=>['events'=>$timestamps],'value'=>null];
    });
}
/** A single reservation wins: failures/uncertain sends are never retried automatically. */
function hp_os_reserve(array $config, string $email, string $key, string $hash): array
{
    $name = 'send-' . hp_os_state_key($config, 'idempotency', strtolower($email) . ':' . $key);
    return hp_os_locked_file($config, $name, static function (?array $previous) use ($hash): array {
        if ($previous !== null) {
            if (($previous['payloadHash'] ?? '') !== $hash) throw new DomainException('Idempotency key reused for different payload');
            return ['next'=>$previous,'value'=>['new'=>false,'record'=>$previous]];
        }
        $record = ['payloadHash'=>$hash,'status'=>'reserved','at'=>time()];
        return ['next'=>$record,'value'=>['new'=>true,'record'=>$record]];
    });
}
function hp_os_complete(array $config, string $email, string $key, string $hash, array $values): void
{
    $name = 'send-' . hp_os_state_key($config, 'idempotency', strtolower($email) . ':' . $key);
    hp_os_locked_file($config, $name, static function (?array $previous) use ($hash, $values): array {
        if ($previous === null || ($previous['payloadHash'] ?? '') !== $hash ||
            !in_array($previous['status'] ?? '', ['reserved','rendered','unconfirmed'], true)) {
            throw new RuntimeException('Order reservation missing');
        }
        return ['next'=>array_merge($previous, $values), 'value'=>null];
    });
}


/**
 * A verified e-mail token may authorize exactly ONE distinct order payload.
 * Network retry of the same key/payload remains allowed for idempotent lookup,
 * but any new order needs a new e-mail challenge.
 */
function hp_os_claim_verification(array &$session, string $token, string $email,
    string $key, string $payloadHash): bool
{
    $record = $session['verified'] ?? null;
    if (!is_array($record) || time() > ($record['expires'] ?? 0) ||
        !hash_equals((string) ($record['email'] ?? ''), strtolower($email)) ||
        !hash_equals((string) ($record['hash'] ?? ''), hash('sha256', $token))) return false;
    if (isset($record['usedKey'], $record['usedHash'])) {
        return hash_equals($record['usedKey'], $key) && hash_equals($record['usedHash'], $payloadHash);
    }
    $session['verified']['usedKey'] = $key;
    $session['verified']['usedHash'] = $payloadHash;
    return true;
}
