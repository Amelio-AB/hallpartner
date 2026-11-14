<?php
declare(strict_types=1);

/**
 * PRIVATE CLI ONLY, dry-run by default. Operator must separately approve
 * retention policy and cron before production. Never touches unknown files.
 *
 * php cleanup.php --dry-run
 * php cleanup.php --apply
 */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit(1); }
require_once __DIR__ . '/state.php';
if (!is_file(__DIR__.'/config.local.php')) {
    fwrite(STDERR, "Missing private config; no changes\n"); exit(1);
}
$config = require __DIR__.'/config.local.php';
if (!is_array($config)) exit(1);
$dir = hp_os_state_dir($config);
$command = $argv[1] ?? '--dry-run';
if (!in_array($command, ['--dry-run','--apply'], true) || count($argv) !== 2) {
    fwrite(STDERR, "Usage: php cleanup.php --dry-run|--apply\n"); exit(2);
}
$policy = [
    ['prefix'=>'order-', 'suffix'=>'.pdf', 'ttl'=>86400],
    ['prefix'=>'send-', 'suffix'=>'.json', 'ttl'=>604800],
    ['prefix'=>'rate-', 'suffix'=>'.json', 'ttl'=>172800],
];
$totals = ['eligible'=>0,'deleted'=>0,'skipped'=>0];
$now = time();
foreach ($policy as $rule) {
    $pattern = $dir . DIRECTORY_SEPARATOR . $rule['prefix'] . '*' . $rule['suffix'];
    foreach (glob($pattern) ?: [] as $path) {
        $name = basename($path);
        $regex = '/^' . preg_quote($rule['prefix'],'/') . '[a-f0-9]{64}' .
            preg_quote($rule['suffix'],'/') . '$/D';
        $real = realpath($path);
        $old = @filemtime($path);
        if (!preg_match($regex, $name) || is_link($path) ||
            $real === false || dirname($real) !== $dir || !is_file($real) ||
            !is_int($old) || $old > ($now - $rule['ttl'])) {
            $totals['skipped']++;
            continue;
        }
        $totals['eligible']++;
        if ($command === '--apply') {
            if (!@unlink($real)) {
                fwrite(STDERR, "File removal failed; stopping (path omitted)\n"); exit(1);
            }
            $totals['deleted']++;
        }
    }
}
echo json_encode(['operation'=>$command] + $totals, JSON_THROW_ON_ERROR) . "\n";
