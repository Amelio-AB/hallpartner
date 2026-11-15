<?php
declare(strict_types=1);

/**
 * CLI-only real PDF regression, driven by GitHub PR validation.
 * 120 synthetic item rows; no accounts, SMTP, network or customer data.
 */
$root = dirname(__DIR__);
require $root . '/server/order-spec/vendor/autoload.php';
require $root . '/server/order-spec/validation.php';
require $root . '/server/order-spec/pdf.php';

$fixture = json_decode(
    (string) file_get_contents($root . '/shared/order-spec/example.v1.json'),
    true, 48, JSON_THROW_ON_ERROR
);
for ($number = 4; $number <= 120; $number++) {
    $row = $fixture['items'][0];
    $row['lineId'] = sprintf('SYNTH-%04d', $number);
    $row['itemType'] = 'Provpanel ÄÖÅ';
    $row['description'] = 'Enbart syntetisk data, utan verklig kund eller beställning.';
    if ($number === 5 || $number === 60) {
        $row['notes'] = mb_substr(str_repeat('Lång rad med åäö och egna mått. ', 60), 0, 1200);
    }
    if ($number === 6) {
        $row['notes'] = '<script>alert("bad")</script> ska inte bli HTML';
    }
    if ($number === 120) {
        $row['notes'] = 'Sista panelraden ÄÖÅ';
    }
    $fixture['items'][] = $row;
}
if (count($fixture['items']) !== 120) throw new RuntimeException('Expected 120 synthetic rows');
$data = hp_order_validate($fixture);
$html = hp_order_pdf_html($data, 'HP-TEST012345', '2026-11-14 11:00 UTC');
if (str_contains($html, '<script>') || !str_contains($html, '&lt;script&gt;')) {
    throw new RuntimeException('Unsafe rendering of untrusted input');
}
$path = $argv[1] ?? '';
if ($path === '' || !is_dir(dirname($path))) throw new RuntimeException('Provide existing private output directory');
$private = dirname($path) . '/dompdf-temp-' . bin2hex(random_bytes(5));
if (!mkdir($private, 0700)) throw new RuntimeException('Could not create private temp directory');
try {
    $bytes = hp_order_generate_pdf($data, 'HP-TEST012345', '2026-11-14 11:00 UTC', $private);
    if (file_put_contents($path, $bytes, LOCK_EX) !== strlen($bytes)) {
        throw new RuntimeException('Could not save synthetic PDF');
    }
    echo "PASS: PDF generated for 120 unique rows, including 1200-char notes and UTF-8; bytes=" . strlen($bytes) . PHP_EOL;
} finally {
    foreach (glob($private . '/*') ?: [] as $file) {
        if (is_file($file)) unlink($file);
    }
    rmdir($private);
}
