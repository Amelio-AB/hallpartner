<?php
declare(strict_types=1);
// CLI-only harness. Its sole transport is a controlled loopback SMTP server.
if (PHP_SAPI !== 'cli') exit(1);
require __DIR__ . '/../../server/lead/vendor/autoload.php';
require __DIR__ . '/../../server/lead/validator.php';
require __DIR__ . '/../../server/lead/messages.php';
require __DIR__ . '/../../server/lead/delivery.php';
$port = filter_var($argv[1] ?? '', FILTER_VALIDATE_INT);
if (!$port || $port < 1024 || $port > 65535) exit(1);
$kind = $argv[2] ?? 'hallpartner-offert-v2-review';
$environment = $argv[3] ?? 'preview';
if (!in_array($environment, ['preview', 'production'], true)) exit(1);
$answers = ['project.use' => 'storage', 'dimensions.confidence' => 'need_help',
    'contact.name' => 'Syntetisk Testperson', 'contact.email' => 'visitor@example.invalid',
    'contact.preference' => 'email', 'site.city' => 'Teststad', 'openings.ports' => 'no'];
if ($kind === 'hallpartner-contact-v1') $answers = ['contact.name' => 'Syntetisk Testperson',
    'contact.email' => 'visitor@example.invalid', 'contact.message' => 'Syntetisk kontaktfråga.'];
$valid = hp_validate_lead(['contractVersion' => 1, 'technicalId' => 'quote-flow',
    'configurationId' => $kind, 'answers' => $answers]);
if (!$valid['valid']) throw new RuntimeException('Invalid fixture');
$config = ['smtp_host' => 'private-host-must-not-leak.invalid', 'smtp_username' => 'private-user',
    'smtp_password' => 'private-password', 'smtp_from' => 'sender@example.invalid',
    'recipient' => 'internal@example.invalid', 'mail_environment' => $environment];
$factory = static function () use ($config, $port) {
    $mail = hp_mailer($config, 587);
    $mail->Host = '127.0.0.1';
    $mail->Port = $port;
    $mail->SMTPAuth = false;
    $mail->SMTPSecure = '';
    $mail->SMTPAutoTLS = false;
    if (getenv('HP_SMTP_TEST_DEBUG') === '1') {
        $mail->SMTPDebug = 2;
        $mail->Debugoutput = static function ($text) { fwrite(STDERR, $text . "\n"); };
    }
    return $mail;
};
$summary = hp_answer_summary($kind, $valid['answers']);
$result = hp_deliver_enquiry($config, 587, $kind, $valid['answers'], '1234567890abcdef12345678',
    'Ny hallförfrågan', "Referens: 1234567890abcdef12345678\n\n" . $summary, $summary, $factory);
echo json_encode($result, JSON_THROW_ON_ERROR);
