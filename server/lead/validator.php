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
        count($input['answers']) > 24) {
        return ['valid' => false, 'errors' => ['_global' => 'Ogiltig förfrågan.']];
    }
    $kind = $input['configurationId'];
    if (!in_array($kind, ['hallpartner-contact-v1', 'hallpartner-offert-v1'], true)) {
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
    $allowed = array_merge($common, $kind === 'hallpartner-contact-v1' ? $contact : $quote);
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
    } else {
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
