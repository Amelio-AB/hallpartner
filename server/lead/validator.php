<?php
declare(strict_types=1);

/**
 * Independent receiver validation for AMP-001 quote-flow JSON protocol v1.
 * No SMTP, filesystem, cookies or visitor data logs here.
 *
 * @return array{valid:bool,kind?:string,answers?:array<string,string>,errors?:array<string,string>}
 */
function hp_validate_lead(mixed $input): array
{
    if (!is_array($input) ||
        ($input['contractVersion'] ?? null) !== 1 ||
        ($input['technicalId'] ?? null) !== 'quote-flow' ||
        !is_string($input['configurationId'] ?? null) ||
        !is_array($input['answers'] ?? null) ||
        array_is_list($input['answers']) ||
        count($input['answers']) > 40) {
        return ['valid' => false, 'errors' => ['_global' => 'Ogiltig förfrågan.']];
    }
    $kind = $input['configurationId'];
    if (!in_array($kind, ['hallpartner-contact-v1', 'hallpartner-offert-v1', 'hallpartner-offert-v2-review'], true)) {
        return ['valid' => false, 'errors' => ['_global' => 'Okänd formulärtyp.']];
    }

    $common = [
        'contact.name' => 120,
        'contact.email' => 254,
        'contact.phone' => 22,
        'contact.company' => 120,
    ];
    $contact = [
        'contact.message' => 4000,
        'website' => 200, // honeypot: expected to be empty
    ];
    $quote = [
        'project.use' => 24,
        'project.description' => 4000,
        'dimensions.confidence' => 16,
        'dimensions.width' => 12,
        'dimensions.length' => 12,
        'dimensions.side_height' => 12,
        'site.city' => 120,
        'site.postal_code' => 6,
    ];
    $quoteV2 = [
        'project.use' => 24,
        'project.description' => 4000,
        'project.hall_interest' => 32,
        'dimensions.confidence' => 16,
        'dimensions.width' => 12,
        'dimensions.length' => 12,
        'dimensions.side_height' => 12,
        'site.city' => 120,
        'site.postal_code' => 6,
        'site.decided' => 16,
        'site.address' => 240,
        'foundation.status' => 16,
        'foundation.notes' => 4000,
        'design.insulation' => 16,
        'openings.ports' => 16,
        'openings.port_needs' => 4000,
        'openings.windows' => 16,
        'design.envelope_wishes' => 4000,
        'design.installation_wishes' => 4000,
        'delivery.wishes' => 4000,
        'planning.stage' => 16,
        'planning.timeline' => 16,
        'documents.available' => 16,
        'documents.description' => 4000,
        'planning.permit_status' => 24,
        'planning.notes' => 4000,
        'contact.role' => 20,
        'contact.preference' => 16,
    ];
    $allowed = array_merge($common, $kind === 'hallpartner-contact-v1' ? $contact :
        ($kind === 'hallpartner-offert-v1' ? $quote : $quoteV2));
    $values = [];
    $errors = [];
    foreach ($input['answers'] as $key => $value) {
        if (!is_string($key) || !array_key_exists($key, $allowed) || !is_string($value)) {
            return ['valid' => false, 'errors' => ['_global' => 'Formuläret innehåller ogiltiga fält.']];
        }
        if (strlen($value) > $allowed[$key] * 4 || preg_match('//u', $value) !== 1) {
            $errors[$key] = 'Texten är för lång eller ogiltig.';
            continue;
        }
        $normalized = trim($value);
        if (strlen($normalized) > $allowed[$key] * 4 ||
            preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $normalized)) {
            $errors[$key] = 'Ogiltiga tecken.';
            continue;
        }
        if (!in_array($key, ['contact.message', 'project.description'], true) &&
            (str_contains($normalized, "\r") || str_contains($normalized, "\n"))) {
            $errors[$key] = 'Fältet måste vara en rad.';
            continue;
        }
        $values[$key] = $normalized;
    }

    foreach (['contact.name', 'contact.email'] as $key) {
        if (!isset($values[$key]) || $values[$key] === '') {
            $errors[$key] = 'Fältet måste fyllas i.';
        }
    }
    if (isset($values['contact.name']) && strlen($values['contact.name']) < 2) {
        $errors['contact.name'] = 'Ange minst två tecken.';
    }
    if (isset($values['contact.email']) &&
        filter_var($values['contact.email'], FILTER_VALIDATE_EMAIL) === false) {
        $errors['contact.email'] = 'Kontrollera e-postadressen.';
    }
    if (!empty($values['contact.phone']) &&
        preg_match('/^[+0-9 ()-]{6,22}$/', $values['contact.phone']) !== 1) {
        $errors['contact.phone'] = 'Kontrollera telefonnumret.';
    }

    if ($kind === 'hallpartner-contact-v1') {
        if (strlen($values['contact.message'] ?? '') < 10) {
            $errors['contact.message'] = 'Beskriv din fråga med minst tio tecken.';
        }
        if (!empty($values['website'])) {
            return ['valid' => false, 'errors' => ['_global' => 'Förfrågan kunde inte tas emot.']];
        }
    } elseif ($kind === 'hallpartner-offert-v1') {
        if (!in_array($values['project.use'] ?? '', ['storage','machinery','riding','other','unknown'], true)) {
            $errors['project.use'] = 'Välj ett giltigt alternativ.';
        }
        if (strlen($values['project.description'] ?? '') < 10) {
            $errors['project.description'] = 'Beskriv projektet med minst tio tecken.';
        }
        $confidence = $values['dimensions.confidence'] ?? '';
        if (!in_array($confidence, ['exact','approximate','need_help'], true)) {
            $errors['dimensions.confidence'] = 'Välj ett giltigt alternativ.';
        }
        foreach (['dimensions.width','dimensions.length','dimensions.side_height'] as $key) {
            if (!empty($values[$key])) {
                if ($confidence === 'need_help') {
                    $errors[$key] = 'Fältet är inte relevant för valt svar.';
                    continue;
                }
                if (preg_match('/^\d{1,3}([,.]\d{1,2})?$/', $values[$key]) !== 1 ||
                    (float)str_replace(',', '.', $values[$key]) <= 0) {
                    $errors[$key] = 'Ange ett positivt mått i meter.';
                }
            }
        }
        if (!empty($values['site.postal_code']) &&
            preg_match('/^\d{3} ?\d{2}$/', $values['site.postal_code']) !== 1) {
            $errors['site.postal_code'] = 'Ange fem siffror.';
        }
    }
    if ($kind === 'hallpartner-offert-v2-review') {
        // Independently enforce the V2 client schema. Empty optional answers are valid.
        $choices = [
            'project.use' => ['storage','machinery','riding','other','unknown'],
            'project.hall_interest' => ['lagerhall','maskinhall','plathall','talthall','ridhus','isolerad-hall','unknown'],
            'dimensions.confidence' => ['exact','approximate','need_help'],
            'site.decided' => ['yes','no','unknown'],
            'foundation.status' => ['existing','planned','none','unknown'],
            'design.insulation' => ['yes','no','recommend','unknown'],
            'openings.ports' => ['yes','no','unknown'],
            'openings.windows' => ['yes','no','unknown'],
            'planning.stage' => ['ideas','planning','permit','ready','unknown'],
            'planning.timeline' => ['soon','within_3','three_six','six_twelve','later','unknown'],
            'documents.available' => ['yes','some','later','no'],
            'planning.permit_status' => ['not_checked','considering','submitted','approved','unknown'],
            'contact.role' => ['customer','contractor','advisor','other'],
            'contact.preference' => ['email','phone','either'],
        ];
        foreach ($choices as $key => $options) {
            if (($values[$key] ?? '') !== '' && !in_array($values[$key], $options, true)) {
                $errors[$key] = 'Välj ett giltigt alternativ.';
            }
        }
        if (!in_array($values['project.use'] ?? '', $choices['project.use'], true)) {
            $errors['project.use'] = 'Välj ett giltigt användningsområde.';
        }
        foreach (['dimensions.width','dimensions.length','dimensions.side_height'] as $key) {
            if (($values[$key] ?? '') === '') continue;
            if (($values['dimensions.confidence'] ?? '') === 'need_help') {
                $errors[$key] = 'Mått ska inte skickas när hjälp med storlek valts.';
                continue;
            }
            $pattern = $key === 'dimensions.side_height'
                ? '/^\\d{1,2}([,.]\\d{1,2})?$/'
                : '/^\\d{1,3}([,.]\\d{1,2})?$/';
            if (!preg_match($pattern, $values[$key]) ||
                (float)str_replace(',', '.', $values[$key]) <= 0) {
                $errors[$key] = 'Ange ett positivt mått i meter.';
            }
        }
        if (($values['site.postal_code'] ?? '') !== '' &&
            !preg_match('/^\\d{3} ?\\d{2}$/', $values['site.postal_code'])) {
            $errors['site.postal_code'] = 'Ange fem siffror.';
        }
        $conditional = [
            'site.address' => ($values['site.decided'] ?? '') === 'yes',
            'foundation.notes' => in_array($values['foundation.status'] ?? '', ['existing','planned'], true),
            'openings.port_needs' => ($values['openings.ports'] ?? '') === 'yes',
            'documents.description' => in_array($values['documents.available'] ?? '', ['yes','some'], true),
        ];
        foreach ($conditional as $key => $relevant) {
            if (!$relevant && ($values[$key] ?? '') !== '') {
                $errors[$key] = 'Fältet är inte relevant för valt svar.';
            }
        }
        if (($values['contact.preference'] ?? '') === 'phone' &&
            ($values['contact.phone'] ?? '') === '') {
            $errors['contact.preference'] = 'Ange telefonnummer om du vill bli uppringd.';
        }
    }
    if ($errors !== []) {
        return ['valid' => false, 'errors' => $errors];
    }
    return ['valid' => true, 'kind' => $kind, 'answers' => $values];
}

/**
 * Rate counting stores only a keyed digest of the address; no raw IP or PII.
 * Directory must be private and writable, outside public_html.
 */
function hp_allow_rate(string $directory, string $secret, string $address, int $now): bool
{
    if (strlen($secret) < 32 || !is_dir($directory) || !is_writable($directory)) return false;
    // Serialize pruning against readers that may already have opened a rate file.
    $lock = @fopen(rtrim($directory, '/') . '/.cleanup.lock', 'c');
    if ($lock === false) return false;
    @chmod(rtrim($directory, '/') . '/.cleanup.lock', 0600);
    try {
        if (!flock($lock, LOCK_SH)) return false;
        return hp_write_rate($directory, $secret, $address, $now);
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function hp_write_rate(string $directory, string $secret, string $address, int $now): bool
{
    if (strlen($secret) < 32 || !is_dir($directory) || !is_writable($directory)) return false;
    $digest = hash_hmac('sha256', $address, $secret);
    $path = rtrim($directory, '/') . '/lead-' . $digest . '.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false) return false;
    @chmod($path, 0600);
    try {
        if (!flock($handle, LOCK_EX)) return false;
        rewind($handle);
        $decoded = json_decode(stream_get_contents($handle), true);
        $times = is_array($decoded) ? array_filter($decoded, static fn($v) => is_int($v) && $v > $now - 3600 && $v <= $now) : [];
        if (count($times) >= 5) return false;
        $times[] = $now;
        rewind($handle);
        if (!ftruncate($handle, 0)) return false;
        $written = fwrite($handle, json_encode(array_values($times), JSON_THROW_ON_ERROR));
        fflush($handle);
        return $written !== false;
    } catch (Throwable) {
        return false;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}
