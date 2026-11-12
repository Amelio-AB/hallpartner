<?php
declare(strict_types=1);

/**
 * Contact/V1 HTML in the same email visual system as the reviewed quote/V2.
 * Rendering only: no network, no user-supplied HTML, no extra recipients.
 */
require_once __DIR__ . '/quote-email-template.php';

function hp_contact_mail_html(bool $internal, array $answers, string $reference): string
{
    $short = hp_quote_case_label($reference);
    $name = (string) ($answers['contact.name'] ?? '');
    $email = (string) ($answers['contact.email'] ?? '');
    $phone = (string) ($answers['contact.phone'] ?? '');
    $message = (string) ($answers['contact.message'] ?? '');

    $rows = [
        ['label' => 'Namn', 'value' => $name],
        ['label' => 'E-post', 'value' => $email],
    ];
    if (trim($phone) !== '') $rows[] = ['label' => 'Telefon', 'value' => $phone];

    $escape = 'hp_quote_mail_escape';
    $title = $internal ? 'Nytt kontaktmeddelande' : 'Vi har tagit emot ditt meddelande';
    $tag = $internal ? 'NYTT MEDDELANDE' : 'BEKRÄFTELSE';
    $intro = $internal
        ? 'Ett nytt meddelande har kommit in via Hallpartners kontaktformulär på Amelios utvecklingspreview.'
        : 'Tack för att du kontaktade Hallpartner. Amelio har tagit emot meddelandet i utvecklingspreviewn och ansvarar för återkopplingen under testperioden.';
    $footer = $internal
        ? 'Detta är en tillfällig utvecklingspreview. Meddelandet hanteras av Amelio, inte Hallpartners ordinarie kundmottagning.'
        : 'Du behöver inte skicka meddelandet igen. Om du vill komplettera kan du svara på det här mejlet och ange ditt ärendenummer.';

    $html = '<!doctype html><html lang="sv"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        . '<body style="margin:0;padding:0;background:#F1F1EE;color:#26362C;font-family:Arial,Helvetica,sans-serif;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F1F1EE" style="border-collapse:collapse;width:100%;background:#F1F1EE;"><tr><td align="center" style="padding:28px 12px 36px;">'
        . '<table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="border-collapse:collapse;width:100%;max-width:640px;background:#FFFFFF;">'
        . '<tr><td style="padding:30px 32px 18px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
        . '<td valign="top" style="font:800 17px/1.3 Arial,sans-serif;letter-spacing:.04em;color:#193B2E;">HALLPARTNER</td>'
        . '<td align="right" valign="top" style="font:700 10px/1.5 Arial,sans-serif;letter-spacing:.1em;color:#65776A;">' . $tag . '</td>'
        . '</tr></table></td></tr>'
        . '<tr><td style="padding:0 32px;"><div style="border-top:1px solid #DEE5DD;height:1px;font-size:1px;">&nbsp;</div></td></tr>'
        . '<tr><td style="padding:25px 32px 0;">'
        . '<h1 style="margin:0;color:#193B2E;font:700 26px/1.2 Arial,sans-serif;">' . $escape($title) . '</h1>'
        . '<p style="margin:18px 0 0;color:#313D34;font:15px/1.7 Arial,sans-serif;">' . $escape($intro) . '</p>'
        . '</td></tr>'
        . '<tr><td style="padding:24px 32px 5px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EEF4EC" style="border-collapse:collapse;background:#EEF4EC;border-left:4px solid #287B39;"><tr><td style="padding:19px 22px;">'
        . '<p style="margin:0 0 6px;color:#536957;font:600 13px/1.4 Arial,sans-serif;">' . ($internal ? 'Ärendenummer' : 'Ditt ärendenummer') . '</p>'
        . '<p style="margin:0;color:#193B2E;font:700 24px/1.3 Arial,sans-serif;">' . $escape($short) . '</p>'
        . '</td></tr></table></td></tr>'
        . '<tr><td style="padding:23px 32px 0;"><h2 style="margin:0 0 10px;font:700 15px/1.5 Arial,sans-serif;color:#193B2E;">'
        . ($internal ? 'KUNDUPPGIFTER' : 'DINA KONTAKTUPPGIFTER') . '</h2>'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">';

    foreach ($rows as $row) {
        $html .= '<tr><td width="39%" valign="top" style="padding:11px 10px 11px 0;border-bottom:1px solid #DEE5DD;font:600 13px/1.5 Arial,sans-serif;color:#536157;">'
            . $escape($row['label']) . '</td><td valign="top" style="padding:11px 0;border-bottom:1px solid #DEE5DD;font:14px/1.5 Arial,sans-serif;color:#25362B;overflow-wrap:anywhere;">'
            . nl2br($escape($row['value']), false) . '</td></tr>';
    }

    $html .= '</table></td></tr>'
        . '<tr><td style="padding:24px 32px 0;"><h2 style="margin:0 0 10px;font:700 15px/1.5 Arial,sans-serif;color:#193B2E;">'
        . ($internal ? 'MEDDELANDE' : 'DITT MEDDELANDE') . '</h2>'
        . '<p style="margin:0;padding:16px;background:#F5F7F3;border:1px solid #DEE5DD;color:#26362C;font:14px/1.7 Arial,sans-serif;overflow-wrap:anywhere;">'
        . nl2br($escape($message), false) . '</p></td></tr>'
        . '<tr><td style="padding:25px 32px 0;"><p style="margin:0;color:#313D34;font:14px/1.7 Arial,sans-serif;">' . $escape($footer) . '</p></td></tr>'
        . '<tr><td style="padding:24px 32px 32px;"><p style="margin:0 0 18px;color:#193B2E;font:700 14px/1.5 Arial,sans-serif;">'
        . ($internal ? 'Amelios utvecklingspreview' : 'Vänliga hälsningar') . '</p>';
    if (!$internal) {
        $html .= '<p style="margin:-14px 0 18px;color:#193B2E;font:700 15px/1.5 Arial,sans-serif;">Hallpartner / Amelios utvecklingspreview</p>';
    }
    $html .= '<div style="border-top:1px solid #DEE5DD;padding-top:13px;color:#667569;font:12px/1.65 Arial,sans-serif;">'
        . 'Tillfällig utvecklingspreview för Hallpartner. Meddelandet hanteras av Amelio.';
    if ($internal) $html .= '<br>Tekniskt referens-ID: ' . $escape($reference);
    return $html . '</div></td></tr></table></td></tr></table></body></html>';
}
