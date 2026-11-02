import type { QuoteConfig } from '@amelio/web-platform/quote-flow';

/** First, compact Hallpartner enquiry; the ten-step business flow remains in docs/OFFERTFLODE.md. */
export const hallpartnerQuoteConfig = {
  id: 'hallpartner-offert-v1',
  title: 'Berätta om hallen du planerar.',
  intro: 'Beskriv användning, ungefärliga mått och byggort. Du lämnar underlag för en offertförfrågan, inte en automatisk prisberäkning eller beställning.',
  steps: [
    { id: 'project', title: 'Vad behöver du hallen till?', fields: [
      { id: 'project.use', kind: 'select', presentation: 'cards', required: true,
        label: 'Hur ska hallen främst användas?',
        options: [
          { value: 'storage', label: 'Lager eller förvaring' },
          { value: 'machinery', label: 'Maskiner eller verkstad' },
          { value: 'riding', label: 'Ridverksamhet' },
          { value: 'other', label: 'Annat' },
          { value: 'unknown', label: 'Inte bestämt ännu' }
        ] },
      { id: 'project.description', kind: 'textarea', required: true,
        label: 'Beskriv ditt behov', hint: 'Minst tio tecken. Exempelvis vad som ska få plats eller vad du vill kunna göra i hallen.',
        validate: value => value.trim().length < 10 ? 'Beskriv behovet med minst tio tecken.' : undefined }
    ] },
    { id: 'dimensions', title: 'Mått', description: 'Ungefärliga mått räcker – eller välj att du behöver hjälp.', fields: [
      { id: 'dimensions.confidence', kind: 'select', required: true, label: 'Hur säkra är dina mått?',
        options: [
          { value: 'exact', label: 'Jag vet måtten' },
          { value: 'approximate', label: 'Ungefärliga mått' },
          { value: 'need_help', label: 'Jag behöver hjälp' }
        ] },
      { id: 'dimensions.width', kind: 'text', label: 'Bredd i meter', hint: 'Frivilligt, t.ex. 18 eller 18,5.',
        when: a => a['dimensions.confidence'] !== 'need_help',
        validate: v => !/^\d{1,3}([,.]\d{1,2})?$/.test(v.trim()) || Number(v.replace(',', '.')) <= 0 ? 'Ange ett positivt tal i meter.' : undefined },
      { id: 'dimensions.length', kind: 'text', label: 'Längd i meter', hint: 'Frivilligt.',
        when: a => a['dimensions.confidence'] !== 'need_help',
        validate: v => !/^\d{1,3}([,.]\d{1,2})?$/.test(v.trim()) || Number(v.replace(',', '.')) <= 0 ? 'Ange ett positivt tal i meter.' : undefined },
      { id: 'dimensions.side_height', kind: 'text', label: 'Sidohöjd i meter', hint: 'Frivilligt.',
        when: a => a['dimensions.confidence'] !== 'need_help',
        validate: v => !/^\d{1,2}([,.]\d{1,2})?$/.test(v.trim()) || Number(v.replace(',', '.')) <= 0 ? 'Ange ett positivt tal i meter.' : undefined }
    ] },
    { id: 'site', title: 'Byggplats', description: 'Du behöver inte ha bestämt den exakta adressen.', fields: [
      { id: 'site.city', kind: 'text', label: 'Ort', hint: 'Frivilligt.' },
      { id: 'site.postal_code', kind: 'text', label: 'Postnummer', autocomplete: 'postal-code', hint: 'Frivilligt.',
        validate: v => !/^\d{3}\s?\d{2}$/.test(v.trim()) ? 'Ange fem siffror.' : undefined }
    ] },
    { id: 'customer', title: 'Kontaktuppgifter', description: 'Så Hallpartner kan återkomma om din förfrågan.', fields: [
      { id: 'contact.name', kind: 'text', label: 'Namn', autocomplete: 'name', required: true },
      { id: 'contact.email', kind: 'email', label: 'E-post', autocomplete: 'email', required: true },
      { id: 'contact.phone', kind: 'text', label: 'Telefon', autocomplete: 'tel',
        validate: v => !/^[+\d() -]{6,22}$/.test(v.trim()) ? 'Kontrollera telefonnumret.' : undefined },
      { id: 'contact.company', kind: 'text', label: 'Företag', autocomplete: 'organization' }
    ] }
  ]
} satisfies QuoteConfig;
