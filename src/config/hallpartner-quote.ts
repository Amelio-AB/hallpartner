import type { QuoteConfig } from '@amelio/web-platform/quote-flow';

/**
 * Arbetskandidat V2: fem frågesteg + AMP-001:s automatiska kontrollsteg.
 * Produktval, leveransomfattning och tekniska specifikationer är inte kundgodkända.
 * Denna konfiguration får INTE skickas till PHP-mottagarens V1-allowlist.
 */
const positiveMetres = (value: string): string | undefined =>
  !/^\d{1,3}([,.]\d{1,2})?$/.test(value.trim()) || Number(value.replace(',', '.')) <= 0
    ? 'Ange ett positivt tal i meter.'
    : undefined;

export const hallpartnerQuoteConfig = {
  id: 'hallpartner-offert-v2-review',
  title: 'Din hallförfrågan',
  intro: 'Ungefärliga uppgifter räcker. Du kan lämna tekniska val till Hallpartner.',
  steps: [
    {
      id: 'project', title: 'Behov',
      description: 'Börja med vad hallen ska användas till. Konstruktionen behöver inte vara bestämd.',
      groups: [
        { id: 'project.extra', title: 'Har du en viss halltyp i åtanke?', description: 'Frivilligt. Du kan ange den halltyp du tittat på, eller låta Hallpartner ge förslag.', initiallyCollapsed: true }
      ],
      fields: [
        {
          id: 'project.use', kind: 'select', presentation: 'cards', required: true,
          label: 'Vad ska du främst använda hallen till?',
          help: { title: 'Utgå från användningen', text: 'Lager och ridverksamhet är användningsområden, medan exempelvis tälthall beskriver en konstruktion. Du behöver inte välja konstruktion här.' },
          options: [
            { value: 'storage', label: 'Lager eller förvaring', description: 'Varor, material och utrustning' },
            { value: 'machinery', label: 'Maskiner eller verkstad', description: 'Utrymme för maskiner och arbete' },
            { value: 'riding', label: 'Ridverksamhet', description: 'Ridbana eller annan hästverksamhet' },
            { value: 'other', label: 'Annat behov', description: 'Berätta vad hallen ska användas till' },
            { value: 'unknown', label: 'Behöver rådgivning', description: 'Vi hjälper dig att beskriva behovet' }
          ]
        },
        {
          id: 'project.description', kind: 'textarea',
          label: 'Beskriv gärna ditt behov (frivilligt)',
          hint: 'Frivilligt. Till exempel vad som ska få plats eller vad du vill kunna göra i hallen.'
        },
        {
          id: 'project.hall_interest', group: 'project.extra', kind: 'select',
          label: 'Vilken av våra hallkategorier tänker du på?',
          hint: 'Det här är ett önskemål, inte ett tekniskt val. Till exempel kan en lagerhall också vara isolerad.',
          options: [
            { value: 'lagerhall', label: 'Lagerhall' },
            { value: 'maskinhall', label: 'Maskinhall' },
            { value: 'plathall', label: 'Plåthall' },
            { value: 'talthall', label: 'Tälthall' },
            { value: 'ridhus', label: 'Ridhus' },
            { value: 'isolerad-hall', label: 'Isolerad hall' },
            { value: 'unknown', label: 'Jag vill ha hjälp att välja' }
          ]
        }
      ]
    },
    {
      id: 'dimensions', title: 'Mått och plats',
      description: 'Vi tar gärna emot ungefärliga mått och en tänkt byggort.',
      groups: [
        { id: 'dimensions.extra', title: 'Fler mått', description: 'Frivillig sidohöjd om du känner till den.', initiallyCollapsed: true },
        { id: 'site.extra', title: 'Fler uppgifter om byggplatsen', description: 'Frivilliga uppgifter om adress, mark och grund.', initiallyCollapsed: true }
      ],
      fields: [
        {
          id: 'dimensions.confidence', kind: 'select',
          label: 'Vet du ungefär hur stor hallen ska vara?',
          help: { title: 'Ungefärliga mått fungerar', text: 'Bredd och längd är bara ett första underlag. Välj hjälp om du vill resonera om måtten med Hallpartner.' },
          options: [
            { value: 'exact', label: 'Ja, jag vet måtten' },
            { value: 'approximate', label: 'Jag har ungefärliga mått' },
            { value: 'need_help', label: 'Jag behöver hjälp med storleken' }
          ]
        },
        {
          id: 'dimensions.width', kind: 'text', label: 'Bredd i meter', hint: 'Frivilligt, till exempel 18 eller 18,5.',
          when: a => a['dimensions.confidence'] !== 'need_help', validate: positiveMetres
        },
        {
          id: 'dimensions.length', kind: 'text', label: 'Längd i meter', hint: 'Frivilligt.',
          when: a => a['dimensions.confidence'] !== 'need_help', validate: positiveMetres
        },
        {
          id: 'dimensions.side_height', group: 'dimensions.extra', kind: 'text', label: 'Sidohöjd i meter',
          hint: 'Frivilligt.',
          help: { title: 'Vad är sidohöjd?', text: 'Ungefärlig höjd längs hallens långsida upp till takfoten. Lämna tomt om du är osäker.' },
          when: a => a['dimensions.confidence'] !== 'need_help',
          validate: v => !/^\d{1,2}([,.]\d{1,2})?$/.test(v.trim()) || Number(v.replace(',', '.')) <= 0 ? 'Ange ett positivt tal i meter.' : undefined
        },
        { id: 'site.city', kind: 'text', label: 'I vilken ort eller vilket område vill du bygga?', hint: 'Det räcker med ungefärlig plats. Frivilligt.' },
        {
          id: 'site.postal_code', group: 'site.extra', kind: 'text', label: 'Postnummer',
          autocomplete: 'postal-code', hint: 'Frivilligt.',
          validate: v => !/^\d{3}\s?\d{2}$/.test(v.trim()) ? 'Ange fem siffror.' : undefined
        },
        {
          id: 'site.decided', group: 'site.extra', kind: 'select',
          label: 'Är den exakta byggplatsen bestämd?',
          options: [
            { value: 'yes', label: 'Ja' }, { value: 'no', label: 'Nej' }, { value: 'unknown', label: 'Vet inte ännu' }
          ]
        },
        {
          id: 'site.address', group: 'site.extra', kind: 'text', label: 'Adress eller fastighetsbeteckning',
          hint: 'Frivilligt även om byggplatsen är bestämd.', autocomplete: 'street-address',
          when: a => a['site.decided'] === 'yes'
        },
        {
          id: 'foundation.status', group: 'site.extra', kind: 'select',
          label: 'Hur ser det ut med grunden?',
          options: [
            { value: 'existing', label: 'Det finns en grund' },
            { value: 'planned', label: 'En grund planeras' },
            { value: 'none', label: 'Ingen grund planerad' },
            { value: 'unknown', label: 'Vet inte' }
          ]
        },
        {
          id: 'foundation.notes', group: 'site.extra', kind: 'textarea', label: 'Vad vet du om grunden?',
          hint: 'Till exempel befintlig platta eller vem som planerar grunden. Frivilligt.',
          when: a => ['existing', 'planned'].includes(a['foundation.status'] ?? '')
        }
      ]
    },
    {
      id: 'design', title: 'Utformning',
      description: 'Berätta om behoven. Detaljerade materialval kan Hallpartner diskutera med dig senare.',
      groups: [
        { id: 'design.extra', title: 'Fler önskemål', description: 'Frivilliga uppgifter om öppningar, material, tillval och leverans.', initiallyCollapsed: true }
      ],
      fields: [
        {
          id: 'design.insulation', kind: 'select', label: 'Behöver hallen vara isolerad?',
          help: { title: 'Du måste inte välja isolering nu', text: 'Beskriv hur hallen ska användas och om temperatur eller kondens är viktigt. Hallpartner kan föreslå ett lämpligt utförande efter dialog.' },
          options: [
            { value: 'yes', label: 'Ja, troligen' },
            { value: 'no', label: 'Nej, troligen inte' },
            { value: 'recommend', label: 'Hallpartner rekommenderar' },
            { value: 'unknown', label: 'Vet inte' }
          ]
        },
        {
          id: 'openings.ports', kind: 'select', label: 'Behöver hallen en eller flera portar?',
          options: [
            { value: 'yes', label: 'Ja' }, { value: 'no', label: 'Nej' }, { value: 'unknown', label: 'Osäker' }
          ]
        },
        {
          id: 'openings.port_needs', kind: 'textarea', label: 'Beskriv gärna hur portarna ska användas',
          hint: 'Till exempel ungefärligt antal, maskiner som ska passera och eventuella mått. Frivilligt.',
          when: a => a['openings.ports'] === 'yes'
        },
        {
          id: 'openings.windows', group: 'design.extra', kind: 'select',
          label: 'Behövs fönster eller ljusinsläpp?',
          options: [
            { value: 'yes', label: 'Ja' }, { value: 'no', label: 'Nej' }, { value: 'unknown', label: 'Behöver diskuteras' }
          ]
        },
        {
          id: 'design.envelope_wishes', group: 'design.extra', kind: 'textarea',
          label: 'Önskemål om väggar, tak eller färg',
          hint: 'Till exempel önskad färg eller ett material du har funderat på. Du behöver inte välja en teknisk lösning.'
        },
        {
          id: 'design.installation_wishes', group: 'design.extra', kind: 'textarea',
          label: 'Övriga funktioner eller tillval att diskutera',
          hint: 'Till exempel behov av belysning, värme eller ventilation. Detta är önskemål att diskutera, inte beställda tillval.'
        },
        {
          id: 'delivery.wishes', group: 'design.extra', kind: 'textarea',
          label: 'Vad vill du ha hjälp med utöver själva hallen?',
          hint: 'Till exempel montage eller grundarbete. Hallpartner kan återkomma om vilka delar som går att erbjuda.'
        }
      ]
    },
    {
      id: 'planning', title: 'Projektläge',
      description: 'Hur långt har du kommit, och finns det något underlag?',
      groups: [
        { id: 'planning.extra', title: 'Fler projektuppgifter', description: 'Frivilliga uppgifter om bygglov och andra förutsättningar.', initiallyCollapsed: true }
      ],
      fields: [
        {
          id: 'planning.stage', kind: 'select', label: 'Hur långt har projektet kommit?',
          options: [
            { value: 'ideas', label: 'Jag undersöker möjligheterna' },
            { value: 'planning', label: 'Mått eller planering finns' },
            { value: 'permit', label: 'Bygglov eller projektering pågår' },
            { value: 'ready', label: 'Redo att ta nästa steg' },
            { value: 'unknown', label: 'Vet inte' }
          ]
        },
        {
          id: 'planning.timeline', kind: 'select', label: 'När skulle du vilja att bygget startar?',
          options: [
            { value: 'soon', label: 'Så snart som möjligt' },
            { value: 'within_3', label: 'Inom 3 månader' },
            { value: 'three_six', label: 'Om 3–6 månader' },
            { value: 'six_twelve', label: 'Om 6–12 månader' },
            { value: 'later', label: 'Senare' },
            { value: 'unknown', label: 'Vet inte' }
          ]
        },
        {
          id: 'documents.available', kind: 'select', label: 'Har du ritningar, skisser eller bilder?',
          help: { title: 'Underlag är frivilligt', text: 'Har du skisser eller ritningar är de bra att nämna. Du kan komplettera i kontakt med Hallpartner senare. Denna arbetsversion skickar inga filer.' },
          options: [
            { value: 'yes', label: 'Ja' }, { value: 'some', label: 'Något underlag' },
            { value: 'later', label: 'Inte ännu' }, { value: 'no', label: 'Nej' }
          ]
        },
        {
          id: 'documents.description', kind: 'textarea', label: 'Vilket underlag finns?',
          hint: 'Beskriv kort, till exempel planritning, skiss eller bilder från byggplatsen. Frivilligt.',
          when: a => ['yes', 'some'].includes(a['documents.available'] ?? '')
        },
        {
          id: 'planning.permit_status', group: 'planning.extra', kind: 'select', label: 'Hur ser det ut med bygglovet?',
          help: { title: 'Bygglov måste bedömas separat', text: 'Ditt svar beskriver projektets status. Guiden avgör inte om bygglov behövs. Kontrollera med kommunen eller en sakkunnig.' },
          options: [
            { value: 'not_checked', label: 'Inte undersökt' },
            { value: 'considering', label: 'Undersöks' },
            { value: 'submitted', label: 'Ansökan pågår' },
            { value: 'approved', label: 'Beviljat' },
            { value: 'unknown', label: 'Vet inte' }
          ]
        },
        {
          id: 'planning.notes', group: 'planning.extra', kind: 'textarea',
          label: 'Övrigt om projektet', hint: 'Något viktigt Hallpartner behöver känna till? Frivilligt.'
        }
      ]
    },
    {
      id: 'customer', title: 'Kontakt',
      description: 'Så att Hallpartner kan återkomma om din förfrågan.',
      groups: [
        { id: 'customer.extra', title: 'Fler kontaktuppgifter', description: 'Frivilligt om företaget eller hur du helst blir kontaktad.', initiallyCollapsed: true }
      ],
      fields: [
        { id: 'contact.name', kind: 'text', label: 'Namn', autocomplete: 'name', required: true },
        { id: 'contact.email', kind: 'email', label: 'E-post', autocomplete: 'email', required: true },
        {
          id: 'contact.phone', kind: 'text', label: 'Telefon', autocomplete: 'tel',
          hint: 'Frivilligt.',
          validate: v => !/^[+\d() -]{6,22}$/.test(v.trim()) ? 'Kontrollera telefonnumret.' : undefined
        },
        { id: 'contact.company', group: 'customer.extra', kind: 'text', label: 'Företag', autocomplete: 'organization' },
        {
          id: 'contact.role', group: 'customer.extra', kind: 'select', label: 'Vilken roll har du i projektet?',
          options: [
            { value: 'customer', label: 'Beställare eller slutkund' },
            { value: 'contractor', label: 'Entreprenör' },
            { value: 'advisor', label: 'Konsult eller projektör' },
            { value: 'other', label: 'Annan roll' }
          ]
        },
        {
          id: 'contact.preference', group: 'customer.extra', kind: 'select', label: 'Hur vill du helst bli kontaktad?',
          options: [
            { value: 'email', label: 'E-post' },
            { value: 'phone', label: 'Telefon' },
            { value: 'either', label: 'Spelar ingen roll' }
          ],
          validate: (value, answers) => value === 'phone' && !answers['contact.phone']?.trim()
            ? 'Ange ett telefonnummer ovan om du vill bli uppringd, eller välj e-post.'
            : undefined
        }
      ]
    }
  ]
} satisfies QuoteConfig;
