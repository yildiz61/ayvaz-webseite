<script setup lang="ts">
import { ref } from 'vue'
import { Phone, Weight, MoveVertical, ListChecks, MapPin } from '@lucide/vue'
import { site } from '@/config/site'
import { photos } from '@/config/photos'
import { useScrollTicker } from '@/composables/useScrollTicker'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import TerminButton from './ui/TerminButton.vue'
import StatusPill from './ui/StatusPill.vue'
import GearTrain from './ui/GearTrain.vue'
import HuBadge from './ui/HuBadge.vue'

defineProps<{ ready: boolean }>()

const nextHu = new Date().getFullYear() + 2
const badge = ref<HTMLElement | null>(null)
const photo = ref<HTMLElement | null>(null)
const reduced = prefersReducedMotion()

useScrollTicker((y) => {
  if (reduced) return
  if (badge.value) badge.value.style.transform = `rotate(${(-8 + y * 0.12).toFixed(2)}deg)`
  if (photo.value && y < window.innerHeight * 1.5) photo.value.style.transform = `translateY(${(y * 0.06).toFixed(1)}px)`
})

const facts = [
  { icon: ListChecks, value: '150+', label: 'Prüfkriterien bei der HU' },
  { icon: Weight, value: site.limits.weight, label: 'zulässiges Gesamtgewicht' },
  { icon: MoveVertical, value: site.limits.height, label: 'maximale Fahrzeughöhe' },
  { icon: MapPin, value: 'Penzberg', label: 'Bürgermeister-Rummer-Str. 43' },
]
</script>

<template>
  <section id="top" class="hero on-dark" :class="{ 'is-ready': ready }">
    <div class="hero__glow" aria-hidden="true"></div>
    <GearTrain
      class="hero__gears hero__gears--a"
      :gears="[
        { teeth: 18, variant: 'outline' },
        { teeth: 10, angle: 35, variant: 'accent' },
        { teeth: 14, angle: -20, variant: 'outline' },
      ]"
    />
    <GearTrain
      class="hero__gears hero__gears--b"
      :gears="[
        { teeth: 12, variant: 'outline' },
        { teeth: 20, angle: 160, variant: 'outline' },
      ]"
    />

    <div class="container hero__grid">
      <div class="hero__copy">
        <p class="eyebrow hero__in" style="--d: 0">{{ site.station }}</p>
        <h1 class="hero__title hero__in" style="--d: 1">
          Gründlich geprüft.<br />
          <span class="hero__hl">Persönlich</span> betreut.
        </h1>
        <p class="hero__lead hero__in" style="--d: 2">
          Hauptuntersuchung, Abgasuntersuchung, Änderungsabnahmen und Gutachten – beim
          {{ site.name }}, mitten in Penzberg. Mit Sorgfalt, klaren Worten und einem Lächeln.
        </p>
        <div class="hero__ctas hero__in" style="--d: 3">
          <TerminButton size="lg" />
          <a class="btn btn--ghost btn--lg" :href="site.phone.href">
            <Phone aria-hidden="true" /> {{ site.phone.display }}
          </a>
        </div>
        <StatusPill class="hero__in" style="--d: 4" />
      </div>

      <div class="hero__visual hero__in" style="--d: 2">
        <div ref="photo" class="hero__photo-wrap">
          <figure class="hero__photo">
            <img
              :src="photos.pruefstrasse.src"
              :srcset="photos.pruefstrasse.srcset"
              sizes="(min-width: 960px) 460px, 90vw"
              :width="photos.pruefstrasse.width"
              :height="photos.pruefstrasse.height"
              :alt="photos.pruefstrasse.alt"
              fetchpriority="high"
            />
          </figure>
        </div>
        <div class="hero__badge">
          <div ref="badge" class="hero__badge-disc">
            <HuBadge :year="nextHu" />
          </div>
          <p>
            <strong>Heute geprüft?</strong>
            <span>Dann zeigt Ihre Plakette die {{ String(nextHu).slice(-2) }}.</span>
          </p>
        </div>
      </div>
    </div>

    <div class="container">
      <ul class="hero__facts">
        <li v-for="(f, i) in facts" :key="f.label" class="hero__in" :style="{ '--d': 4 + i * 0.5 }">
          <component :is="f.icon" aria-hidden="true" />
          <div>
            <strong>{{ f.value }}</strong>
            <span>{{ f.label }}</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding-top: calc(var(--header-h) + clamp(28px, 6vw, 72px));
  padding-bottom: clamp(96px, 11vw, 140px);
  background:
    radial-gradient(120% 70% at 50% 0%, #142a57 0%, transparent 60%),
    linear-gradient(180deg, var(--ink-900) 0%, #0c1a38 100%);
  color: #fff;
  isolation: isolate;
}

/* Restlicht der Scheinwerfer aus dem Intro */
.hero__glow {
  position: absolute;
  inset: -20% -10% auto;
  height: 90%;
  z-index: -1;
  background:
    radial-gradient(38% 46% at 28% 30%, rgba(255, 212, 92, 0.16), transparent 70%),
    radial-gradient(38% 46% at 72% 30%, rgba(255, 212, 92, 0.12), transparent 70%);
  opacity: 0;
  transition: opacity 2s ease;
}

.is-ready .hero__glow {
  opacity: 1;
}

.hero__gears {
  position: absolute;
  z-index: -1;
  color: rgba(255, 255, 255, 0.09);
  pointer-events: none;
}

.hero__gears--a {
  width: min(70vw, 560px);
  right: -12%;
  bottom: -18%;
}

.hero__gears--b {
  width: min(48vw, 360px);
  left: -14%;
  top: 14%;
  opacity: 0.7;
}

.hero__grid {
  display: grid;
  gap: clamp(40px, 6vw, 72px);
  align-items: center;
}

.hero__title {
  margin-top: 18px;
  font-size: clamp(2.6rem, 8.4vw, 4.6rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.02;
}

.hero__hl {
  position: relative;
  color: var(--light);
  text-shadow: 0 0 40px rgba(255, 212, 92, 0.35);
}

.hero__lead {
  margin-top: 22px;
  max-width: 52ch;
  font-size: clamp(1.05rem, 1.9vw, 1.22rem);
  color: var(--muted-on-dark);
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 32px 0 22px;
}

.hero__visual {
  position: relative;
  justify-self: center;
  width: min(100%, 460px);
}

.hero__photo-wrap {
  will-change: transform;
}

.hero__photo {
  margin: 0;
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 40px 80px -30px rgba(0, 0, 0, 0.8);
  aspect-ratio: 4 / 5;
  background: var(--ink-800);
}

.hero__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 60%;
}

.hero__badge {
  position: absolute;
  left: -6%;
  bottom: 7%;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 270px;
  padding: 10px 16px 10px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: var(--text);
  box-shadow: var(--shadow-lg);
}

.hero__badge-disc {
  width: 58px;
  height: 58px;
  flex: none;
  transform: rotate(-8deg);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.18));
}

.hero__badge p {
  display: flex;
  flex-direction: column;
  font-size: 0.86rem;
  line-height: 1.3;
}

.hero__badge strong {
  font-family: var(--font-display);
  font-size: 0.98rem;
}

.hero__badge span {
  color: var(--muted);
}

.hero__facts {
  list-style: none;
  margin: clamp(48px, 7vw, 88px) 0 0;
  padding: 24px 0 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 16px;
  border-top: 1px solid var(--line-on-dark);
}

.hero__facts li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.hero__facts svg {
  width: 22px;
  height: 22px;
  flex: none;
  margin-top: 4px;
  color: var(--light);
}

.hero__facts strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 650;
  line-height: 1.2;
}

.hero__facts span {
  font-size: 0.86rem;
  color: var(--muted-on-dark);
}

/* Einblenden nach dem Intro */
.hero__in {
  opacity: 0;
  transform: translateY(24px);
}

.is-ready .hero__in {
  opacity: 1;
  transform: none;
  transition:
    opacity 1s var(--ease-out),
    transform 1s var(--ease-out);
  transition-delay: calc(var(--d, 0) * 110ms);
}

@media (min-width: 960px) {
  .hero__grid {
    grid-template-columns: 1.15fr 0.85fr;
  }

  .hero__visual {
    justify-self: end;
  }

  .hero__facts {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .hero__ctas .btn {
    width: 100%;
  }

  .hero__badge {
    left: 4%;
    bottom: 5%;
  }
}
</style>
