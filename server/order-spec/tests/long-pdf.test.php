<?php
declare(strict_types=1);

/**
 * Explicit offline PDF integration test, NEVER sends mail.
 * Run after installing the REVIEWED private Composer lock in a sandbox:
 *   php server/order-spec/tests/long-pdf.test.php
 *
 * Requires poppler tools "pdfinfo" and "pdftotext" for automatic pagination/
 * text checks. Visual PDF inspection is still a separate manual release gate.
 */
$base = dirname(__DIR__);
$autoload = $base . '/vendor/autoload.php';
if (!is_file($autoload)) {
    fwrite(STDERR, "NOT RUN: private Dompdf vendor/autoload.php is unavailable\n");
    exit(2);
}
require $autoload;
require $base . '/validation.php';
require $base . '/pdf.php';
if (!class_exists(\Dompdf\Dompdf::class)) {
    fwrite(STDERR, "FAIL: Dompdf is not installed\n");
    exit(1);
}
foreach (['pdfinfo', 'pdftotext'] as $tool) {
    $found = trim((string) shell_exec('command -v ' . $tool . ' 2>/dev/null'));
    if ($found === '') {
        fwrite(STDERR, "NOT RUN: required offline PDF inspection tool missing: $tool\n");
        exit(2);
    }
}
$fixture = json_decode((string) file_get_contents(__DIR__ . '/example.v1.json'),
    true, 48, JSON_THROW_ON_ERROR);
$fixture['items'] = [];
for ($i = 1; $i <= 120; $i++) {
    $item = [
        'lineId' => sprintf('ROOF-%03d', $i),
        'category' => 'roofPanel',
        'itemType' => 'Takpanel',
        'quantity' => 1,
        'unit' => 'pcs',
        'dimensions' => ['thicknessMm' => 100.5, 'widthMm' => 1000, 'lengthMm' => 6000],
        'widthBasis' => 'effectiveCover',
        'core' => 'PIR',
        'profile' => 'Syntetisk takprofil',
        'ral' => 'RAL 7016',
        'description' => str_repeat('Beskrivning med åäö. ', 14),
        'notes' => $i === 120 ? str_repeat('Sista raden, öppen fråga åäö. ', 37) :
            'Kontrollera fästdetalj och kapad längd. Ej godkänd för tillverkning.'
    ];
    $fixture['items'][] = $item;
}
$validated = hp_order_validate($fixture);
if (count($validated['items']) !== 120) throw new RuntimeException('Invalid test fixture');
$tmp = sys_get_temp_dir() . '/hp-os-pdf-synthetic-' . bin2hex(random_bytes(10));
if (!mkdir($tmp, 0700)) throw new RuntimeException('Cannot create private sandbox');
$file = $tmp . '/synthetic.pdf';
$textPath = $tmp . '/synthetic.txt';
try {
    $bytes = hp_order_generate_pdf($validated, 'HP-1A2B3C4D5E', '2026-11-14 12:00 UTC', $tmp);
    if (file_put_contents($file, $bytes, LOCK_EX) !== strlen($bytes)) {
        throw new RuntimeException('Cannot write synthetic test PDF');
    }
    $output = [];
    $code = 0;
    exec('pdfinfo ' . escapeshellarg($file) . ' 2>&1', $output, $code);
    $metadata = implode("\n", $output);
    if ($code !== 0 || !preg_match('/^Pages:\s+(\d+)\s*$/m', $metadata, $pages)
        || (int) $pages[1] < 3) {
        throw new RuntimeException('Expected multiple A4 pages: ' . substr($metadata, 0, 400));
    }
    $output = []; $code = 0;
    exec('pdftotext -enc UTF-8 -layout ' . escapeshellarg($file) . ' ' .
        escapeshellarg($textPath) . ' 2>&1', $output, $code);
    if ($code !== 0 || !is_file($textPath)) {
        throw new RuntimeException('PDF text extraction failed');
    }
    $text = (string) file_get_contents($textPath);
    foreach (['ROOF-001', 'ROOF-120', 'materialleverantörens', 'EJ GODKÄNT FÖR TILLVERKNING',
        'Godkännande före tillverkning', 'Sista raden'] as $expected) {
        if (stripos($text, $expected) === false) {
            throw new RuntimeException('Rendered PDF missing expected content: ' . $expected);
        }
    }
    $headers = substr_count($text, 'Artikel / Item');
    if ($headers < 2) {
        throw new RuntimeException('PDF long table did not repeat its header');
    }
    echo "PASS: Actual synthetic Dompdf A4 PDF; {$pages[1]} pages, ";
    echo "120 article rows including the last, UTF-8, sign-off, repeated headers ({$headers})\n";
    echo "NOTE: Visual check for clipped/overlapping text is still NOT RUN\n";
} finally {
    foreach (glob($tmp . '/*') ?: [] as $child) {
        if (is_file($child)) unlink($child);
    }
    rmdir($tmp);
}
