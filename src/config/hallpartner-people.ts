/** Verified roles from previously published Hallpartner material; portrait files supplied by Andreas. */
export const hallpartnerContact = {
  email: 'info@hallpartner.se',
  phone: '054-820 04 90',
  phoneHref: 'tel:+46548200490',
  // The legal name and number appear on Hallpartner's existing website.
  // Confirm the contracting entity before customer go-live (HP-015).
  legalName: 'Fridland Consulting AB',
  organisationNumber: '559071-8549',
  // Confirmed by Hallpartner project owner on 2026-11-08 as the visiting address.
  // Use the address supplied for Fridland Consulting AB; do not replace the shared telephone.
  visitAddress: 'Zakrisdalsvägen 26 A, 653 36 Karlstad',
} as const;

export const hallpartnerPeople = [
  {
    id: 'jimmy-gustafsson',
    // Reserved for verified, explicitly publishable personal direct contacts.
    directPhone: null as string | null,
    directPhoneHref: null as string | null,
    directEmail: null as string | null,
    firstName: 'Jimmy',
    name: 'Jimmy Gustafsson',
    role: 'Säljare och projektledare för hallar',
    portrait: '/images/people/jimmy-gustafsson.png',
    intro: 'Jimmy arbetar med försäljning och projektledning av hallar. Du kan ta en första kontakt för att diskutera vad hallen ska användas till och vilka uppgifter som kan vara bra att samla inför nästa steg.',
    detail: 'När du beskriver ett tänkt hallprojekt är verksamhetens behov en bra utgångspunkt: hur utrymmet ska användas, ungefärliga mått och var hallen ska stå. Jimmy är en av personerna du kan kontakta för att börja den diskussionen.',
  },
  {
    id: 'peter-fridland',
    // Reserved for verified, explicitly publishable personal direct contacts.
    directPhone: null as string | null,
    directPhoneHref: null as string | null,
    directEmail: null as string | null,
    firstName: 'Peter',
    name: 'Peter Fridland',
    role: 'Säljare och projektledare för hallar',
    portrait: '/images/people/peter-fridland.png',
    intro: 'Peter arbetar med försäljning och projektledning av hallar. Du kan höra av dig för ett första samtal om ditt projekt och vilka frågor om hallens användning och byggplats som behöver redas ut.',
    detail: 'Det behövs inte färdiga ritningar för att börja. Berätta vad du vill få plats med, vilken typ av verksamhet det gäller och vilka förutsättningar du känner till. Peter är en av personerna hos Hallpartner som du kan ta de första frågorna med.',
  },
] as const;
