<?php
declare(strict_types=1);
require_once __DIR__ . '/../server/lead/contact-email-template.php';

function hp_contact_assert(bool $condition, string $label): void {
    if (!$condition) throw new RuntimeException('Contact email test failed: ' . $label);
}

$id = '1234567890abcdef12345678';
$answers = [
    'contact.name' => '<img src=x onerror=alert(1)>',
    'contact.email' => 'visitor@example.invalid',
    'contact.phone' => '+46 70 000 00 00',
    'contact.message' => "<script>alert(1)</script>\nAndra raden",
    'recipient' => 'unauthorized@example.invalid',
    'smtp_password' => 'secret-not-for-rendering',
];

$internal = hp_contact_mail_html(true, $answers, $id);
$customer = hp_contact_mail_html(false, $answers, $id);

foreach ([$internal, $customer] as $html) {
    hp_contact_assert(str_contains($html, 'HALLPARTNER'), 'brand');
    hp_contact_assert(str_contains($html, 'HP-1234567890'), 'short case number');
    hp_contact_assert(str_contains($html, '#EEF4EC'), 'green case box');
    hp_contact_assert(str_contains($html, '&lt;img src=x onerror=alert(1)&gt;'), 'name escaped');
    hp_contact_assert(str_contains($html, '&lt;script&gt;alert(1)&lt;/script&gt;'), 'message escaped');
    hp_contact_assert(str_contains($html, 'Andra raden'), 'message intact');
    hp_contact_assert(!str_contains($html, '<script>'), 'no executable script');
    hp_contact_assert(!str_contains($html, '<img'), 'no image execution');
    hp_contact_assert(!str_contains($html, 'secret-not-for-rendering'), 'no private keys');
    hp_contact_assert(!str_contains($html, 'unauthorized@example.invalid'), 'no unknown fields');
    hp_contact_assert(str_contains($html, 'testmiljö'), 'preview is clearly marked as test');
    hp_contact_assert(!str_contains($html, 'Amelio'), 'no developer brand in customer mail');
}
hp_contact_assert(str_contains($internal, 'KUNDUPPGIFTER'), 'internal contact list');
hp_contact_assert(str_contains($internal, 'MEDDELANDE'), 'internal message');
hp_contact_assert(str_contains($internal, $id), 'internal reference');
hp_contact_assert(!str_contains($customer, $id), 'no full reference to customer');
hp_contact_assert(!str_contains($customer, 'Tekniskt referens-ID'), 'no internal reference label');
hp_contact_assert(str_contains($customer, 'DITT MEDDELANDE'), 'customer copy of question');
hp_contact_assert(str_contains($customer, 'DINA KONTAKTUPPGIFTER'), 'customer details');
hp_contact_assert(!str_contains(hp_contact_mail_html(false, [
    'contact.name' => 'Test', 'contact.email' => 'visitor@example.invalid',
    'contact.message' => 'Hej'
], $id), 'Telefon'), 'optional phone omitted');

foreach ([
    hp_contact_mail_html(false, $answers, $id, 'production'),
    hp_contact_mail_html(true, $answers, $id, 'production'),
] as $html) {
    hp_contact_assert(!str_contains($html, 'Amelio'), 'production no developer brand');
    hp_contact_assert(!str_contains($html, 'testmiljö'), 'production not a test email');
    hp_contact_assert(!str_contains($html, 'utvecklingspreview'), 'production not preview');
    hp_contact_assert(str_contains($html, 'Hallpartner'), 'production sender identity');
}
try {
    hp_contact_mail_html(false, $answers, $id, 'unknown');
    throw new RuntimeException('Invalid contact mail environment accepted');
} catch (InvalidArgumentException) {
    // Expected.
}
echo "PHP contact email template PASS: escaping, reference, optional phone and scope\n";
