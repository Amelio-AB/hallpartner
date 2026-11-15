<?php
declare(strict_types=1);

require_once __DIR__ . '/validation.php';
require_once __DIR__ . '/pdf.php';
require_once __DIR__ . '/state.php';
require_once __DIR__ . '/mailer.php';

function hp_os_reply(int $code, string $status, array $rest = []): never
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status'=>$status] + $rest, JSON_UNESCAPED_UNICODE);
    exit;
}
function hp_os_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name('HP_ORDER_SPEC');
    session_set_cookie_params([
        'lifetime'=>0, 'path'=>'/api/order-spec.php', 'secure'=>true,
        'httponly'=>true, 'samesite'=>'Strict'
    ]);
    if (!session_start()) throw new RuntimeException('Private session unavailable');
}
function hp_os_verify_server(array $config): void
{
    // Never trust client-supplied X-Forwarded-Proto or a plain HTTP connection.
    if ((($_SERVER['HTTPS'] ?? '') !== 'on') && (int) ($_SERVER['SERVER_PORT'] ?? 0) !== 443) {
        hp_os_reply(403, 'forbidden');
    }
    if (($config['enabled'] ?? false) !== true || ($config['privacy_approved'] ?? false) !== true ||
        ($config['smtp_from'] ?? null) !== 'offert@hallpartner.se' ||
        !is_string($config['rate_secret'] ?? null) ||
        strlen($config['rate_secret']) < 32 ||
        empty($config['smtp_host']) || empty($config['smtp_username']) || empty($config['smtp_password'])) {
        hp_os_reply(503, 'disabled', ['message'=>'Utskick ännu inte aktiverat']);
    }
    $allowed = $config['allowed_origin'] ?? '';
    $host = parse_url($allowed, PHP_URL_HOST);
    if (!is_string($host) || !$host || !str_starts_with($allowed, 'https://') ||
        !hash_equals(strtolower($host), strtolower(explode(':', (string)($_SERVER['HTTP_HOST'] ?? ''))[0]))) {
        hp_os_reply(503, 'disabled');
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
        if (!hash_equals($allowed, (string) ($_SERVER['HTTP_ORIGIN'] ?? ''))) hp_os_reply(403, 'forbidden');
        if (!str_starts_with(strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? '')), 'application/json')) {
            hp_os_reply(415, 'unsupported');
        }
    }
    hp_os_state_dir($config);
}
function hp_os_read_json(): array
{
    $size = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($size > 196608 || $size < 0) hp_os_reply(413, 'invalid');
    $raw = file_get_contents('php://input', false, null, 0, 196609);
    if (!is_string($raw) || strlen($raw) > 196608) hp_os_reply(413, 'invalid');
    try {
        $data = json_decode($raw, true, 48, JSON_THROW_ON_ERROR);
    } catch (JsonException) { hp_os_reply(422, 'invalid'); }
    if (!is_array($data) || array_is_list($data)) hp_os_reply(422, 'invalid');
    return $data;
}
function hp_os_client_ip(): string
{
    // REMOTE_ADDR only. Ignore spoofable forwarded headers.
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unavailable');
}
function hp_os_rate_challenge(array $config, string $email): void
{
    hp_os_limit($config, 'verify-ip', hp_os_client_ip(), 8, 3600);
    hp_os_limit($config, 'verify-email', strtolower($email), 3, 3600);
    hp_os_limit($config, 'verify-global', 'all', 120, 3600);
}
function hp_os_rate_submit(array $config, string $sender, string $recipient): void
{
    hp_os_limit($config, 'submit-ip', hp_os_client_ip(), 12, 86400);
    hp_os_limit($config, 'submit-sender', strtolower($sender), 8, 86400);
    hp_os_limit($config, 'submit-recipient', strtolower($recipient), 8, 86400);
    hp_os_limit($config, 'submit-global', 'all', 100, 86400);
}
function hp_os_issue_download(array $config, string $file, string $reference): string
{
    // The cookie-bound token is generated only after a confirmed SMTP accept.
    $root = hp_os_state_dir($config);
    if (!str_starts_with((string)realpath($file), $root . DIRECTORY_SEPARATOR) ||
        !is_file($file) || !preg_match('/^HP-[0-9A-Z]{10}$/D', $reference)) {
        throw new RuntimeException('PDF download unavailable');
    }
    $token = bin2hex(random_bytes(24));
    $_SESSION['downloads'] ??= [];
    $_SESSION['downloads'][hash('sha256', $token)] =
        ['file'=>$file,'reference'=>$reference,'exp'=>time()+900];
    if (count($_SESSION['downloads']) > 5) $_SESSION['downloads'] = array_slice($_SESSION['downloads'], -5, null, true);
    return '/api/order-spec.php?action=download&token=' . $token;
}
function hp_os_download(array $config): never
{
    $token = $_GET['token'] ?? null;
    if (!is_string($token) || !preg_match('/^[a-f0-9]{48}$/D', $token)) hp_os_reply(404, 'not-found');
    $key = hash('sha256', $token);
    $record = $_SESSION['downloads'][$key] ?? null;
    unset($_SESSION['downloads'][$key]); // one-use, even on failed transfer
    if (!is_array($record) || (int)($record['exp'] ?? 0) < time()) hp_os_reply(404, 'not-found');
    $file = $record['file'] ?? '';
    $root = hp_os_state_dir($config);
    $real = is_string($file) ? realpath($file) : false;
    if (!$real || !str_starts_with($real, $root . DIRECTORY_SEPARATOR) || !is_file($real)) hp_os_reply(404, 'not-found');
    session_write_close();
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $record['reference'] . '.pdf"');
    header('Content-Length: ' . (string) filesize($real));
    readfile($real);
    exit;
}

function hp_os_handle(): never
{
    // Missing config or vendor always keeps the endpoint non-operational.
    if (!is_file(__DIR__.'/config.local.php') || !is_file(__DIR__.'/vendor/autoload.php')) hp_os_reply(503,'disabled');
    $config = require __DIR__.'/config.local.php';
    if (!is_array($config)) hp_os_reply(503,'disabled');
    hp_os_verify_server($config);
    require_once __DIR__.'/vendor/autoload.php';
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    if ($method !== 'GET' && $method !== 'POST') {
        header('Allow: GET, POST');
        hp_os_reply(405,'invalid');
    }
    hp_os_start_session();
    if ($method === 'GET') {
        if (($_GET['action'] ?? '') === 'download') hp_os_download($config);
        hp_os_reply(405,'invalid');
    }
    $input = hp_os_read_json();
    $action = $input['action'] ?? null;
    if (!is_string($action)) hp_os_reply(422,'invalid');
    try {
        if ($action === 'challenge-request') {
            if (array_diff(array_keys($input), ['action','email'])) hp_os_reply(422,'invalid');
            $email = strtolower(trim((string)($input['email'] ?? '')));
            if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
                strpbrk($email, "\r\n") !== false) hp_os_reply(422,'invalid',['fields'=>['submitter.email'=>'Kontrollera e-postadressen']]);
            hp_os_rate_challenge($config, $email);
            $code = (string) random_int(100000,999999);
            $challengeId = bin2hex(random_bytes(16));
            $_SESSION['challenge'] = [
                'id'=>$challengeId, 'email'=>$email,
                'hash'=>hash_hmac('sha256', $code, $config['rate_secret']),
                'expires'=>time()+600, 'attempts'=>0
            ];
            try {
                if (!hp_os_send($config, $email, 'Hallpartner – verifieringskod',
                    "Din verifieringskod är: $code\nKoden gäller i 10 minuter. Om du inte begärt den kan du bortse från detta mejl.")) {
                    hp_os_reply(202,'unconfirmed');
                }
            } catch (Throwable) { hp_os_reply(202,'unconfirmed'); }
            hp_os_reply(202,'pending',['challengeId'=>$challengeId]);
        }
        if ($action === 'challenge-confirm') {
            if (array_diff(array_keys($input), ['action','challengeId','code'])) hp_os_reply(422,'invalid');
            $challenge = $_SESSION['challenge'] ?? null;
            if (!is_array($challenge) || time() > ($challenge['expires'] ?? 0) ||
                ($challenge['attempts'] ?? 99) >= 5) {
                unset($_SESSION['challenge']); hp_os_reply(422,'invalid');
            }
            $_SESSION['challenge']['attempts']++;
            $challengeId = $input['challengeId'] ?? null;
            $code = $input['code'] ?? null;
            if (!is_string($challengeId) || !is_string($code) ||
                !preg_match('/^\d{6}$/D', $code) ||
                !hash_equals($challenge['id'], $challengeId) ||
                !hash_equals($challenge['hash'], hash_hmac('sha256', $code, $config['rate_secret']))) {
                hp_os_reply(422,'invalid');
            }
            $token = bin2hex(random_bytes(24));
            $_SESSION['verified'] = ['email'=>$challenge['email'],
                'hash'=>hash('sha256',$token), 'expires'=>time()+1800];
            unset($_SESSION['challenge']);
            hp_os_reply(200,'verified',['verificationToken'=>$token]);
        }
        if ($action === 'submit') {
            if (array_diff(array_keys($input), ['action','payload','verificationToken'])) hp_os_reply(422,'invalid');
            if (!is_array($input['payload'] ?? null)) hp_os_reply(422,'invalid');
            try { $payload = hp_order_validate($input['payload']); }
            catch (InvalidArgumentException $e) {
                $path = substr($e->getMessage(), 0, 120);
                hp_os_reply(422,'invalid',['fields'=>[$path=>'Kontrollera uppgifterna']]);
            }
            $verificationToken = $input['verificationToken'] ?? null;
            $sender = strtolower($payload['submitter']['email']);
            $recipient = strtolower($payload['recipient']['email']);
            $key = $payload['idempotencyKey'];
            $canonical = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
            $hash = hash('sha256', $canonical);
            if (!is_string($verificationToken) ||
                !hp_os_claim_verification($_SESSION, $verificationToken, $sender, $key, $hash)) {
                hp_os_reply(403,'forbidden');
            }
            // Limit BEFORE reserving a new key to avoid unbounded state-file
            // creation even when an attacker keeps changing UUID values.
            // Replays consume rate budget but never trigger a second send.
            try {
                hp_os_rate_submit($config, $sender, $recipient);
            } catch (RuntimeException) {
                hp_os_reply(429,'rate-limited');
            }
            $reserved = hp_os_reserve($config, $sender, $key, $hash);
            if (!$reserved['new']) {
                $record = $reserved['record'];
                if (($record['status'] ?? '') === 'accepted' && isset($record['file'], $record['reference'])) {
                    $url = hp_os_issue_download($config, $record['file'], $record['reference']);
                    hp_os_reply(200,'accepted',['documentRef'=>$record['reference'],'downloadUrl'=>$url]);
                }
                hp_os_reply(202,'unconfirmed');
            }
            $reference = 'HP-' . strtoupper(substr(bin2hex(random_bytes(8)),0,10));
            $now = gmdate('Y-m-d H:i') . ' UTC';
            try {
                $pdf = hp_order_generate_pdf($payload,$reference,$now,hp_os_state_dir($config));
                $file = hp_os_state_dir($config) . DIRECTORY_SEPARATOR .
                    'order-' . hp_os_state_key($config,'pdf',$sender.':'.$key) . '.pdf';
                $handle = fopen($file,'x+b');
                if ($handle === false) throw new RuntimeException('Cannot store private PDF');
                @chmod($file,0600);
                try {
                    if (fwrite($handle,$pdf) !== strlen($pdf)) throw new RuntimeException('Private PDF write error');
                    fflush($handle);
                } finally { fclose($handle); }
                hp_os_complete($config,$sender,$key,$hash,
                    ['status'=>'rendered','file'=>$file,'reference'=>$reference,'createdAt'=>$now]);
            } catch (Throwable $e) {
                hp_os_complete($config,$sender,$key,$hash,['status'=>'failed']);
                error_log('[HP order-spec] PDF failed; document not sent');
                hp_os_reply(500,'failed');
            }
            $message = "Hallpartner beställningsunderlag\n\nReferens: $reference\n" .
                "Inskickat av: " . $sender . "\n\n" .
                "Detta är ett ej signerat underlag. Ingen tillverkning får starta innan separat godkännande.\n" .
                "Se bifogad PDF.\n";
            try {
                $accepted = hp_os_send($config,$recipient,'Hallpartner – beställningsunderlag ['.$reference.']',
                    $message,$pdf,$reference);
            } catch (Throwable) { $accepted = false; }
            if (!$accepted) {
                hp_os_complete($config,$sender,$key,$hash,['status'=>'unconfirmed']);
                hp_os_reply(202,'unconfirmed');
            }
            hp_os_complete($config,$sender,$key,$hash,['status'=>'accepted']);
            $url = hp_os_issue_download($config,$file,$reference);
            hp_os_reply(200,'accepted',['documentRef'=>$reference,'downloadUrl'=>$url]);
        }
        hp_os_reply(422,'invalid');
    } catch (DomainException) {
        hp_os_reply(409,'invalid',['fields'=>['idempotencyKey'=>'Nyckeln har använts för annat innehåll']]);
    } catch (RuntimeException $e) {
        if ($e->getMessage() === 'Rate limit reached') hp_os_reply(429,'rate-limited');
        error_log('[HP order-spec] Error in private receiver (message withheld)');
        hp_os_reply(500,'failed');
    } catch (Throwable) {
        error_log('[HP order-spec] Unexpected private receiver failure');
        hp_os_reply(500,'failed');
    }
}

hp_os_handle();
