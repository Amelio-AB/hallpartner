<?php
declare(strict_types=1);

function hp_order_escape(mixed $value): string
{
    if ($value === null || $value === '') return 'Ej angivet / Not specified';
    if (is_bool($value)) return $value ? 'Ja / Yes' : 'Nej / No';
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function hp_order_pdf_html(array $data, string $reference, string $createdAt): string
{
    $titles = [
        'steel'=>'1. Stålstomme / Steel structure',
        'roof_panels'=>'2A. Taksandwichpaneler / Roof sandwich panels',
        'wall_panels'=>'2B. Väggsandwichpaneler / Wall sandwich panels',
        'roof_sheets'=>'3A. Takplåt / Roof sheeting',
        'wall_cladding'=>'3B. Väggplåt och fasad / Wall sheeting',
        'flashings'=>'4. Beslag och plåtdetaljer / Flashings',
        'pvc'=>'5. PVC-duk / PVC membrane',
        'finishes'=>'6. Färger och ytbehandling / Colours and finishes',
        'fixings'=>'7. Skruv och infästningar / Fixings',
        'openings'=>'8. Dörrar, portar och öppningar / Doors and openings',
        'documents'=>'9. Dokumentation och kvalitet / Documents and quality',
        'shipping'=>'10. Packning och transport / Packing and transport',
        'review'=>'11. Slutkontroll / Final check',
        'approval'=>'12. Godkännande / Approval',
    ];
    $labels = [
        'company'=>'Företag / Company','contactName'=>'Kontaktperson / Contact',
        'name'=>'Namn / Name','email'=>'E-post / Email','phone'=>'Telefon / Phone',
        'address'=>'Adress / Address','capacity'=>'Roll (uppgiven) / Self-declared capacity',
        'orderNumber'=>'Ordernummer / Order number','revision'=>'Revision',
        'countryOfManufacture'=>'Tillverkningsland / Country of manufacture',
        'siteAddress'=>'Byggplats / Building site','lengthMm'=>'Längd (mm) / Length',
        'widthMm'=>'Bredd (mm) / Width','heightMm'=>'Höjd (mm) / Height',
        'heightType'=>'Höjdtyp / Height reference','roofPitchDegrees'=>'Taklutning (grader) / Roof pitch',
        'steelGrade'=>'Stålkvalitet / Steel grade','surfaceTreatment'=>'Ytbehandling / Surface treatment',
        'notes'=>'Kommentar / Notes','requestedDate'=>'Önskad leverans / Requested delivery',
        'agreedDate'=>'Avtalad leverans / Agreed delivery','incoterms'=>'Incoterms',
        'responsibility'=>'Transportansvar / Transport responsibility','packingNotes'=>'Packning / Packing'
    ];
    $out = '<!doctype html><html lang="sv"><head><meta charset="UTF-8"><style>
    @page { margin: 18mm 14mm 19mm; }
    body { font-family: "DejaVu Sans", sans-serif; color:#272D31; font-size:9pt; line-height:1.4; }
    h1 { color:#272D31; font-size:19pt; margin:0 0 5mm; }
    h2 { font-size:11pt; margin:7mm 0 2mm; color:#334f39; padding-bottom:2mm; border-bottom:1px solid #6C826C; page-break-after:avoid; }
    p { margin:2mm 0; } .muted { color:#59635d; } .warning { background:#eee5dc; border:1px solid #bd9b82; padding:4mm; font-weight:bold; }
    table { border-collapse:collapse; width:100%; margin:2mm 0 4mm; table-layout:fixed; }
    thead { display:table-header-group; }
    th { background:#e5ebe4; color:#263d2e; font-weight:bold; text-align:left; }
    th,td { border:1px solid #cad2cb; padding:2mm; overflow-wrap:anywhere; vertical-align:top; }
    tr { page-break-inside:avoid; }
    .key { width:42%; } .small { font-size:7.5pt; }
    .signature { height:15mm; } .page-break { page-break-before:always; }
    </style></head><body>';
    $out .= '<h1>BESTÄLLNINGSUNDERLAG – STÅLHALLAR</h1><p class="muted">Steel building order specification · Svenska / English</p>';
    $out .= '<div class="warning">EJ SIGNERAT – EJ GODKÄNT FÖR TILLVERKNING<br>NOT SIGNED – NOT APPROVED FOR PRODUCTION</div>';
    $out .= '<p>Dokumentreferens / Reference: <strong>'.hp_order_escape($reference).'</strong> · Version 1 · Skapad / Created: '.hp_order_escape($createdAt).'</p>';
    $groups = ['Beställare / Ordering party'=>'orderingParty','Ifyllt av / Submitted by'=>'submitter',
        'Projekt / Project'=>'project','Leverantör / Supplier'=>'supplier','Leverans / Delivery'=>'delivery'];
    foreach ($groups as $heading => $key) {
        $out .= '<h2>'.hp_order_escape($heading).'</h2><table><tbody>';
        foreach ($data[$key] as $k => $v) {
            if ($v === null || $v === '') continue;
            $out .= '<tr><th class="key">'.hp_order_escape($labels[$k] ?? $k).'</th><td>'.nl2br(hp_order_escape($v)).'</td></tr>';
        }
        if ($key === 'project' && empty($data[$key])) $out .= '<tr><td colspan="2">Ej angivet / Not specified</td></tr>';
        $out .= '</tbody></table>';
    }
    $out .= '<h2>Mottagaradress / Recipient</h2><p>'.hp_order_escape($data['recipient']).'</p>';
    $status = ['included'=>'Ingår / Included','excluded'=>'Ingår inte / Excluded','unresolved'=>'Ej fastställt / Unresolved'];
    $colLabels = [
        'itemCode'=>'Artikel / Item', 'panelType'=>'Paneltyp / Panel type','core'=>'Kärna / Core',
        'profile'=>'Profil / Profile','profileHeightMm'=>'Profilhöjd mm / Profile height',
        'thicknessMm'=>'Tjocklek mm / Thickness','widthMm'=>'Bredd mm / Width','lengthMm'=>'Längd mm / Length',
        'cutLengthMm'=>'Kapad längd mm / Cut length','blankWidthMm'=>'Utvecklad bredd mm / Blank width',
        'finishedWidthMm'=>'Färdig bredd mm / Finished width','heightMm'=>'Höjd mm / Height',
        'ral'=>'RAL-kod / RAL','finish'=>'Yta / Finish','gloss'=>'Glansgrad / Gloss',
        'side'=>'Sida / Side','coverWidthType'=>'Täckande/total bredd / Cover/overall width',
        'weightGsm'=>'Vikt g/m² / Weight','fireClass'=>'Brandklass / Fire class',
        'uvResistance'=>'UV-beständighet / UV resistance','material'=>'Material / Material',
        'fixingSystem'=>'Infästning / Fixing','folding'=>'Bockning / Bending',
        'corrosionProtection'=>'Korrosionsskydd / Corrosion protection',
        'position'=>'Placering / Position','drawingNumber'=>'Ritning / Drawing',
        'drawingRevision'=>'Ritningsrevision / Drawing revision','notes'=>'Kommentar / Notes',
    ];
    foreach ($titles as $category => $heading) {
        $rows = array_values(array_filter($data['items'], static fn($r) => $r['category'] === $category));
        $sectionState = $data['sections'][$category] ?? 'unresolved';
        $out .= '<h2>'.hp_order_escape($heading).'</h2><p>Status: '.hp_order_escape($status[$sectionState]).'</p>';
        if (!$rows) { $out .= '<p class="muted">Inga artikelrader angivna / No item rows specified</p>'; continue; }
        $out .= '<table><thead><tr><th style="width:33%">Artikel / Item</th><th style="width:14%">Antal / Qty</th><th>Detaljer / Specifications</th></tr></thead><tbody>';
        foreach ($rows as $r) {
            $description = '';
            foreach ($colLabels as $k => $label) {
                if (!array_key_exists($k, $r) || $r[$k] === null || $r[$k] === '') continue;
                $description .= '<strong>'.hp_order_escape($label).':</strong> '.nl2br(hp_order_escape($r[$k])).'<br>';
            }
            $out .= '<tr><td>'.hp_order_escape($r['name']).'<br><span class="muted small">'.hp_order_escape($r['lineId']).'</span></td><td>'.hp_order_escape($r['quantity']).' '.hp_order_escape($r['unit']).'</td><td class="small">'.$description.'</td></tr>';
        }
        $out .= '</tbody></table>';
    }
    if ($data['documentReferences']) {
        $out .= '<h2>Ritnings- och dokumentreferenser / Document references</h2><table><thead><tr><th>Nummer / Number</th><th>Revision</th><th>Beskrivning / Description</th></tr></thead><tbody>';
        foreach ($data['documentReferences'] as $r) {
            $out .= '<tr><td>'.hp_order_escape($r['number'] ?? '').'</td><td>'.hp_order_escape($r['revision'] ?? '').'</td><td>'.hp_order_escape($r['description'] ?? '').'</td></tr>';
        }
        $out .= '</tbody></table>';
    }
    $out .= '<h2>Uppgiven kontroll / Self-declared review</h2><table><tbody>';
    foreach ($data['reviewDeclarations'] as $k => $v) {
        $out .= '<tr><th>'.hp_order_escape($k).'</th><td>'.hp_order_escape($v).'</td></tr>';
    }
    $out .= '</tbody></table><h2>Öppna frågor / Unresolved questions</h2>';
    if (!$data['unresolvedQuestions']) $out .= '<p>Inga angivna / None specified</p>';
    foreach ($data['unresolvedQuestions'] as $q) $out .= '<p>• '.hp_order_escape($q).'</p>';
    $out .= '<div class="page-break"></div><h2>12. Godkännande före tillverkning / Approval before production</h2>';
    $out .= '<p><strong>Ingen tillverkning får påbörjas innan båda parter separat har granskat och signerat.</strong> / No production may begin before both parties have separately reviewed and signed. Changes after signing require written approval from both parties.</p>';
    $out .= '<table><thead><tr><th>Kund / Customer</th><th>Leverantör / Supplier</th></tr></thead><tbody>';
    foreach (['Företag / Company','Namn / Name','Befattning / Position','Datum / Date','Underskrift / Signature'] as $label) {
        $out .= '<tr><td><strong>'.hp_order_escape($label).'</strong><div class="signature"></div></td><td><strong>'.hp_order_escape($label).'</strong><div class="signature"></div></td></tr>';
    }
    $out .= '</tbody></table><div class="warning">Tillverkningsstatus: Ej godkänd / Production status: Not approved</div>';
    return $out.'</body></html>';
}

function hp_order_generate_pdf(array $data, string $reference, string $createdAt, string $tempDirectory): string
{
    if (!class_exists(\Dompdf\Dompdf::class) || !is_dir($tempDirectory) || !is_writable($tempDirectory)) {
        throw new RuntimeException('PDF engine or private writable temporary directory unavailable');
    }
    $options = new \Dompdf\Options();
    $options->set('isRemoteEnabled', false);
    $options->set('isPhpEnabled', false);
    $options->set('isJavascriptEnabled', false);
    $options->set('isHtml5ParserEnabled', true);
    $options->set('defaultFont', 'DejaVu Sans');
    $options->set('chroot', __DIR__);
    $options->set('tempDir', $tempDirectory);
    $options->set('fontCache', $tempDirectory);
    $pdf = new \Dompdf\Dompdf($options);
    $pdf->loadHtml(hp_order_pdf_html($data, $reference, $createdAt), 'UTF-8');
    $pdf->setPaper('A4', 'portrait');
    $pdf->render();
    $bytes = $pdf->output();
    if (strlen($bytes) < 100 || strlen($bytes) > 8 * 1024 * 1024 || !str_starts_with($bytes, '%PDF-')) {
        throw new RuntimeException('PDF generation failed or exceeded maximum size');
    }
    return $bytes;
}
