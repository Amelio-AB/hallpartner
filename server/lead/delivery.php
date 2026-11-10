<?php
declare(strict_types=1);

/** A fresh mailer per envelope prevents visitor/internal recipients leaking across messages. */
function hp_mailer(array $config, int $port): \PHPMailer\PHPMailer\PHPMailer
{
    $mailer = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = $config['smtp_host'];
    $mailer->SMTPAuth = true;
    $mailer->Username = $config['smtp_username'];
    $mailer->Password = $config['smtp_password'];
    $mailer->SMTPSecure = $port === 465
        ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
        : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mailer->Port = $port;
    $mailer->Timeout = 15;
    $mailer->getSMTPInstance()->Timelimit = 15;
    $mailer->CharSet = 'UTF-8';
    $mailer->setFrom($config['smtp_from'], 'Hallpartner webbplats');
    $mailer->isHTML(false);
    return $mailer;
}

/**
 * No automatic retries. Once the primary SMTP send succeeds, customer-copy errors
 * can only affect customerCopy, never the accepted enquiry's status.
 * The optional factory supplies an isolated transport in tests, never HTTP input.
 */
function hp_deliver_enquiry(array $config, int $port, string $kind, array $answers,
    string $reference, string $subject, string $body, string $summary, ?callable $factory = null): array
{
    $factory ??= static fn() => hp_mailer($config, $port);
    try {
        if ($kind === 'hallpartner-offert-v2-review') {
            require_once __DIR__ . '/quote-email-template.php';
        }
        $primary = $factory();
        $primary->addAddress($config['recipient']);
        $primary->addReplyTo($answers['contact.email'], $answers['contact.name']);
        $primary->Subject = $subject . ' [' . ($kind === 'hallpartner-offert-v2-review' ? hp_quote_case_label($reference) : $reference) . ']';
        if ($kind === 'hallpartner-offert-v2-review') {
            $primary->isHTML(true);
            $primary->Body = hp_quote_mail_html(true, $answers, $reference);
            $primary->AltBody = 'Ärendenummer: ' . hp_quote_case_label($reference) . "\n" . $body;
        } else {
            // Contact/V1 stays plain text, with exactly its existing message body.
            $primary->Body = $body;
        }
        if ($primary->send() !== true) throw new RuntimeException('SMTP not confirmed');
    } catch (Throwable) {
        error_log('[Hallpartner intake] SMTP outcome unknown, reference ' . $reference);
        return ['status' => 'unknown'];
    }

    $result = ['status' => 'success', 'requestId' => $reference];
    // Do not change contact/V1 behaviour.
    if ($kind !== 'hallpartner-offert-v2-review') return $result;
    $result['customerCopy'] = 'unconfirmed';
    try {
        $copy = $factory();
        $copy->Timeout = 5;
        $copy->getSMTPInstance()->Timelimit = 5;
        $copy->setFrom($config['smtp_from'], 'Amelio');
        $copy->Hostname = substr(strrchr($config['smtp_from'], '@'), 1);
        $copy->XMailer = ' ';
        $copy->addAddress($answers['contact.email']);
        $copy->addReplyTo($config['recipient'], 'Amelio');
        $short = hp_quote_case_label($reference);
        $copy->Subject = 'Vi har tagit emot din offertförfrågan [' . $short . ']';
        $copy->isHTML(true);
        $copy->Body = hp_quote_mail_html(false, $answers, $reference);
        $copy->AltBody = "Vi har tagit emot din offertförfrågan\n\n" .
            "Amelio har tagit emot din förfrågan i Hallpartners utvecklingspreview. " .
            "Vi återkommer så snart vi kan.\n\nÄrendenummer: " . $short . "\n\n" .
            "Här är en kopia av dina svar:\n\n" . $summary .
            "Detta är ingen prisuppgift, bindande offert eller beställning.\n" .
            "Du kan svara på detta mejl för att kontakta Amelio.\n";
        if ($copy->send() === true) $result['customerCopy'] = 'accepted';
    } catch (Throwable) {
        // May have been accepted before timeout; do not retry or expose diagnostics.
    }
    if ($result['customerCopy'] !== 'accepted') {
        error_log('[Hallpartner intake] Customer copy unconfirmed, reference ' . $reference);
    }
    return $result;
}
