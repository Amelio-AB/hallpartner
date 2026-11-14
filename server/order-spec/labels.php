<?php
declare(strict_types=1);

/** Translate known schema enum tokens for a supplier-facing SV/EN PDF only. */
function hp_os_label(string $field, string $value): string
{
    static $labels = [
        'frameParts' => [
            'mainFrames'=>'Huvudramar / Main frames','columns'=>'Pelare / Columns',
            'roofBeams'=>'Takbalkar / Roof beams','roofPurlins'=>'Takåsar / Roof purlins',
            'wallGirts'=>'Väggreglar / Wall girts','bracing'=>'Vindkryss / Bracing',
            'basePlates'=>'Fotplattor / Base plates','connectionPlates'=>'Anslutningsplåtar / Connection plates',
            'reinforcements'=>'Förstärkningar / Reinforcements','other'=>'Övrigt / Other'
        ],
        'packingRequirements'=>[
            'allComponentsLabelled'=>'Alla komponenter märkta / All components labelled',
            'weatherProtected'=>'Väderskyddat / Weather protected',
            'numberedPackages'=>'Numrerade kollin / Numbered packages',
            'fixingsPackedSeparately'=>'Infästningar separat / Fixings packed separately',
            'packingListIncluded'=>'Packlista / Packing list included',
            'loadingPhotos'=>'Lastningsbilder / Loading photos'
        ],
        'documentation'=>[
            'productionDrawings'=>'Tillverkningsritningar / Production drawings',
            'assemblyDrawings'=>'Monteringsritningar / Assembly drawings',
            'structuralCalculations'=>'Statiska beräkningar / Structural calculations',
            'ceDocumentationIfApplicable'=>'CE-dokumentation där tillämpligt / CE documentation if applicable',
            'declarationsOfPerformance'=>'Prestandadeklarationer / Declarations of Performance',
            'materialCertificates'=>'Materialcertifikat / Material certificates',
            'productSpecifications'=>'Produktspecifikationer / Product specifications',
            'qualityInspection'=>'Kvalitetskontroll / Quality inspection',
            'packingList'=>'Packlista / Packing list',
            'assemblyInstructions'=>'Monteringsanvisningar / Assembly instructions',
            'certificateOfOriginIfRequired'=>'Ursprungsintyg vid behov / Certificate of origin if required',
            'other'=>'Övrigt / Other'
        ],
        'finalReview'=>[
            'allDimensionsChecked'=>'Alla mått kontrollerade / Dimensions checked',
            'drawingsApproved'=>'Ritningar uppgivet godkända / Drawings declared approved',
            'steelStructureSpecified'=>'Stålstomme specificerad / Steel structure specified',
            'roofWallMaterialsSpecified'=>'Tak- och väggmaterial specificerade / Roof and wall materials specified',
            'sandwichPanelsSpecified'=>'Sandwichpaneler specificerade / Sandwich panels specified',
            'pvcMembraneSpecified'=>'PVC-duk specificerad / PVC membrane specified',
            'ralAndFinishesVerified'=>'RAL och ytbehandling kontrollerade / Colours and finishes checked',
            'sheetFlashingDimensionsVerified'=>'Plåt- och beslagsmått kontrollerade / Sheeting and flashing sizes checked',
            'fixingsIncluded'=>'Infästningar medtagna / Fixings included',
            'quantitiesChecked'=>'Materialmängder kontrollerade / Quantities checked',
            'documentationAgreed'=>'Dokumentation uppgivet överenskommen / Documentation declared agreed',
            'deliveryTermsDateApproved'=>'Leveransvillkor och datum uppgivet godkända / Delivery terms and date declared approved'
        ],
        'heightReference'=>[
            'clearInside'=>'Fri invändig höjd / Clear inside height',
            'eaves'=>'Takfotshöjd / Eaves height',
            'ridge'=>'Nockhöjd / Ridge height',
            'other'=>'Annan höjdtyp / Other height',
            'unresolved'=>'Ej fastställd / Unresolved'
        ],
        'widthBasis'=>[
            'effectiveCover'=>'Täckande bredd / Effective cover',
            'overall'=>'Total bredd / Overall width',
            'notApplicable'=>'Ej tillämpligt / Not applicable'
        ],
        'materialClass'=>[
            'roofPanel'=>'Takpanel / Roof panel','wallPanel'=>'Väggpanel / Wall panel',
            'roofSheet'=>'Takplåt / Roof sheeting','wallSheet'=>'Väggplåt / Wall sheeting',
            'flashing'=>'Beslag / Flashing','steelStructure'=>'Stålstomme / Steel structure',
            'pvc'=>'PVC-duk / PVC membrane','door'=>'Dörr / Door'
        ],
        'unit'=>['pcs'=>'st / pcs','m'=>'m','m2'=>'m²','kg'=>'kg','set'=>'set','roll'=>'rulle / roll']
    ];
    return $labels[$field][$value] ?? $value;
}
function hp_os_join_labels(string $field, array $values): string
{
    return implode(', ', array_map(
        static fn(string $v): string => hp_os_label($field, $v),
        $values
    ));
}
