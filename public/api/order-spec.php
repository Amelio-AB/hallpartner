<?php
declare(strict_types=1);

/** Static Astro copies this small adapter; no private config/vendor in webroot. */
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, private');
header('Content-Security-Policy: default-src \'none\'; frame-ancestors \'none\'');
header('Content-Type: application/json; charset=utf-8');

$private = getenv('HP_ORDER_SPEC_PRIVATE_DIR');
if (!is_string($private) || $private === '' || !str_starts_with($private, '/') ||
    str_contains($private, '/public_html') ||
    !is_file(rtrim($private, '/') . '/receiver.php')) {
    http_response_code(503);
    echo '{"status":"disabled"}';
    exit;
}
require rtrim($private, '/') . '/receiver.php';
