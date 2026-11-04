/** Verified roles from previously published Hallpartner material; portrait files supplied by Andreas. */
export const hallpartnerContact = {
  email: 'info@hallpartner.se',
  phone: '054-820 04 90',
  phoneHref: 'tel:+46548200490',
} as const;

export const hallpartnerPeople = [
  {
    id: 'jimmy-gustafsson',
    firstName: 'Jimmy',
    name: 'Jimmy Gustafsson',
    role: 'Säljare och projektledare för hallar',
    portrait: '/images/people/jimmy-gustafsson.png',
    intro: 'Jimmy arbetar med försäljning och projektledning av hallar. Du kan ta en första kontakt för att diskutera vad hallen ska användas till och vilka uppgifter som kan vara bra att samla inför nästa steg.',
    detail: 'När du beskriver ett tänkt hallprojekt är verksamhetens behov en bra utgångspunkt: hur utrymmet ska användas, ungefärliga mått och var hallen ska stå. Jimmy är en av personerna du kan kontakta för att börja den diskussionen.',
  },
  {
    id: 'peter-fridland',
    firstName: 'Peter',
    name: 'Peter Fridland',
    role: 'Säljare och projektledare för hallar',
    portrait: '/images/people/peter-fridland.png',
    intro: 'Peter arbetar med försäljning och projektledning av hallar. Du kan höra av dig för ett första samtal om ditt projekt och vilka frågor om hallens användning och byggplats som behöver redas ut.',
    detail: 'Det behövs inte färdiga ritningar för att börja. Berätta vad du vill få plats med, vilken typ av verksamhet det gäller och vilka förutsättningar du känner till. Peter är en av personerna hos Hallpartner som du kan ta de första frågorna med.',
  },
] as const;
