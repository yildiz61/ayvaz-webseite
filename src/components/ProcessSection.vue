<script setup lang="ts">
import { ref } from 'vue'
import { CalendarCheck, MapPin, Search, BadgeCheck, FileText } from '@lucide/vue'
import { site } from '@/config/site'
import { vReveal } from '@/composables/reveal'
import { useScrollTicker } from '@/composables/useScrollTicker'
import GearTrain from './ui/GearTrain.vue'

const steps = [
  {
    icon: CalendarCheck,
    title: 'Termin buchen',
    text: 'Online über das TÜV NORD Buchungssystem – oder ganz klassisch per Telefon.',
  },
  {
    icon: MapPin,
    title: 'Vorbeikommen',
    text: `${site.address.street} in ${site.address.city}. Einfach auf die Prüfstraße rollen.`,
  },
  {
    icon: Search,
    title: 'Prüfung',
    text: 'Gründlich und transparent. Fragen sind ausdrücklich erwünscht – wir erklären gern, was wir sehen.',
  },
  {
    icon: BadgeCheck,
    title: 'Plakette & Bericht',
    text: 'Alles in Ordnung? Dann gibt’s die neue Plakette direkt aufs Kennzeichen und den Prüfbericht dazu.',
  },
]

const list = ref<HTMLElement | null>(null)
const fill = ref(0)

useScrollTicker(() => {
  const el = list.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const start = window.innerHeight * 0.75
  fill.value = Math.min(1, Math.max(0, (start - r.top) / r.height))
})
</script>

<template>
  <section id="ablauf" class="section process on-dark">
    <GearTrain
      class="process__gears"
      :gears="[
        { teeth: 22, variant: 'outline' },
        { teeth: 11, angle: -40, variant: 'accent' },
        { teeth: 15, angle: 20, variant: 'outline' },
      ]"
      :speed="6"
    />
    <div class="container process__grid">
      <div class="process__head">
        <p v-reveal class="eyebrow">Ablauf</p>
        <h2 v-reveal="80" class="section-title">So einfach geht’s.</h2>
        <p v-reveal="160" class="section-lead">
          Keine Wartezimmer-Romantik, keine Fachchinesisch-Vorträge. Sie kommen, wir prüfen – und Sie fahren mit
          gutem Gefühl wieder vom Hof.
        </p>
        <div v-reveal="240" class="process__bring">
          <FileText aria-hidden="true" />
          <div>
            <strong>Bitte mitbringen</strong>
            <p>Zulassungsbescheinigung Teil I (Fahrzeugschein) – bei Änderungsabnahmen zusätzlich die Teilegutachten bzw. ABE.</p>
          </div>
        </div>
      </div>

      <ol ref="list" class="process__steps" :style="{ '--fill': fill }">
        <li v-for="(s, i) in steps" :key="s.title" v-reveal="i * 80" :class="{ 'is-lit': fill > (i + 0.3) / steps.length }">
          <span class="process__icon"><component :is="s.icon" aria-hidden="true" /></span>
          <div>
            <span class="process__step">Schritt {{ i + 1 }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.process {
  overflow: hidden;
  background: var(--ink-900);
  color: #fff;
  isolation: isolate;
}

.process__gears {
  position: absolute;
  z-index: -1;
  width: min(80vw, 620px);
  left: -18%;
  bottom: -22%;
  color: rgba(255, 255, 255, 0.07);
}

.process__grid {
  display: grid;
  gap: 56px;
}

.process__bring {
  display: flex;
  gap: 14px;
  margin-top: 32px;
  padding: 18px 20px;
  border-radius: var(--r);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 0 1px var(--line-on-dark);
  max-width: 520px;
}

.process__bring svg {
  width: 24px;
  height: 24px;
  flex: none;
  color: var(--light);
}

.process__bring strong {
  font-family: var(--font-display);
}

.process__bring p {
  margin-top: 4px;
  font-size: 0.94rem;
  color: var(--muted-on-dark);
}

.process__steps {
  --fill: 0;
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 36px;
}

/* Verbindungslinie, die beim Scrollen „aufleuchtet“ */
.process__steps::before,
.process__steps::after {
  content: '';
  position: absolute;
  left: 27px;
  top: 28px;
  bottom: 28px;
  width: 2px;
  border-radius: 2px;
  background: var(--line-on-dark);
}

.process__steps::after {
  background: linear-gradient(var(--light), var(--light-strong));
  box-shadow: 0 0 16px var(--light-glow);
  transform: scaleY(var(--fill));
  transform-origin: top;
}

.process__steps li {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 20px;
}

.process__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  flex: none;
  border-radius: 50%;
  background: var(--ink-800);
  box-shadow: inset 0 0 0 2px var(--line-on-dark);
  color: var(--muted-on-dark);
  transition:
    background-color 0.5s,
    color 0.5s,
    box-shadow 0.5s;
}

.process__icon svg {
  width: 24px;
  height: 24px;
}

.is-lit .process__icon {
  background: var(--light);
  color: var(--ink-900);
  box-shadow: 0 0 0 6px rgba(255, 212, 92, 0.15), 0 0 30px var(--light-glow);
}

.process__step {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--light);
}

.process__steps h3 {
  margin-top: 4px;
  font-size: 1.5rem;
}

.process__steps p {
  margin-top: 6px;
  color: var(--muted-on-dark);
  max-width: 46ch;
}

@media (min-width: 960px) {
  .process__grid {
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }

  .process__head {
    position: sticky;
    top: calc(var(--header-h) + 40px);
  }
}
</style>
