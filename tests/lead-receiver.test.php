<?php
declare(strict_types=1);
require_once __DIR__ . '/../server/lead/validator.php';

function must(bool $value, string $message): void {
    if (!$value) throw new RuntimeException('Failed: ' . $message);
}
$contact = [
    'contractVersion' => 1,
    'technicalId' => 'quote-flow',
    'configurationId' => 'hallpartner-contact-v1',
    'answers' => [
        'contact.name' => 'Test Person',
        'contact.email' => 'test@example.invalid',
        'contact.message' => 'Synthetic test enquiry, not a real person.',
        'contact.company' => '',
        'contact.phone' => '',
        'website' => '',
    ],
];
$valid = hp_validate_lead($contact);
must($valid['valid'] === true, 'valid contact accepted');
must(($valid['kind'] ?? '') === 'hallpartner-contact-v1', 'kind');
$invalid = $contact;
$invalid['answers']['contact.email'] = "attacker@example.invalid\r\nBcc: injected@example.invalid";
must(hp_validate_lead($invalid)['valid'] === false, 'email header injection denied');
$invalid = $contact;
$invalid['answers']['website'] = 'spam-link';
must(hp_validate_lead($invalid)['valid'] === false, 'honeypot denied');
$invalid = $contact;
$invalid['answers']['contact.message'] = 'short';
must(hp_validate_lead($invalid)['valid'] === false, 'short message denied');
$invalid = $contact;
$invalid['answers']['send_to'] = 'evil@example.invalid';
must(hp_validate_lead($invalid)['valid'] === false, 'unknown key denied');
$invalid = $contact;
$invalid['contractVersion'] = 2;
must(hp_validate_lead($invalid)['valid'] === false, 'wrong protocol version denied');
$invalid = $contact;
$invalid['answers']['contact.name'] = ['unexpected'];
must(hp_validate_lead($invalid)['valid'] === false, 'non-string rejected');
$invalid = $contact;
$invalid['answers']['contact.message'] = str_repeat('x', 20000);
must(hp_validate_lead($invalid)['valid'] === false, 'oversized payload rejected');

$quote = [
    'contractVersion' => 1,
    'technicalId' => 'quote-flow',
    'configurationId' => 'hallpartner-offert-v1',
    'answers' => [
        'project.use' => 'storage',
        'project.description' => 'Synthetic quotation request with no personal details.',
        'dimensions.confidence' => 'approximate',
        'dimensions.width' => '18,5',
        'dimensions.length' => '24',
        'site.city' => 'Teststad',
        'contact.name' => 'Test Contact',
        'contact.email' => 'test@example.invalid',
    ],
];
must(hp_validate_lead($quote)['valid'] === true, 'valid quote accepted');
$invalid = $quote;
$invalid['answers']['project.use'] = 'invalid-hall-sku';
must(hp_validate_lead($invalid)['valid'] === false, 'unknown choice rejected');
$invalid = $quote;
$invalid['answers']['dimensions.confidence'] = 'need_help';
must(hp_validate_lead($invalid)['valid'] === false, 'irrelevant dimensions rejected');
$invalid = $quote;
$invalid['answers']['dimensions.width'] = '-20';
must(hp_validate_lead($invalid)['valid'] === false, 'negative dimensions rejected');
$invalid = $quote;
$invalid['answers']['site.postal_code'] = '123 abc';
must(hp_validate_lead($invalid)['valid'] === false, 'invalid postal code rejected');


$v2 = [
    'contractVersion' => 1,
    'technicalId' => 'quote-flow',
    'configurationId' => 'hallpartner-offert-v2-review',
    'answers' => [
        'project.use' => 'storage',
        'project.description' => '',
        'dimensions.confidence' => '',
        'contact.name' => 'Syntetisk testperson',
        'contact.email' => 'test@example.invalid',
    ],
];
must(hp_validate_lead($v2)['valid'] === true, 'V2 three required answers without description or size');
$variant = $v2;
$variant['answers']['project.hall_interest'] = 'talthall';
$variant['answers']['dimensions.width'] = '18,5';
$variant['answers']['dimensions.length'] = '40';
$variant['answers']['site.city'] = 'Teststad';
$variant['answers']['site.decided'] = 'yes';
$variant['answers']['site.address'] = 'Testgatan 1';
$variant['answers']['foundation.status'] = 'planned';
$variant['answers']['foundation.notes'] = 'Syntetisk provgrund';
$variant['answers']['design.insulation'] = 'recommend';
$variant['answers']['openings.ports'] = 'yes';
$variant['answers']['openings.port_needs'] = 'Två större portar';
$variant['answers']['openings.windows'] = 'yes';
$variant['answers']['design.envelope_wishes'] = 'Ljusgrått tak';
$variant['answers']['design.installation_wishes'] = 'Ventilation';
$variant['answers']['delivery.wishes'] = 'Fråga om montage';
$variant['answers']['planning.stage'] = 'planning';
$variant['answers']['planning.timeline'] = 'three_six';
$variant['answers']['documents.available'] = 'some';
$variant['answers']['documents.description'] = 'Skiss finns';
$variant['answers']['planning.permit_status'] = 'not_checked';
$variant['answers']['planning.notes'] = 'Syntetisk notering';
$variant['answers']['contact.phone'] = '070 123 45 67';
$variant['answers']['contact.company'] = 'Testbolaget';
$variant['answers']['contact.role'] = 'contractor';
$variant['answers']['contact.preference'] = 'phone';
must(hp_validate_lead($variant)['valid'] === true, 'V2 full allowed active answers');
$invalid = $v2;
unset($invalid['answers']['project.use']);
must(hp_validate_lead($invalid)['valid'] === false, 'V2 requires use selection');
$invalid = $v2;
$invalid['answers']['project.use'] = 'not-approved';
must(hp_validate_lead($invalid)['valid'] === false, 'V2 choice allowlist');
$invalid = $variant;
$invalid['answers']['dimensions.confidence'] = 'need_help';
must(hp_validate_lead($invalid)['valid'] === false, 'V2 prohibits dimensions when user needs help');
$invalid = $v2;
$invalid['answers']['openings.ports'] = 'no';
$invalid['answers']['openings.port_needs'] = 'Hidden input bypass';
must(hp_validate_lead($invalid)['valid'] === false, 'V2 conditional field cannot be forged');
$invalid = $v2;
$invalid['answers']['documents.description'] = 'Hidden document bypass';
must(hp_validate_lead($invalid)['valid'] === false, 'V2 document condition');
$invalid = $v2;
$invalid['answers']['contact.preference'] = 'phone';
must(hp_validate_lead($invalid)['valid'] === false, 'V2 callback requires phone');
$invalid = $v2;
$invalid['answers']['recipient'] = 'unauthorized@example.invalid';
must(hp_validate_lead($invalid)['valid'] === false, 'V2 rejects unknown recipient key');
$invalid = $v2;
$invalid['answers']['project.description'] = str_repeat('x', 17000);
must(hp_validate_lead($invalid)['valid'] === false, 'V2 limits text length');
$invalid = $v2;
$invalid['answers']['contact.name'] = "Fake\\r\\nBcc: spam@example.invalid";
must(hp_validate_lead($invalid)['valid'] === false, 'V2 rejects header injection');

$dir = sys_get_temp_dir() . '/hp-intake-test-' . bin2hex(random_bytes(7));
must(mkdir($dir, 0700), 'create private rate directory');
try {
    $secret = str_repeat('a', 40);
    for ($i = 0; $i < 5; $i++) {
        must(hp_allow_rate($dir, $secret, '192.0.2.99', 1730000000) === true, 'allowed rate ' . $i);
    }
    must(hp_allow_rate($dir, $secret, '192.0.2.99', 1730000000) === false, '6th request blocked');
    must(hp_allow_rate($dir, $secret, '192.0.2.100', 1730000000) === true, 'separate address allowed');
    must(hp_allow_rate($dir, 'short', '192.0.2.101', 1730000000) === false, 'short rate secret denied');
    foreach (scandir($dir) as $file) {
        if ($file[0] === '.') continue;
        must(!str_contains($file, '192.0.2.'), 'no raw IP in file names');
    }
} finally {
    foreach (scandir($dir) as $file) {
        if ($file[0] !== '.') unlink($dir . '/' . $file);
    }
    rmdir($dir);
}
echo "PHP intake validator: valid/invalid contact & offer, honeypot and rate limits PASS\n";
