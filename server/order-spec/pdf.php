<?php
declare(strict_types=1);

/** The PDF uses only validated, escaped text. Client-provided HTML is never rendered. */
function hp_os_e(mixed $v): string
{
    if ($v === null || $v === '') return 'Ej angivet / Not specified';
    if (is_bool($v)) return $v ? 'Ja / Yes' : 'Nej / No';
    return htmlspecialchars((string) $v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function hp_os_table(string $title, array $values, array $labels = []): string
{
    $html = '<h2>' . hp_os_e($title) . '</h2><table><tbody>';
    if (!$values) $html .= '<tr><td>Ej angivet / Not specified</td></tr>';
    foreach ($values as $key => $v) {
        if ($v === null || $v === '' || $v === []) continue;
        $label = $labels[$key] ?? $key;
        if (is_array($v)) $v = implode(', ', $v);
        $html .= '<tr><th class="key">'.hp_os_e($label).'</th><td>'.nl2br(hp_os_e($v)).'</td></tr>';
    }
    return $html . '</tbody></table>';
}
function hp_order_pdf_html(array $data, string $reference, string $createdAt): string
{
    $title = [
        'steelStructure'=>'1. Stålstomme / Steel structure',
        'roofSandwichPanels'=>'2A. Taksandwichpaneler / Roof sandwich panels',
        'wallSandwichPanels'=>'2B. Väggsandwichpaneler / Wall sandwich panels',
        'roofSheets'=>'3A. Takplåt / Roof sheeting',
        'wallSheets'=>'3B. Väggplåt och fasadbeklädnad / Wall sheeting and cladding',
        'flashings'=>'4. Beslag och plåtdetaljer / Flashings',
        'pvcMembrane'=>'5. PVC-duk / PVC membrane',
        'finishes'=>'6. Färger och ytbehandlingar / Colours and finishes',
        'fixings'=>'7. Skruv och infästningar / Fixings',
        'openings'=>'8. Dörrar, portar och öppningar / Doors and openings',
        'documentation'=>'9. Dokumentation och kvalitet / Documentation and quality',
        'transport'=>'10. Packning och transport / Packing and transport'
    ];
    $categoryToSection = ['roofPanel'=>'roofSandwichPanels','wallPanel'=>'wallSandwichPanels',
        'roofSheet'=>'roofSheets','wallSheet'=>'wallSheets','flashing'=>'flashings',
        'pvc'=>'pvcMembrane','fixing'=>'fixings','opening'=>'openings'];
    $fieldLabels = [
        'companyName'=>'Företag / Company','organizationNumber'=>'Organisationsnummer / Registration number',
        'name'=>'Namn / Name','email'=>'E-post / Email','contactName'=>'Kontakt / Contact',
        'contactEmail'=>'E-post / Email','phone'=>'Telefon / Phone','address'=>'Adress / Address',
        'role'=>'Uppgiven roll / Declared role','manufacturingCountry'=>'Tillverkningsland / Country of manufacture',
        'externalOrderNumber'=>'Externt ordernummer / External order number','revision'=>'Revision',
        'drawingReference'=>'Ritningsreferens / Drawing reference','location'=>'Byggplats / Building site',
        'requestedDate'=>'Önskat leveransdatum / Requested delivery',
        'agreedDate'=>'Överenskommet leveransdatum / Agreed delivery',
        'incoterms'=>'Leveransvillkor / Incoterms',
        'transportResponsibility'=>'Transportansvar / Transport responsibility',
        'packingRequirements'=>'Packningskrav / Packing requirements','notes'=>'Kommentar / Notes',
        'lengthMm'=>'Längd (mm) / Length','widthMm'=>'Bredd (mm) / Width',
        'heightMm'=>'Höjd (mm) / Height','heightReference'=>'Höjdtyp / Height reference',
        'roofPitchDegrees'=>'Taklutning (grader) / Roof pitch',
        'steelGrade'=>'Stålkvalitet / Steel grade',
        'surfaceTreatment'=>'Ytbehandling / Surface treatment','frameParts'=>'Stomdelar / Frame parts',
        'otherFramePart'=>'Övrig stomdel / Other frame part',
        'thicknessMm'=>'Tjocklek (mm) / Thickness','profileHeightMm'=>'Profilhöjd (mm) / Profile height',
        'developedWidthMm'=>'Utvecklad bredd (mm) / Developed width',
        'finishedWidthMm'=>'Färdig bredd (mm) / Finished width',
        'clearWidthMm'=>'Fri bredd (mm) / Clear width',
        'clearHeightMm'=>'Fri höjd (mm) / Clear height',
        'widthBasis'=>'Täckande/total bredd / Effective/overall width',
        'profile'=>'Profil / Profile','core'=>'Kärna / Core',
        'materialGrade'=>'Materialkvalitet / Material grade','finish'=>'Yta / Finish',
        'ral'=>'RAL-kod / RAL code','insideRal'=>'Invändig RAL / Inside RAL',
        'outsideRal'=>'Utvändig RAL / Outside RAL','gloss'=>'Glansgrad / Gloss',
        'corrosionProtection'=>'Korrosionsskydd / Corrosion protection',
        'foldingProfile'=>'Bockning / Folding profile',
        'openingPosition'=>'Placering / Position','weightGm2'=>'Vikt (g/m²) / Weight',
        'fireClass'=>'Brandklass / Fire class','uvResistance'=>'UV-beständighet / UV resistance',
        'materialQuality'=>'Material/kvalitet / Material quality','fixingSystem'=>'Infästningssystem / Fixing system'
    ];
    $html = '<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><style>
      @page { margin:17mm 15mm 19mm; }
      body { font-family:"DejaVu Sans", sans-serif; font-size:8.8pt; line-height:1.42; color:#272D31; }
      h1 { font-size:18pt; margin:0 0 3mm; letter-spacing:.4px; }
      h2 { color:#476c4f; font-size:10.5pt; margin:6mm 0 2mm; padding-bottom:1.5mm;
           border-bottom:1px solid #6C826C; page-break-after:avoid; }
      p { margin:2mm 0; } .note { color:#5b675c; font-size:8pt; }
      .warning { font-weight:bold; border:1px solid #ae8e78; background:#f4e9de; padding:4mm; margin:4mm 0; }
      table { border-collapse:collapse; width:100%; table-layout:fixed; margin:2mm 0 3mm; }
      thead { display:table-header-group; } tr { page-break-inside:avoid; }
      th,td { border:1px solid #cdd6ce; padding:2mm; text-align:left; vertical-align:top; overflow-wrap:anywhere; }
      th { background:#e9eee8; } th.key { width:42%; }
      .small { font-size:7.5pt; } .minor { color:#627068; }
      .sign { height:13mm; } .break { page-break-before:always; }
      </style></head><body>';
    $html .= '<h1>BESTÄLLNINGSUNDERLAG – STÅLHALLAR</h1>';
    $html .= '<p class="note">Steel building order specification · Svenska / English</p>';
    $html .= '<div class="warning">EJ SIGNERAT – EJ GODKÄNT FÖR TILLVERKNING<br>NOT SIGNED – NOT APPROVED FOR PRODUCTION</div>';
    $html .= '<p>Dokumentreferens / Document reference: <strong>'.hp_os_e($reference).'</strong> · Dokumentversion / Version: 1 · Skapad / Created: '.hp_os_e($createdAt).'</p>';
    $html .= hp_os_table('Ifyllt av / Submitted by', $data['submitter'], $fieldLabels);
    $html .= hp_os_table('Kund / Ordering party', $data['orderingParty'], $fieldLabels);
    $html .= hp_os_table('Leverantör / Supplier', $data['supplier'], $fieldLabels);
    $project = $data['project'];
    $building = $project['building'];
    unset($project['building']);
    $html .= hp_os_table('Projekt / Project', $project, $fieldLabels);
    $html .= hp_os_table('Hallmått och stålstomme / Building dimensions and steel structure', $building, $fieldLabels);
    $html .= hp_os_table('Leverans / Delivery', $data['delivery'], $fieldLabels);
    $html .= '<p><strong>Mottagare / Recipient:</strong> '.hp_os_e($data['recipient']['email']).'</p>';

    $states = ['included'=>'Ingår / Included','excluded'=>'Ingår inte / Excluded','unresolved'=>'Behöver fastställas / Unresolved'];
    foreach ($title as $id => $heading) {
        $state = $data['sections'][$id];
        $html .= '<h2>'.hp_os_e($heading).'</h2>';
        $html .= '<p class="note">Status: '.hp_os_e($states[$state]).'</p>';
        $rows = [];
        foreach ($data['items'] as $item) {
            if (($categoryToSection[$item['category']] ?? null) === $id) $rows[] = $item;
        }
        if ($rows) {
            $html .= '<table><thead><tr><th style="width:31%">Artikel / Item</th><th style="width:15%">Antal / Qty</th><th>Specifikation / Specification</th></tr></thead><tbody>';
            foreach ($rows as $row) {
                $details = '';
                foreach ($row as $key => $v) {
                    if (in_array($key, ['lineId','category','itemType','quantity','unit','notes','description','dimensions'], true)) continue;
                    if ($v === null || $v === '') continue;
                    $details .= '<strong>'.hp_os_e($fieldLabels[$key] ?? $key).':</strong> '.hp_os_e($v).'<br>';
                }
                foreach ($row['dimensions'] ?? [] as $key => $v) {
                    $details .= '<strong>'.hp_os_e($fieldLabels[$key] ?? $key).':</strong> '.hp_os_e($v).'<br>';
                }
                $html .= '<tr><td>'.hp_os_e($row['itemType']).'<br><span class="minor small">'.hp_os_e($row['lineId']).'</span></td>';
                $html .= '<td>'.hp_os_e($row['quantity']).' '.hp_os_e($row['unit']).'</td><td class="small">'.$details.'</td></tr>';
            }
            $html .= '</tbody></table>';
            foreach ($rows as $row) {
                foreach (['description','notes'] as $key) {
                    if (empty($row[$key])) continue;
                    $html .= '<p class="small"><strong>'.hp_os_e($row['lineId']).' – '.hp_os_e($key).':</strong> '.nl2br(hp_os_e($row[$key])).'</p>';
                }
            }
        } elseif ($id !== 'steelStructure') $html .= '<p class="note">Inga artikelrader / No item rows</p>';
        if ($id === 'finishes' && $data['finishAssignments']) {
            $html .= '<table><thead><tr><th>Material / Material</th><th>RAL</th><th>Yta / Finish</th><th>Kommentar / Notes</th></tr></thead><tbody>';
            foreach ($data['finishAssignments'] as $r) {
                $html .= '<tr><td>'.hp_os_e($r['materialClass']).'</td><td>'.hp_os_e($r['ral'] ?? '').'</td><td>'.hp_os_e($r['finish'] ?? '').'</td><td>'.hp_os_e($r['notes'] ?? '').'</td></tr>';
            }
            $html .= '</tbody></table>';
        }
        if ($id === 'pvcMembrane' && !empty($data['pvcSpecification'])) $html .= hp_os_table('PVC-data / PVC details', $data['pvcSpecification'], $fieldLabels);
        if ($id === 'documentation') {
            $html .= '<p>Efterfrågade dokument / Requested documents: '.hp_os_e(implode(', ', $data['documentation']['requested'])).'</p>';
            if (!empty($data['documentation']['otherDetails'])) $html .= '<p>'.nl2br(hp_os_e($data['documentation']['otherDetails'])).'</p>';
        }
    }
    $html .= '<h2>11. Slutkontroll / Final review</h2><p class="note">Dessa uppgifter är angivna av inskickaren, inte verifierade av Hallpartner.</p>';
    $html .= '<p>Uppgivna kontroller / Self-declared checks: '.hp_os_e(implode(', ', $data['finalReview']['confirmed'])).'</p>';
    $html .= '<p>Detaljer granskade av inskickaren / Details reviewed by submitter: '.hp_os_e($data['finalReview']['detailsReviewed']).'</p>';
    if (!empty($data['finalReview']['comments'])) $html .= '<p>'.nl2br(hp_os_e($data['finalReview']['comments'])).'</p>';
    $html .= '<h2>Öppna frågor / Unresolved questions</h2>';
    if (!$data['unresolvedQuestions']) $html .= '<p>Inga angivna / None specified</p>';
    foreach ($data['unresolvedQuestions'] as $q) $html .= '<p>• '.hp_os_e($q).'</p>';
    $html .= '<div class="break"></div><h2>12. Godkännande före tillverkning / Approval before production</h2>';
    $html .= '<p><strong>Ingen tillverkning får påbörjas innan kund och leverantör granskat och signerat detta dokument separat.</strong> / Production may not begin until both parties have reviewed and signed separately. Changes require written approval by both parties.</p>';
    $html .= '<table><thead><tr><th>KUND / CUSTOMER</th><th>LEVERANTÖR / SUPPLIER</th></tr></thead><tbody>';
    foreach (['Företag / Company','Namn / Name','Befattning / Position','Datum / Date','Underskrift / Signature'] as $label) {
        $html .= '<tr><td><strong>'.hp_os_e($label).'</strong><div class="sign"></div></td><td><strong>'.hp_os_e($label).'</strong><div class="sign"></div></td></tr>';
    }
    $html .= '</tbody></table><div class="warning">Tillverkningsstatus / Production status: EJ GODKÄND / NOT APPROVED</div>';
    return $html . '</body></html>';
}

function hp_order_generate_pdf(array $validated, string $reference, string $createdAt, string $privateTmp): string
{
    if (!class_exists(\Dompdf\Dompdf::class) || !is_dir($privateTmp) || !is_writable($privateTmp)) {
        throw new RuntimeException('Private PDF renderer unavailable');
    }
    $options = new \Dompdf\Options();
    $options->set('isRemoteEnabled', false);
    $options->set('isPhpEnabled', false);
    $options->set('isJavascriptEnabled', false);
    $options->set('isHtml5ParserEnabled', true);
    $options->set('defaultFont', 'DejaVu Sans');
    $options->set('chroot', __DIR__);
    $options->set('tempDir', $privateTmp);
    $options->set('fontCache', $privateTmp);
    $pdf = new \Dompdf\Dompdf($options);
    $pdf->loadHtml(hp_order_pdf_html($validated, $reference, $createdAt), 'UTF-8');
    $pdf->setPaper('A4', 'portrait');
    $pdf->render();
    $bytes = $pdf->output();
    if (!str_starts_with($bytes, '%PDF-') || strlen($bytes) < 100 || strlen($bytes) > 8*1024*1024) {
        throw new RuntimeException('Invalid or oversized PDF');
    }
    return $bytes;
}
