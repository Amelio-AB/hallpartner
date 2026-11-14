<?php
declare(strict_types=1);

/**
 * Creates one fresh PHPMailer envelope. Transport factory exists only for
 * isolated CLI tests; HTTP never receives it or controls mail headers.
 */
function hp_os_mailer(array $config): \PHPMailer\PHPMailer\PHPMailer
{
    $mailer = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = $config['smtp_host'];
    $mailer->SMTPAuth = true;
    $mailer->Username = $config['smtp_username'];
    $mailer->Password = $config['smtp_password'];
    $mailer->Port = (int) $config['smtp_port'];
    $mailer->SMTPSecure = $mailer->Port === 465
        ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
        : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mailer->SMTPAutoTLS = true;
    $mailer->Timeout = 10;
    $mailer->CharSet = 'UTF-8';
    $mailer->XMailer = ' ';
    $mailer->setFrom('offert@hallpartner.se', 'Hallpartner – beställningsunderlag');
    $mailer->isHTML(false);
    return $mailer;
}
function hp_os_send(array $config, string $recipient, string $subject,
    string $message, ?string $pdf = null, ?string $reference = null, ?callable $factory = null): bool
{
    if (($config['enabled'] ?? false) !== true ||
        ($config['smtp_from'] ?? null) !== 'offert@hallpartner.se' ||
        !filter_var($recipient, FILTER_VALIDATE_EMAIL) ||
        !in_array((int) ($config['smtp_port'] ?? 0), [465,587], true)) {
        throw new RuntimeException('Mail sending disabled or misconfigured');
    }
    $factory ??= static fn() => hp_os_mailer($config);
    $mail = $factory();
    $mail->addAddress($recipient);
    $mail->Subject = $subject;
    $mail->Body = $message;
    if ($pdf !== null) {
        if (!is_string($reference) || !preg_match('/^HP-[A-Z0-9]{10}$/D', $reference)
            || strlen($pdf) > 8*1024*1024 || !str_starts_with($pdf, '%PDF-')) {
            throw new RuntimeException('Invalid PDF attachment');
        }
        $mail->addStringAttachment($pdf, $reference . '.pdf', 'base64', 'application/pdf');
    }
    return $mail->send() === true;
}
