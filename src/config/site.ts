/**
 * Alle Stammdaten der Station an einer Stelle.
 * Quelle: Stationsseite von TÜV NORD (tuev-nord.de/de/stationen/penzberg-ingenieurbuero-ayvaz/)
 */

/** 0 = Sonntag … 6 = Samstag (wie Date#getDay) */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Zeitfenster im Format "HH:MM" */
export interface TimeSlot {
  from: string
  to: string
}

export interface OpeningDay {
  day: Weekday
  label: string
  short: string
  slots: TimeSlot[]
}

export const site = {
  name: 'Ingenieurbüro Ayvaz',
  station: 'TÜV NORD Station Penzberg',
  owner: 'Receb Ayvaz',

  /**
   * Ziel des Buttons „Termin vereinbaren“.
   * Zeigt auf die offizielle Stationsseite mit der TÜV NORD Online-Terminbuchung.
   * Wenn der direkte Buchungslink bekannt ist, hier einfach austauschen.
   */
  terminUrl: 'https://www.tuev-nord.de/de/stationen/penzberg-ingenieurbuero-ayvaz/',
  stationUrl: 'https://www.tuev-nord.de/de/stationen/penzberg-ingenieurbuero-ayvaz/',

  address: {
    street: 'Bürgermeister-Rummer-Str. 43',
    zip: '82377',
    city: 'Penzberg',
  },
  mapsUrl: 'https://maps.app.goo.gl/zq8UgBJ3z713PPpr7',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=B%C3%BCrgermeister-Rummer-Str.+43,+82377+Penzberg&output=embed',

  phone: { display: '0160 8887367', href: 'tel:+491608887367' },
  hotline: { display: '0800 80 70 600', href: 'tel:+498008070600' },
  email: 'rayvaz@extern.tuev-nord.de',

  instagram: {
    handle: '@tuvnord_ingenieurburo_ayvaz',
    url: 'https://www.instagram.com/tuvnord_ingenieurburo_ayvaz/',
  },

  limits: { weight: '4,2 t', height: '2,7 m' },
} as const

export const openingHours: OpeningDay[] = [
  { day: 1, label: 'Montag', short: 'Mo', slots: [{ from: '08:30', to: '17:30' }] },
  { day: 2, label: 'Dienstag', short: 'Di', slots: [{ from: '08:30', to: '17:30' }] },
  { day: 3, label: 'Mittwoch', short: 'Mi', slots: [{ from: '08:30', to: '15:00' }] },
  {
    day: 4,
    label: 'Donnerstag',
    short: 'Do',
    slots: [
      { from: '08:30', to: '11:00' },
      { from: '13:00', to: '16:30' },
    ],
  },
  {
    day: 5,
    label: 'Freitag',
    short: 'Fr',
    slots: [
      { from: '08:30', to: '12:00' },
      { from: '14:15', to: '17:00' },
    ],
  },
  { day: 6, label: 'Samstag', short: 'Sa', slots: [] },
  { day: 0, label: 'Sonntag', short: 'So', slots: [] },
]
