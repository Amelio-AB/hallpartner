<?php
declare(strict_types=1);

/** Manual, isolated SMTP smoke test: one synthetic message, never customer data. */
if (PHP_SAPI !== 'cli' || ($_SERVER['argc'] ?? 0) !== 2 ||
    ($_SERVER['argv'][1] ?? '') !== '--send-test') {
    fwrite(STDERR, "No message sent. Use --send-test explicitly after private setup.\n");
    exit(2);
}
$configPath = __DIR__ . '/config.local.php';
$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!is_file($configPath) || !is_file($autoloadPath)) {
    fwrite(STDERR, "No message sent: private config or Composer vendor is missing.\n");
    exit(2);
}
$config = require $configPath;
if (!is_array($config)) {
    fwrite(STDERR, "No message sent: private configuration invalid.\n");
    exit(2);
}
foreach (['smtp_host','smtp_username','smtp_password','smtp_from','recipient'] as $key) {
    if (!is_string($config[$key] ?? null) || trim($config[$key]) === '') {
        fwrite(STDERR, "No message sent: SMTP configuration incomplete.\n");
        exit(2);
    }
}
$port = $config['smtp_port'] ?? null;
if (!is_int($port) || !in_array($port, [465,587], true) ||
    !filter_var($config['smtp_username'], FILTER_VALIDATE_EMAIL) ||
    !filter_var($config['smtp_from'], FILTER_VALIDATE_EMAIL) ||
    !filter_var($config['recipient'], FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "No message sent: SMTP port or address invalid.\n");
    exit(2);
}
require_once $autoloadPath;
$ref = bin2hex(random_bytes(6));
try {
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = $port === 465
        ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
        : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $port;
    $mail->Timeout = 15;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['smtp_from'], 'Hallpartner test');
    $mail->addAddress($config['recipient']);
    $mail->isHTML(false);
    $mail->Subject = 'Hallpartner: syntetiskt SMTP-test [' . $ref . ']';
    $mail->Body = "Testmeddelande utan kunduppgifter.\n"
        . "Hallpartners publika kontakt- och offertformulär är fortfarande avstängda.\n"
        . "Referens: " . $ref . "\n";
    if ($mail->send() !== true) throw new RuntimeException('SMTP not accepted');
    echo "SMTP-servern accepterade testmeddelandet. Referens: "
       . $ref . "\nKontrollera själv mottagarens inkorg.\n";
} catch (Throwable) {
    fwrite(STDERR, "SMTP-testet kunde inte bekräftas. Kontrollera privata kontoinställningar; inga publika formulär aktiverades.\n");
    exit(1);
}
