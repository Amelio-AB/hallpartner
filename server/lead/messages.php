<?php
declare(strict_types=1);

/** Render only validated active answers; never include transport configuration. */
function hp_answer_summary(string $kind, array $answers): string
{
    $labels = [
        'project.use' => 'Användning', 'project.description' => 'Projektbeskrivning',
        'dimensions.confidence' => 'Måttstatus', 'dimensions.width' => 'Bredd (m)',
        'dimensions.length' => 'Längd (m)', 'dimensions.side_height' => 'Sidohöjd (m)',
        'site.city' => 'Ort', 'site.postal_code' => 'Postnummer',
        'contact.name' => 'Namn', 'contact.email' => 'E-post',
        'contact.phone' => 'Telefon', 'contact.company' => 'Företag',
        'contact.message' => 'Meddelande',
        'project.hall_interest' => 'Önskad hallkategori',
        'site.decided' => 'Byggplats bestämd',
        'site.address' => 'Adress eller fastighet',
        'foundation.status' => 'Grundstatus',
        'foundation.notes' => 'Kommentar om grunden',
        'design.insulation' => 'Isoleringsbehov',
        'openings.ports' => 'Portbehov',
        'openings.port_needs' => 'Så ska portarna användas',
        'openings.windows' => 'Fönster och ljusinsläpp',
        'design.envelope_wishes' => 'Väggar, tak och färg',
        'design.installation_wishes' => 'Övriga funktioner',
        'delivery.wishes' => 'Önskad hjälp',
        'planning.stage' => 'Projektläge',
        'planning.timeline' => 'Önskad byggstart',
        'documents.available' => 'Ritningar och bilder',
        'documents.description' => 'Tillgängligt underlag',
        'planning.permit_status' => 'Bygglovsläge',
        'planning.notes' => 'Övrigt om projektet',
        'contact.role' => 'Roll i projektet',
        'contact.preference' => 'Önskad kontaktväg',
    ];

    $fields = $kind === 'hallpartner-offert-v2-review'
        ? json_decode(file_get_contents(__DIR__ . '/quote-fields.json'), true, 20, JSON_THROW_ON_ERROR) : [];
    $summary = '';
    if ($fields !== []) $labels = array_map(static fn($field) => $field['label'], $fields);
    foreach ($labels as $key => $label) {
        if (($answers[$key] ?? '') === '') continue;
        $field = $fields[$key] ?? [];
        $summary .= $label . ($fields !== [] ? "\n" : ": ") .
            ($field['options'][$answers[$key]] ?? $answers[$key]) . "\n\n";
    }
    return $summary;
}
