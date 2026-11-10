<?php
declare(strict_types=1);

/**
 * Hallpartner quote e-mails only. Pure, non-networked HTML rendering.
 * Tables and inline styles are intentional for common e-mail clients.
 * Never use external images, scripts, tracking, or unsanitized field values.
 */
function hp_quote_mail_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function hp_quote_case_label(string $reference): string
{
    if (preg_match('/^[a-f0-9]{24}$/D', $reference) !== 1) {
        throw new InvalidArgumentException('Invalid server reference');
    }
    // Presentation label only; original 96-bit reference remains authoritative.
    return 'HP-' . strtoupper(substr($reference, 0, 10));
}

/**
 * The same field catalogue as the existing plain-text quote summary.
 * Unknown keys and missing/empty answers are never included.
 * Values are already validated by the receiver, but also HTML-escaped below.
 */
function hp_quote_mail_rows(array $answers): array
{
    $fields = json_decode(file_get_contents(__DIR__ . '/quote-fields.json'), true, 20, JSON_THROW_ON_ERROR);
    if (!is_array($fields)) throw new RuntimeException('Invalid quote fields');
    $result = [];
    foreach ($fields as $key => $field) {
        $raw = $answers[$key] ?? null;
        if (!is_string($raw) || trim($raw) === '') continue;
        $value = $field['options'][$raw] ?? $raw;
        $result[] = [
            'contact' => str_starts_with($key, 'contact.'),
            'label' => $field['label'],
            'value' => (string) $value
        ];
    }
    return $result;
}

function hp_quote_mail_rows_html(array $rows): string
{
    $html = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">';
    foreach ($rows as $row) {
        $label = hp_quote_mail_escape($row['label']);
        $value = nl2br(hp_quote_mail_escape($row['value']), false);
        $html .= '<tr>'
            . '<td width="39%" valign="top" style="padding:11px 10px 11px 0;border-bottom:1px solid #DEE5DD;font:600 13px/1.5 Arial,sans-serif;color:#536157;">' . $label . '</td>'
            . '<td valign="top" style="padding:11px 0;border-bottom:1px solid #DEE5DD;font:14px/1.5 Arial,sans-serif;color:#25362B;overflow-wrap:anywhere;word-break:break-word;">' . $value . '</td>'
            . '</tr>';
    }
    return $html . '</table>';
}

function hp_quote_mail_html(bool $internal, array $answers, string $reference): string
{
    $short = hp_quote_case_label($reference);
    $rows = hp_quote_mail_rows($answers);
    $project = array_values(array_filter($rows, static fn($item) => !$item['contact']));
    $contact = array_values(array_filter($rows, static fn($item) => $item['contact']));
    $title = $internal ? 'Ny offertförfrågan' : 'Vi har tagit emot din offertförfrågan';
    $label = $internal ? 'NY FÖRFRÅGAN' : 'BEKRÄFTELSE';
    $introduction = $internal
        ? 'En ny förfrågan har kommit in via Hallpartners offertguide på Amelios utvecklingspreview.'
        : 'Tack för din förfrågan till Hallpartner. Uppgifterna har tagits emot av Amelio i utvecklingspreviewn. Vi återkommer när vi har gått igenom ditt projekt.';

    $html = '<!doctype html><html lang="sv"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        . '<body style="margin:0;padding:0;background:#F1F1EE;color:#26362C;font-family:Arial,Helvetica,sans-serif;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F1F1EE" style="border-collapse:collapse;width:100%;background:#F1F1EE;">'
        . '<tr><td align="center" style="padding:28px 12px 36px;">'
        . '<table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="border-collapse:collapse;width:100%;max-width:640px;background:#FFFFFF;">'
        . '<tr><td style="padding:30px 32px 18px;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
        . '<td valign="top" style="font:800 17px/1.3 Arial,sans-serif;letter-spacing:.04em;color:#193B2E;">HALLPARTNER</td>'
        . '<td align="right" valign="top" style="font:700 10px/1.5 Arial,sans-serif;letter-spacing:.1em;color:#65776A;">' . $label . '</td>'
        . '</tr></table></td></tr>'
        . '<tr><td style="padding:0 32px;"><div style="border-top:1px solid #DEE5DD;height:1px;font-size:1px;">&nbsp;</div></td></tr>'
        . '<tr><td style="padding:25px 32px 0;">'
        . '<h1 style="margin:0;color:#193B2E;font:700 26px/1.2 Arial,sans-serif;">' . hp_quote_mail_escape($title) . '</h1>'
        . '<p style="margin:18px 0 0;color:#313D34;font:15px/1.7 Arial,sans-serif;">' . hp_quote_mail_escape($introduction) . '</p>'
        . '</td></tr>'
        . '<tr><td style="padding:24px 32px 5px;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EEF4EC" style="border-collapse:collapse;background:#EEF4EC;border-left:4px solid #287B39;">'
        . '<tr><td style="padding:19px 22px;">'
        . '<p style="margin:0 0 6px;color:#536957;font:600 13px/1.4 Arial,sans-serif;">' . ($internal ? 'Ärendenummer' : 'Ditt ärendenummer') . '</p>'
        . '<p style="margin:0;color:#193B2E;font:700 24px/1.3 Arial,sans-serif;letter-spacing:.025em;">' . hp_quote_mail_escape($short) . '</p>'
        . '</td></tr></table></td></tr>';

    if ($internal && $contact !== []) {
        $html .= '<tr><td style="padding:21px 32px 0;"><h2 style="margin:0 0 10px;font:700 15px/1.5 Arial,sans-serif;letter-spacing:.04em;color:#193B2E;">KUNDUPPGIFTER</h2>'
            . hp_quote_mail_rows_html($contact) . '</td></tr>';
    }
    if ($project !== []) {
        $html .= '<tr><td style="padding:24px 32px 0;"><h2 style="margin:0 0 10px;font:700 15px/1.5 Arial,sans-serif;letter-spacing:.04em;color:#193B2E;">'
            . ($internal ? 'PROJEKTUPPGIFTER' : 'SAMMANFATTNING') . '</h2>'
            . hp_quote_mail_rows_html($project) . '</td></tr>';
    }
    if (!$internal && $contact !== []) {
        $html .= '<tr><td style="padding:24px 32px 0;"><h2 style="margin:0 0 10px;font:700 15px/1.5 Arial,sans-serif;letter-spacing:.04em;color:#193B2E;">DINA KONTAKTUPPGIFTER</h2>'
            . hp_quote_mail_rows_html($contact) . '</td></tr>';
    }

    $footer = $internal
        ? 'Den här förfrågan har tagits emot av Amelio under utvecklingen, inte av Hallpartners ordinarie kundmottagning.'
        : 'Har du en komplettering kan du svara på det här mejlet och ange ärendenumret. Detta är en mottagningsbekräftelse, inte en bindande offert eller beställning.';
    $html .= '<tr><td style="padding:24px 32px 0;">'
        . '<p style="margin:0;color:#313D34;font:14px/1.7 Arial,sans-serif;">' . hp_quote_mail_escape($footer) . '</p>'
        . '</td></tr>'
        . '<tr><td style="padding:24px 32px 32px;">'
        . '<p style="margin:0 0 18px;color:#193B2E;font:700 14px/1.5 Arial,sans-serif;">' . ($internal ? 'Amelios utvecklingspreview' : 'Vänliga hälsningar') . '</p>';

    if (!$internal) {
        $html .= '<p style="margin:-14px 0 18px;color:#193B2E;font:700 15px/1.5 Arial,sans-serif;">Hallpartner / Amelios utvecklingspreview</p>';
    }
    $html .= '<div style="border-top:1px solid #DEE5DD;padding-top:13px;color:#667569;font:12px/1.65 Arial,sans-serif;">'
        . 'Tillfällig utvecklingspreview för Hallpartner. Meddelandet hanteras av Amelio.';
    if ($internal) {
        $html .= '<br>Tekniskt referens-ID: ' . hp_quote_mail_escape($reference);
    }
    return $html . '</div></td></tr></table></td></tr></table></body></html>';
}
