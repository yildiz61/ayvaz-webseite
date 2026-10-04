<script setup lang="ts">
import { ClipboardCheck, Wind, Wrench, FileText, CarFront, RefreshCw, Weight, MoveVertical } from '@lucide/vue'
import { site } from '@/config/site'
import { vReveal } from '@/composables/reveal'
import GearBand from './ui/GearBand.vue'
import TerminButton from './ui/TerminButton.vue'

const services = [
  {
    icon: ClipboardCheck,
    tag: 'HU',
    title: 'Hauptuntersuchung',
    text: 'Die gesetzliche Prüfung im Zwei-Jahres-Takt: Bremsen, Lenkung, Fahrwerk, Licht, Karosserie – über 150 sicherheits- und umweltrelevante Kriterien.',
  },
  {
    icon: Wind,
    tag: 'AU',
    title: 'Abgasuntersuchung',
    text: 'Fester Bestandteil der HU. Wir messen das Abgasverhalten von Benzinern und Dieseln und prüfen die Abgasanlage auf Dichtheit.',
  },
  {
    icon: Wrench,
    tag: 'Umbau',
    title: 'Änderungsabnahmen',
    text: 'Neue Felgen, Tieferlegung, Anhängerkupplung oder andere An- und Umbauten? Wir nehmen Ihre Änderungen amtlich anerkannt ab – damit alles eingetragen werden kann.',
  },
  {
    icon: FileText,
    tag: 'Gutachten',
    title: 'Vollgutachten',
    text: 'Wenn ein Fahrzeug komplett neu begutachtet werden muss – etwa nach einem Import oder bei fehlenden Unterlagen – erstellen wir das Vollgutachten.',
  },
  {
    icon: CarFront,
    tag: 'H-Kennzeichen',
    title: 'Oldtimer-Gutachten',
    text: 'Ihr Klassiker hat das H-Kennzeichen verdient? Wir begutachten Originalität und Erhaltungszustand – mit viel Liebe zum Detail.',
  },
  {
    icon: RefreshCw,
    tag: 'Nachprüfung',
    title: 'Nachprüfung',
    text: 'Mängel festgestellt? Kein Drama. Nach der Reparatur prüfen wir die beanstandeten Punkte nach – und Sie bekommen Ihre Plakette.',
  },
]
</script>

<template>
  <section id="leistungen" class="section services">
    <GearBand />
    <div class="container">
      <div class="services__head">
        <div v-reveal>
          <p class="eyebrow">Leistungen</p>
          <h2 class="section-title">Alles, was Ihr Fahrzeug für die Straße braucht.</h2>
        </div>
        <p v-reveal="120" class="section-lead">
          Als Partner von TÜV NORD prüfen wir nach denselben strengen Standards – aber mit dem persönlichen
          Draht, den man nur vor Ort bekommt.
        </p>
      </div>

      <ul class="services__grid">
        <li v-for="(s, i) in services" :key="s.title" v-reveal="(i % 3) * 90">
          <article class="service">
            <div class="service__icon"><component :is="s.icon" aria-hidden="true" /></div>
            <span class="service__tag">{{ s.tag }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
          </article>
        </li>
      </ul>

      <div v-reveal class="services__limits">
        <div class="services__limits-items">
          <span><Weight aria-hidden="true" /> Fahrzeuge bis <strong>{{ site.limits.weight }}</strong></span>
          <span><MoveVertical aria-hidden="true" /> bis <strong>{{ site.limits.height }}</strong> Höhe</span>
        </div>
        <TerminButton />
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  background: var(--paper);
  padding-top: clamp(96px, 12vw, 160px);
}

.services__head {
  display: grid;
  gap: 20px;
  align-items: end;
  margin-bottom: clamp(40px, 6vw, 64px);
}

.services__head .section-lead {
  margin-top: 0;
}

.services__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
}

.service {
  position: relative;
  height: 100%;
  padding: 28px 26px 30px;
  border-radius: var(--r);
  background: var(--white);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition:
    transform 0.4s var(--ease-out),
    box-shadow 0.4s var(--ease-out);
}

.service::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 3px;
  background: linear-gradient(90deg, var(--blue), var(--light));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s var(--ease-out);
}

.service:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.service:hover::after {
  transform: scaleX(1);
}

.service__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: var(--blue-soft);
  color: var(--blue);
}

.service__icon svg {
  width: 26px;
  height: 26px;
}

.service__tag {
  position: absolute;
  top: 28px;
  right: 24px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--paper);
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.service h3 {
  margin-top: 22px;
  font-size: 1.4rem;
}

.service p {
  margin-top: 10px;
  color: var(--muted);
  font-size: 0.98rem;
}

.services__limits {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 24px;
  padding: 20px 24px;
  border-radius: var(--r);
  background: var(--ink-900);
  color: #fff;
}

.services__limits-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
}

.services__limits-items span {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.services__limits-items svg {
  width: 20px;
  height: 20px;
  color: var(--light);
}

@media (min-width: 720px) {
  .services__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .services__head {
    grid-template-columns: 1.2fr 1fr;
  }

  .services__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .services__limits .btn {
    width: 100%;
  }
}
</style>
