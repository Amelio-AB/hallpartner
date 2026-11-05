<?php
declare(strict_types=1);

/**
 * Server-only Hallpartner receiver. Deploy this folder OUTSIDE public_html.
 * Its sender accepts an enquiry only when SMTP accepted the mail.
 * SMTP acceptance is not proof that the recipient read or received the email.
 */
require_once __DIR__ . '/validator.php';

function hp_reply(int $http, array $body): never
{
    http_response_code($http);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$configFile = __DIR__ . '/config.local.php';
$vendor = __DIR__ . '/vendor/autoload.php';
if (!is_file($configFile) || !is_file($vendor)) hp_reply(503, ['status' => 'failed']);
$config = require $configFile;
if (!is_array($config) || ($config['enabled'] ?? null) !== true ||
    ($config['privacy_approved'] ?? null) !== true) {
    hp_reply(503, ['status' => 'failed']);
}
$required = ['allowed_origin','smtp_host','smtp_username','smtp_password','smtp_from','recipient','rate_dir','rate_secret'];
foreach ($required as $key) {
    if (!is_string($config[$key] ?? null) || trim($config[$key]) === '') {
        hp_reply(503, ['status' => 'failed']);
    }
}
if (!filter_var($config['smtp_from'], FILTER_VALIDATE_EMAIL) ||
    !filter_var($config['recipient'], FILTER_VALIDATE_EMAIL) ||
    !filter_var($config['smtp_username'], FILTER_VALIDATE_EMAIL)) {
    hp_reply(503, ['status' => 'failed']);
}
$port = $config['smtp_port'] ?? 587;
if (!is_int($port) || !in_array($port, [587, 465], true)) hp_reply(503, ['status' => 'failed']);

$documentRoot = realpath((string)($_SERVER['DOCUMENT_ROOT'] ?? '')) ?: null;
$rateRoot = realpath($config['rate_dir']);
if (!$rateRoot || !$documentRoot ||
    $rateRoot === $documentRoot ||
    str_starts_with($rateRoot . '/', rtrim($documentRoot, '/') . '/')) {
    // Requests and hashed rate records must never go into a public directory.
    hp_reply(503, ['status' => 'failed']);
}
if (($_SERVER['HTTPS'] ?? '') !== 'on' && (int)($_SERVER['SERVER_PORT'] ?? 0) !== 443) {
    hp_reply(503, ['status' => 'failed']);
}
if (($_SERVER['HTTP_ORIGIN'] ?? '') !== $config['allowed_origin']) {
    hp_reply(403, ['status' => 'failed']);
}
$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
if ($contentType !== 'application/json') hp_reply(415, ['status' => 'failed']);
$length = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($length <= 0 || $length > 16384) hp_reply(413, ['status' => 'failed']);
$raw = file_get_contents('php://input', false, null, 0, 16385);
if ($raw === false || strlen($raw) !== $length) hp_reply(422, ['status' => 'validation-error', 'fields' => ['_global' => 'Ogiltig förfrågan.']]);
try {
    $input = json_decode($raw, true, 20, JSON_THROW_ON_ERROR);
} catch (Throwable) {
    hp_reply(422, ['status' => 'validation-error', 'fields' => ['_global' => 'Ogiltig JSON.']]);
}
$validation = hp_validate_lead($input);
if (!$validation['valid']) hp_reply(422, ['status' => 'validation-error', 'fields' => $validation['errors']]);
if (isset($config['allowed_configurations']) &&
    (!is_array($config['allowed_configurations']) || !in_array($validation['kind'], $config['allowed_configurations'], true))) {
    hp_reply(403, ['status' => 'failed']);
}

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? '');
if ($ip === '' || !hp_allow_rate($rateRoot, $config['rate_secret'], $ip, time())) {
    // Rejected with no SMTP attempt: failure is safe to retry at a later time.
    hp_reply(503, ['status' => 'failed']);
}

$reference = bin2hex(random_bytes(12));
$kind = $validation['kind'];
$answers = $validation['answers'];
$subject = $kind === 'hallpartner-contact-v1' ? 'Nytt kontaktmeddelande' : 'Ny hallförfrågan';
$body = "Hallpartner – " . $subject . "\n" .
    "Referens: " . $reference . "\n" .
    "Mottagartid UTC: " . gmdate('Y-m-d H:i:s') . "\n\n";
require_once __DIR__ . '/messages.php';
require_once __DIR__ . '/delivery.php';
$summary = hp_answer_summary($kind, $answers);
$body .= $summary;

require_once $vendor;
$result = hp_deliver_enquiry($config, $port, $kind, $answers, $reference, $subject, $body, $summary);
hp_reply($result['status'] === 'success' ? 200 : 500, $result);
