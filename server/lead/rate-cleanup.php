<?php
declare(strict_types=1);

/** Delete only expired receiver rate records, never emails or other files. */
function hp_prune_rates(string $directory, int $now): int
{
    $root = realpath($directory);
    if ($root === false || !is_dir($root) || is_link($directory)) {
        throw new RuntimeException('Invalid private rate directory');
    }
    $lock = fopen($root . '/.cleanup.lock', 'c');
    if ($lock === false) throw new RuntimeException('Rate cleanup lock unavailable');
    chmod($root . '/.cleanup.lock', 0600);
    $removed = 0;
    try {
        if (!flock($lock, LOCK_EX)) throw new RuntimeException('Cannot lock rate directory');
        foreach (new DirectoryIterator($root) as $entry) {
            if (!preg_match('/^lead-[a-f0-9]{64}\.json$/D', $entry->getFilename()) ||
                $entry->isLink() || !$entry->isFile()) continue;
            if ($entry->getMTime() > $now - 3600) continue;
            $times = json_decode(file_get_contents($entry->getPathname()), true);
            if (!is_array($times) || array_filter($times, static fn($time) => !is_int($time) || $time > $now - 3600)) continue;
            if (!unlink($entry->getPathname())) throw new RuntimeException('Rate cleanup failed');
            $removed++;
        }
        return $removed;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    if (PHP_SAPI !== 'cli') exit(1);
    $configPath = __DIR__ . '/config.local.php';
    if (!is_file($configPath)) exit(1);
    $config = require $configPath;
    if (!is_array($config) ||
        !in_array($config['mail_environment'] ?? null, ['preview', 'production'], true)) exit(1);
    $rateDir = $config['rate_dir'] ?? null;
    if (!is_string($rateDir) || $rateDir === '' || is_link($rateDir)) exit(1);
    $root = realpath($rateDir);
    // Resolve the account-private root from releases/<revision>/server/lead.
    // Cleanup must never be redirected to arbitrary paths via configuration.
    $privateBase = realpath(dirname(__DIR__, 4));
    if (!$privateBase || !$root || $root !== $privateBase . '/state' ||
        !is_dir($root)) exit(1);
    hp_prune_rates($root, time());
}
