# TÜV NORD Station Penzberg · Ingenieurbüro Ayvaz

Webseite der TÜV NORD Station Penzberg (Ingenieurbüro Ayvaz, Bürgermeister-Rummer-Str. 43, 82377 Penzberg).

**Stack:** Vue 3 · TypeScript · Vite · selbst gehostete Schriften (Inter, Space Grotesk) · Lucide-Icons. Kein CSS-Framework, keine Cookies, kein Tracking.

## Highlights

- **Scheinwerfer-Intro** – die Seite startet dunkel, ein Auto schaltet Tagfahrlicht und Scheinwerfer ein und „knipst“ die Seite an (`IntroHeadlights.vue`). Überspringbar, entfällt bei `prefers-reduced-motion`.
- **Zahnräder** drehen sich beim Scrollen und greifen korrekt ineinander (`utils/gear.ts`, `GearTrain.vue`).
- **Hebebühne „Ab auf die Bühne“** – scrollgesteuert hebt eine Scherenhebebühne ein Auto an, die HU-Prüfpunkte werden nacheinander abgeleuchtet (`LiftScene.vue`).
- **Termin-Button auf der Hebebühne** – im Schlussbereich hebt eine kleine Bühne den „Termin vereinbaren“-Button ins Scheinwerferlicht (`CtaLift.vue`).
- **Live-Öffnungsstatus** (Zeitzone Europe/Berlin) inkl. Mittagspause.
- Google Maps erst nach Klick (DSGVO), Impressum & Datenschutz als Dialog.

## Daten ändern

Alle Stammdaten stehen in **`src/config/site.ts`**: Termin-Link (`terminUrl`), Telefon, E-Mail, Öffnungszeiten, Instagram, Google-Maps-Link.
Fotos liegen in `src/assets/img/` (WebP, 640/1280 px, ohne EXIF/GPS) und werden in `src/config/photos.ts` beschrieben.

## Entwicklung

```bash
npm install
npm run dev        # lokaler Dev-Server
npm run build      # Typecheck + Produktions-Build nach dist/
npm run preview    # gebauten Stand lokal ansehen
```

## Branches & Deployment

| Branch   | Inhalt |
|----------|--------|
| `main`   | Quellcode |
| `deploy` | Fertig gebaute Seite (Inhalt von `dist/`) – das, was ausgeliefert wird |

Jeder Push auf `main` startet `.github/workflows/deploy.yml`: Die Seite wird gebaut und der Build auf `deploy` gelegt.
Der Build nutzt relative Pfade (`base: './'`) und läuft daher unverändert auf GitHub Pages, unter eigener Domain oder in einem Unterordner beim Webhoster.

**GitHub Pages einschalten:** Repository → *Settings* → *Pages* → *Build and deployment* → Source „Deploy from a branch“ → Branch `deploy` / `(root)` → *Save*.
Hinweis: Für private Repositories ist GitHub Pages nur mit einem kostenpflichtigen Plan (z. B. GitHub Pro) verfügbar – alternativ das Repository auf „Public“ stellen.
