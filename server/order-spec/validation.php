<?php
declare(strict_types=1);

/**
 * Hallpartner order specification v1. Nothing in a public payload is a
 * manufacturing approval, authority/role claim, price or contractual acceptance.
 */
function hp_order_invalid(string $field): never
{
    throw new InvalidArgumentException('Invalid order field: ' . $field);
}

function hp_order_text(mixed $value, string $field, int $limit = 160): string
{
    if (!is_string($value) || mb_strlen($value, 'UTF-8') > $limit || str_contains($value, "\0")) {
        hp_order_invalid($field);
    }
    return trim($value);
}

function hp_order_email(mixed $value, string $field): string
{
    $value = hp_order_text($value, $field, 254);
    if (preg_match('/[\r\n]/', $value) || !filter_var($value, FILTER_VALIDATE_EMAIL)) {
        hp_order_invalid($field);
    }
    return strtolower($value);
}

function hp_order_dimension(mixed $value, string $field): ?float
{
    if ($value === '' || $value === null) return null;
    if (!is_string($value) && !is_int($value) && !is_float($value)) hp_order_invalid($field);
    $s = str_replace(',', '.', (string) $value);
    if (!preg_match('/^\d{1,6}(?:\.\d{1,3})?$/D', $s)) hp_order_invalid($field);
    $n = (float) $s;
    if ($n <= 0 || $n > 999999 || !is_finite($n)) hp_order_invalid($field);
    return $n;
}

function hp_order_object(mixed $value, array $fields, string $key): array
{
    if (!is_array($value) || array_is_list($value)) hp_order_invalid($key);
    foreach (array_keys($value) as $field) {
        if (!array_key_exists($field, $fields)) hp_order_invalid("$key.$field");
    }
    $result = [];
    foreach ($fields as $field => $type) {
        if (!array_key_exists($field, $value)) continue;
        $v = $value[$field];
        if ($type === 'email') $result[$field] = hp_order_email($v, "$key.$field");
        elseif ($type === 'date') {
            $s = hp_order_text($v, "$key.$field", 10);
            if ($s !== '' && (!preg_match('/^\d{4}-\d{2}-\d{2}$/D', $s) || !checkdate((int) substr($s, 5, 2), (int) substr($s, 8, 2), (int) substr($s, 0, 4)))) hp_order_invalid("$key.$field");
            $result[$field] = $s;
        } elseif ($type === 'dimension') $result[$field] = hp_order_dimension($v, "$key.$field");
        else $result[$field] = hp_order_text($v, "$key.$field", $type === 'notes' ? 1200 : 180);
    }
    return $result;
}

function hp_order_validate(array $raw): array
{
    $allowed = ['schemaVersion', 'formType', 'submitter', 'orderingParty', 'supplier',
        'project', 'delivery', 'recipient', 'sections', 'items', 'documentReferences',
        'reviewDeclarations', 'unresolvedQuestions'];
    foreach (array_keys($raw) as $k) {
        if (!in_array($k, $allowed, true)) hp_order_invalid((string) $k);
    }
    if (($raw['schemaVersion'] ?? null) !== 1 || ($raw['formType'] ?? null) !== 'hallpartner-order-spec-v1') {
        hp_order_invalid('schemaVersion/formType');
    }
    $submitter = hp_order_object($raw['submitter'] ?? null,
        ['name'=>'text', 'email'=>'email', 'phone'=>'text', 'capacity'=>'text'], 'submitter');
    $buyer = hp_order_object($raw['orderingParty'] ?? null,
        ['company'=>'text', 'contactName'=>'text', 'email'=>'email', 'phone'=>'text', 'address'=>'notes'], 'orderingParty');
    $supplier = hp_order_object($raw['supplier'] ?? [],
        ['company'=>'text', 'contactName'=>'text', 'email'=>'email', 'address'=>'notes'], 'supplier');
    $project = hp_order_object($raw['project'] ?? null,
        ['name'=>'text', 'orderNumber'=>'text', 'revision'=>'text', 'countryOfManufacture'=>'text',
         'siteAddress'=>'notes', 'lengthMm'=>'dimension', 'widthMm'=>'dimension', 'heightMm'=>'dimension',
         'heightType'=>'text', 'roofPitchDegrees'=>'dimension', 'steelGrade'=>'text',
         'surfaceTreatment'=>'text', 'notes'=>'notes'], 'project');
    $delivery = hp_order_object($raw['delivery'] ?? [],
        ['requestedDate'=>'date', 'agreedDate'=>'date', 'address'=>'notes',
         'incoterms'=>'text', 'responsibility'=>'text', 'packingNotes'=>'notes'], 'delivery');
    foreach ([['submitter.name', $submitter['name'] ?? ''], ['submitter.email', $submitter['email'] ?? ''],
        ['orderingParty.company', $buyer['company'] ?? ''], ['project.name', $project['name'] ?? '']] as [$f, $v]) {
        if ($v === '') hp_order_invalid($f);
    }
    $recipient = hp_order_email($raw['recipient'] ?? null, 'recipient');
    $statusNames = ['steel','roof_panels','wall_panels','roof_sheets','wall_cladding','flashings',
        'pvc','finishes','fixings','openings','documents','shipping','review','approval'];
    $sections = $raw['sections'] ?? [];
    if (!is_array($sections) || array_is_list($sections)) hp_order_invalid('sections');
    $cleanSections = [];
    foreach ($sections as $k => $v) {
        if (!in_array($k, $statusNames, true) || !in_array($v, ['included','excluded','unresolved'], true)) hp_order_invalid("sections.$k");
        $cleanSections[$k] = $v;
    }
    $items = $raw['items'] ?? [];
    if (!is_array($items) || count($items) > 120 || !array_is_list($items)) hp_order_invalid('items');
    $itemFields = ['lineId'=>'text', 'category'=>'text', 'itemCode'=>'text',
        'name'=>'text','panelType'=>'text','core'=>'text','profile'=>'text','profileHeightMm'=>'dimension',
        'thicknessMm'=>'dimension','widthMm'=>'dimension','lengthMm'=>'dimension','cutLengthMm'=>'dimension',
        'blankWidthMm'=>'dimension','finishedWidthMm'=>'dimension','heightMm'=>'dimension',
        'quantity'=>'dimension','unit'=>'text','ral'=>'text','finish'=>'text','gloss'=>'text',
        'side'=>'text','coverWidthType'=>'text','weightGsm'=>'dimension','fireClass'=>'text',
        'uvResistance'=>'text','material'=>'text','fixingSystem'=>'text','folding'=>'text',
        'corrosionProtection'=>'text','position'=>'text','drawingNumber'=>'text',
        'drawingRevision'=>'text','notes'=>'notes'];
    $cleanItems = [];
    $ids = [];
    foreach ($items as $i => $item) {
        $row = hp_order_object($item, $itemFields, "items.$i");
        $id = $row['lineId'] ?? '';
        if (!preg_match('/^[a-zA-Z0-9_-]{1,64}$/D', $id) || isset($ids[$id])) hp_order_invalid("items.$i.lineId");
        $ids[$id] = true;
        if (!in_array($row['category'] ?? '', $statusNames, true)) hp_order_invalid("items.$i.category");
        if (($row['name'] ?? '') === '' || ($row['quantity'] ?? null) === null) hp_order_invalid("items.$i.name/quantity");
        if (!in_array($row['unit'] ?? '', ['st','m','m²','m2','kg','set','förp','par','rulle'], true)) hp_order_invalid("items.$i.unit");
        $cleanItems[] = $row;
    }
    $refs = $raw['documentReferences'] ?? [];
    if (!is_array($refs) || !array_is_list($refs) || count($refs) > 40) hp_order_invalid('documentReferences');
    $cleanRefs = [];
    foreach ($refs as $i => $r) {
        $cleanRefs[] = hp_order_object($r, ['number'=>'text','revision'=>'text','description'=>'text'], "documentReferences.$i");
    }
    $declarations = $raw['reviewDeclarations'] ?? [];
    if (!is_array($declarations) || array_is_list($declarations) || count($declarations) > 20) hp_order_invalid('reviewDeclarations');
    $cleanDeclarations = [];
    $reviewKeys = ['dimensionsChecked', 'drawingsReviewed', 'materialQuantitiesChecked',
        'coloursReviewed', 'deliveryTermsReviewed', 'documentationReviewed'];
    foreach ($declarations as $k => $v) {
        if (!in_array($k, $reviewKeys, true) || !is_bool($v)) hp_order_invalid("reviewDeclarations.$k");
        $cleanDeclarations[$k] = $v;
    }
    $unresolved = $raw['unresolvedQuestions'] ?? [];
    if (!is_array($unresolved) || !array_is_list($unresolved) || count($unresolved) > 30) hp_order_invalid('unresolvedQuestions');
    $cleanUnresolved = [];
    foreach ($unresolved as $i => $q) $cleanUnresolved[] = hp_order_text($q, "unresolvedQuestions.$i", 500);
    return [
        'schemaVersion'=>1, 'formType'=>'hallpartner-order-spec-v1',
        'submitter'=>$submitter,'orderingParty'=>$buyer,'supplier'=>$supplier,
        'project'=>$project,'delivery'=>$delivery,'recipient'=>$recipient,
        'sections'=>$cleanSections,'items'=>$cleanItems,'documentReferences'=>$cleanRefs,
        'reviewDeclarations'=>$cleanDeclarations,'unresolvedQuestions'=>$cleanUnresolved,
    ];
}
