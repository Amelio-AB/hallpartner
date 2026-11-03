<?php
declare(strict_types=1);

/**
 * Public bootstrap copied by Astro into dist/api/lead.php.
 * The real receiver and SMTP credentials live OUTSIDE public_html.
 * Without a configured private backend it always fails closed.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

function hp_public_error(int $code, string $status): never {
    http_response_code($code);
    echo json_encode(['status' => $status], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    hp_public_error(405, 'failed');
}
$directory = getenv('HP_LEAD_PRIVATE_DIR');
if (!is_string($directory) || $directory === '' || !str_starts_with($directory, '/') ||
    !is_file(rtrim($directory, '/') . '/receiver.php')) {
    hp_public_error(503, 'failed');
}
require rtrim($directory, '/') . '/receiver.php';
