<?php
declare(strict_types=1);

/**
 * Validate against the frozen C schema copied byte-for-byte into this private
 * module at build time. This limited schema interpreter FAILS CLOSED on any
 * unsupported keyword/type. See the exact source schema SHA in README.
 */
function hp_os_invalid(string $path): never
{
    throw new InvalidArgumentException($path);
}
function hp_os_node(mixed $value, array $schema, string $path = '$'): void
{
    $supported = ['type','const','enum','minLength','maxLength','format','pattern',
        'minimum','maximum','exclusiveMinimum','exclusiveMaximum','items','maxItems','minItems',
        'uniqueItems','properties','required','additionalProperties','description','$comment',
        'title','default','examples'];
    foreach ($schema as $key => $_) {
        if (!in_array($key, $supported, true)) hp_os_invalid('unsupported-schema-key:' . $key);
    }
    if (array_key_exists('const', $schema) && $value !== $schema['const']) hp_os_invalid($path);
    if (array_key_exists('enum', $schema) && !in_array($value, $schema['enum'], true)) hp_os_invalid($path);
    if (isset($schema['type'])) {
        $validType = match ($schema['type']) {
            'object' => is_array($value) && (count($value) === 0 || !array_is_list($value)),
            'array' => is_array($value) && array_is_list($value),
            'string' => is_string($value),
            'number' => (is_float($value) || is_int($value)) && is_finite((float) $value),
            'integer' => is_int($value),
            'boolean' => is_bool($value),
            default => false,
        };
        if (!$validType) hp_os_invalid($path);
    }
    if (is_string($value)) {
        // Supplier PDF must not silently replace invalid Unicode or controls.
        if (!mb_check_encoding($value, 'UTF-8') ||
            preg_match('/[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]/u', $value)) hp_os_invalid($path);
        $length = mb_strlen($value, 'UTF-8');
        if (($schema['maxLength'] ?? PHP_INT_MAX) < $length ||
            ($schema['minLength'] ?? 0) > $length || str_contains($value, "\0")) hp_os_invalid($path);
        if (isset($schema['pattern']) && @preg_match('~' . str_replace('~','\~',$schema['pattern']) . '~D', $value) !== 1) hp_os_invalid($path);
        if (isset($schema['format'])) {
            if ($schema['format'] === 'email' &&
                (!filter_var($value, FILTER_VALIDATE_EMAIL) || strpbrk($value, "\r\n") !== false)) hp_os_invalid($path);
            if ($schema['format'] === 'uuid' &&
                !preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iD', $value)) hp_os_invalid($path);
            if ($schema['format'] === 'date' &&
                (!preg_match('/^\d{4}-\d{2}-\d{2}$/D', $value) ||
                 !checkdate((int) substr($value,5,2), (int) substr($value,8,2), (int) substr($value,0,4)))) hp_os_invalid($path);
            if (!in_array($schema['format'], ['email','uuid','date'], true)) hp_os_invalid('unsupported-format:' . $schema['format']);
        }
    }
    if (is_float($value) || is_int($value)) {
        foreach (['minimum','maximum','exclusiveMinimum','exclusiveMaximum'] as $bound) {
            if (!isset($schema[$bound])) continue;
            $limit = (float) $schema[$bound];
            $valid = match ($bound) {
                'minimum' => $value >= $limit, 'maximum' => $value <= $limit,
                'exclusiveMinimum' => $value > $limit, 'exclusiveMaximum' => $value < $limit,
            };
            if (!$valid) hp_os_invalid($path);
        }
    }
    if (($schema['type'] ?? null) === 'object') {
        $properties = $schema['properties'] ?? [];
        foreach ($schema['required'] ?? [] as $key) {
            if (!array_key_exists($key, $value)) hp_os_invalid($path . '.' . $key);
        }
        foreach ($value as $key => $field) {
            if (!array_key_exists($key, $properties)) {
                if (($schema['additionalProperties'] ?? true) !== true) hp_os_invalid($path . '.' . $key);
                // No public value may be accepted if the schema did not define its type.
                hp_os_invalid($path . '.' . $key);
            }
            hp_os_node($field, $properties[$key], $path . '.' . $key);
        }
    }
    if (($schema['type'] ?? null) === 'array') {
        if (count($value) > ($schema['maxItems'] ?? 1000) ||
            count($value) < ($schema['minItems'] ?? 0)) hp_os_invalid($path);
        if (($schema['uniqueItems'] ?? false) && count(array_unique(array_map(
                static fn($v) => json_encode($v, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), $value))) !== count($value)) hp_os_invalid($path);
        foreach ($value as $i => $item) hp_os_node($item, $schema['items'] ?? [], $path . '.' . $i);
    }
}
function hp_order_validate(array $raw): array
{
    $schemaPath = __DIR__ . '/schema.v1.json';
    $schema = json_decode((string) @file_get_contents($schemaPath), true, 48, JSON_THROW_ON_ERROR);
    if (!is_array($schema)) throw new RuntimeException('Invalid private order schema');
    // The root contains only the JSON Schema keywords that the interpreter supports.
    foreach (['$schema','$id'] as $meta) unset($schema[$meta]);
    hp_os_node($raw, $schema);
    if (count($raw['items']) > 120) hp_os_invalid('$.items');
    $seen = [];
    $categories = [
        'roofPanel'=>'roofSandwichPanels','wallPanel'=>'wallSandwichPanels',
        'roofSheet'=>'roofSheets','wallSheet'=>'wallSheets','flashing'=>'flashings',
        'pvc'=>'pvcMembrane','fixing'=>'fixings','opening'=>'openings'
    ];
    foreach ($raw['items'] as $item) {
        if (isset($seen[$item['lineId']])) hp_os_invalid('$.items.lineId');
        $seen[$item['lineId']] = true;
        if (($raw['sections'][$categories[$item['category']]] ?? 'unresolved') === 'excluded') hp_os_invalid('$.sections.' . $categories[$item['category']]);
    }
    foreach ($raw['finishAssignments'] as $assignment) {
        foreach ($raw['items'] as $item) {
            if ($assignment['materialClass'] !== $item['category']) continue;
            if (isset($assignment['ral'], $item['ral']) &&
                strcasecmp(trim($assignment['ral']), trim($item['ral'])) !== 0) hp_os_invalid('$.finishAssignments.ralConflict');
        }
    }
    // Never infer sign-off from finalReview.confirmed or self-selected submitter.role.
    return $raw;
}
