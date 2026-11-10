<?php
declare(strict_types=1);

require_once __DIR__ . '/../server/lead/quote-email-template.php';

function require_true(bool $condition, string $message): void
{
    if (!$condition) throw new RuntimeException($message);
}

$reference = '1234567890abcdef12345678';
require_true(hp_quote_case_label($reference) === 'HP-1234567890', 'Short reference format');
foreach (['', '1234', '1234567890ABCDEF12345678', '<script>'] as $wrong) {
    try {
        hp_quote_case_label($wrong);
        throw new RuntimeException('Invalid reference accepted: ' . $wrong);
    } catch (InvalidArgumentException) {
        // Correctly rejected.
    }
}

$answers = [
    'project.use' => 'storage',
    'project.hall_interest' => 'lagerhall',
    'dimensions.width' => '18,5',
    'dimensions.length' => '24',
    'site.city' => '<script>alert("x")</script>',
    'planning.timeline' => 'three_six',
    'contact.name' => '<img src=x onerror=alert(1)>',
    'contact.email' => 'test@example.invalid',
    'contact.phone' => '+46 70 000 00 00',
    'contact.message' => 'Extra key must not display',
    'private_conf' => 'hidden smtp password',
];
$customer = hp_quote_mail_html(false, $answers, $reference);
$internal = hp_quote_mail_html(true, $answers, $reference);
foreach ([$customer, $internal] as $html) {
    require_true(str_contains($html, 'HALLPARTNER'), 'Brand text');
    require_true(str_contains($html, 'HP-1234567890'), 'Short case number');
    require_true(str_contains($html, '#EEF4EC'), 'Shared muted-green case background');
    require_true(str_contains($html, 'multipart') === false, 'Template only renders HTML; PHPMailer supplies MIME');
    require_true(str_contains($html, 'Lager eller förvaring'), 'Human-readable answer');
    require_true(str_contains($html, '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'), 'Escape free text');
    require_true(str_contains($html, '&lt;img src=x onerror=alert(1)&gt;'), 'Escape contact input');
    require_true(!str_contains($html, '<script>'), 'No scripts');
    require_true(!str_contains($html, '<img'), 'No external images');
    require_true(!str_contains($html, 'hidden smtp password'), 'Unknown keys omitted');
    require_true(!str_contains($html, 'Extra key must not display'), 'Unapproved keys omitted');
    require_true(!str_contains($html, 'private-host'), 'No private hostname');
}
require_true(str_contains($customer, 'SAMMANFATTNING'), 'Customer project section');
require_true(!str_contains($customer, 'Tekniskt referens-ID'), 'No full technical ID label for customer');
require_true(!str_contains($customer, $reference), 'Full ID only internal');
require_true(str_contains($customer, 'DINA KONTAKTUPPGIFTER'), 'Customer copy keeps own contact details');
require_true(str_contains($internal, 'KUNDUPPGIFTER'), 'Internal contact section');
require_true(str_contains($internal, 'PROJEKTUPPGIFTER'), 'Internal full project section');
require_true(str_contains($internal, $reference), 'Internal technical ID');
require_true(!str_contains($customer, 'info@hallpartner.se'), 'No invented routing');
echo "PHP HTML quote template PASS: sanitization, short ID, content and scope\n";
