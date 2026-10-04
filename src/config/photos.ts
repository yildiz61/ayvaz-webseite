const files = import.meta.glob<string>('../assets/img/*.webp', { eager: true, import: 'default' })

export interface Photo {
  src: string
  srcset: string
  width: number
  height: number
  alt: string
}

function photo(name: string, width: number, height: number, alt: string): Photo {
  const small = files[`../assets/img/${name}-640.webp`]
  const large = files[`../assets/img/${name}-1280.webp`]
  if (!small || !large) throw new Error(`Bild fehlt: ${name}`)
  return { src: large, srcset: `${small} 640w, ${large} 1280w`, width, height, alt }
}

export const photos = {
  pruefstrasse: photo(
    'pruefstrasse',
    1280,
    1707,
    'Schwarze Limousine auf der Prüfstraße der TÜV NORD Station Penzberg, daneben TÜV NORD Beachflags',
  ),
  buero: photo('buero', 1280, 960, 'Helles Büro der Station mit großer Fensterfront und Penzberg-Stadtplan an der Pinnwand'),
  unterboden: photo('unterboden', 1280, 1700, 'Prüfer leuchtet mit einer Taschenlampe den Unterboden eines Fahrzeugs auf der Hebebühne aus'),
  hebebuehne: photo('hebebuehne', 1280, 1700, 'Blick unter die Scherenhebebühne: Der Prüfer kontrolliert Fahrwerk und Achsen'),
  weste: photo('weste', 1280, 1700, 'Prüfer in TÜV NORD Weste neben der glänzenden Fahrzeugflanke'),
  radkasten: photo('radkasten', 1280, 1707, 'Prüfer kontrolliert mit Lampe Radkasten und Reifen eines Mercedes'),
  felge: photo('felge', 1280, 1707, 'Prüfer in TÜV NORD Weste inspiziert Bremse und Felge'),
  nervennahrung: photo('nervennahrung', 1280, 1700, 'Kiste mit kleinen TÜV NORD Tütchen als Nervennahrung für die Wartezeit'),
} satisfies Record<string, Photo>
