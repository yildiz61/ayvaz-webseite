<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check } from '@lucide/vue'
import { stickyProgress, useScrollTicker } from '@/composables/useScrollTicker'
import { easeInOutCubic, scissorGeometry, segment } from '@/utils/scissor'
import HuBadge from './ui/HuBadge.vue'

const section = ref<HTMLElement | null>(null)
const progress = ref(0)

useScrollTicker(() => {
  if (section.value) progress.value = stickyProgress(section.value)
})

/* ---------- Szene ---------- */
const CX = 400
const FLOOR = 566
const BASE_Y = 546
const PLATFORM_H = 16

const lift = computed(() => easeInOutCubic(segment(progress.value, 0.04, 0.4)))
const geo = computed(() =>
  scissorGeometry(lift.value, { cx: CX, baseY: BASE_Y, armLength: 236, stages: 2, minHeight: 26, maxHeight: 262 }),
)
/** Aufstandsfläche der Räder */
const contactY = computed(() => geo.value.topY - PLATFORM_H)

const checks = [
  {
    id: 'licht',
    title: 'Beleuchtung & Elektrik',
    text: 'Scheinwerfer, Blinker, Bremslichter und Hupe – sehen und gesehen werden.',
    x: 262,
    y: -76,
  },
  {
    id: 'reifen',
    title: 'Räder & Reifen',
    text: 'Profiltiefe, Alter, Beschädigungen und die passende Dimension.',
    x: -170,
    y: -40,
  },
  {
    id: 'bremsen',
    title: 'Bremsanlage',
    text: 'Scheiben, Beläge, Leitungen – und die Bremswirkung auf dem Prüfstand.',
    x: 175,
    y: -40,
  },
  {
    id: 'lenkung',
    title: 'Lenkung & Achsen',
    text: 'Spiel in Gelenken und Lagern, Manschetten, Federn und Stoßdämpfer.',
    x: 112,
    y: -10,
  },
  {
    id: 'unterboden',
    title: 'Unterboden & Rahmen',
    text: 'Korrosion an tragenden Teilen, Leitungen und Halterungen – mit der Lampe ganz genau.',
    x: -30,
    y: -10,
  },
  {
    id: 'abgas',
    title: 'Abgasanlage & AU',
    text: 'Dichtheit und Befestigung der Anlage sowie das Abgasverhalten Ihres Motors.',
    x: -238,
    y: -12,
  },
] as const

const checkProgress = computed(() => segment(progress.value, 0.24, 0.92))
const active = computed(() => (checkProgress.value <= 0 ? -1 : Math.min(checks.length - 1, Math.floor(checkProgress.value * checks.length))))
const passed = computed(() => progress.value > 0.93)
const activeCheck = computed(() => (active.value >= 0 ? checks[active.value] : undefined))

function state(i: number) {
  if (passed.value || i < active.value) return 'done'
  if (i === active.value) return 'active'
  return 'todo'
}

/* Prüflampe: steht rechts unter der Bühne und leuchtet auf den aktiven Prüfpunkt */
const LAMP = { x: 712, y: 470 }
const beam = computed(() => {
  const c = activeCheck.value
  if (!c || passed.value) return { visible: false, angle: -150, length: 200 }
  const tx = CX + c.x
  const ty = contactY.value + c.y
  const dx = tx - LAMP.x
  const dy = ty - LAMP.y
  return { visible: true, angle: (Math.atan2(dy, dx) * 180) / Math.PI, length: Math.hypot(dx, dy) }
})

const shadow = computed(() => ({ rx: 270 - lift.value * 60, opacity: 0.32 - lift.value * 0.18 }))
const nextHu = new Date().getFullYear() + 2
</script>

<template>
  <section id="pruefung" ref="section" class="lift" aria-labelledby="lift-title">
    <div class="lift__sticky">
      <div class="container lift__grid">
        <div class="lift__copy">
          <p class="eyebrow">Hauptuntersuchung</p>
          <h2 id="lift-title" class="section-title">Ab auf die Bühne.</h2>
          <p class="section-lead lift__lead">
            Das Wichtigste sieht man von unten. Deshalb kommt bei uns jedes Fahrzeug auf die Hebebühne – scrollen Sie
            weiter und schauen Sie unserem Prüfer über die Schulter.
          </p>

          <ol class="lift__list">
            <li v-for="(c, i) in checks" :key="c.id" :class="`is-${state(i)}`">
              <span class="lift__num">
                <Check v-if="state(i) === 'done'" aria-hidden="true" />
                <template v-else>{{ String(i + 1).padStart(2, '0') }}</template>
              </span>
              <div>
                <strong>{{ c.title }}</strong>
                <p>{{ c.text }}</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="lift__stage">
          <svg class="lift__svg" viewBox="70 84 680 516" role="img" aria-label="Animation: Ein Auto wird auf einer Scherenhebebühne angehoben und von unten geprüft">
            <defs>
              <linearGradient id="liftBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#25355a" />
                <stop offset="0.55" stop-color="#0f1a33" />
                <stop offset="1" stop-color="#070c18" />
              </linearGradient>
              <linearGradient id="liftGlass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#9fb4d8" />
                <stop offset="1" stop-color="#2c3d63" />
              </linearGradient>
              <linearGradient id="liftBeam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#ffe9a3" stop-opacity="0.95" />
                <stop offset="1" stop-color="#ffd45c" stop-opacity="0.05" />
              </linearGradient>
              <linearGradient id="liftSteel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#4a5468" />
                <stop offset="1" stop-color="#2a3142" />
              </linearGradient>
              <pattern id="hazard" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="24" height="24" fill="#16181d" />
                <rect width="12" height="24" fill="#ffc21a" />
              </pattern>
            </defs>

            <!-- Boden -->
            <ellipse :cx="CX" :cy="FLOOR + 2" :rx="shadow.rx" ry="12" fill="#0a1630" :opacity="shadow.opacity" />
            <rect x="0" :y="FLOOR" width="800" height="34" fill="#d9d4c8" />
            <rect x="150" :y="FLOOR" width="500" height="8" fill="url(#hazard)" opacity="0.9" />

            <!-- Grundplatte -->
            <rect x="176" :y="BASE_Y" width="448" height="20" rx="4" fill="url(#liftSteel)" />

            <!-- Hydraulikzylinder -->
            <g v-if="geo.pivots[0]">
              <line :x1="CX - 92" :y1="BASE_Y - 4" :x2="geo.pivots[0].x" :y2="geo.pivots[0].y" stroke="#c4cad6" stroke-width="7" stroke-linecap="round" />
              <line
                :x1="CX - 92"
                :y1="BASE_Y - 4"
                :x2="CX - 92 + (geo.pivots[0].x - (CX - 92)) * 0.55"
                :y2="BASE_Y - 4 + (geo.pivots[0].y - (BASE_Y - 4)) * 0.55"
                stroke="#e04a3a"
                stroke-width="13"
                stroke-linecap="round"
              />
            </g>

            <!-- Scherenarme -->
            <g stroke-linecap="round">
              <line
                v-for="(a, i) in geo.arms"
                :key="i"
                :x1="a.x1"
                :y1="a.y1"
                :x2="a.x2"
                :y2="a.y2"
                :stroke="i % 2 ? '#39414f' : '#2b313c'"
                stroke-width="15"
              />
              <circle v-for="(pv, i) in geo.pivots" :key="`p${i}`" :cx="pv.x" :cy="pv.y" r="8" fill="#c4cad6" stroke="#2b313c" stroke-width="3" />
            </g>

            <!-- Plattform / Fahrschiene -->
            <g :transform="`translate(0 ${geo.topY - PLATFORM_H})`">
              <rect x="128" y="0" width="544" :height="PLATFORM_H" rx="3" fill="#2b313c" />
              <rect x="128" y="0" width="544" height="4" rx="2" fill="#5a6476" />
              <path d="M128 0 L96 16 L128 16 Z" fill="#c73a2c" />
              <path d="M672 0 L704 16 L672 16 Z" fill="#c73a2c" />
              <rect x="300" y="5" width="200" height="6" rx="3" fill="#c73a2c" />
            </g>

            <!-- Prüflampe & Lichtkegel -->
            <g class="lift__lamp" :class="{ 'is-on': beam.visible }">
              <g
                class="lift__beam"
                :style="{ transform: `translate(${LAMP.x}px, ${LAMP.y}px) rotate(${beam.angle}deg)` }"
              >
                <path :d="`M0 -3 L${beam.length + 30} -34 L${beam.length + 30} 34 L0 3 Z`" fill="url(#liftBeam)" />
              </g>
              <rect :x="LAMP.x - 9" :y="LAMP.y - 4" width="18" height="96" rx="7" fill="#1f2633" />
              <rect :x="LAMP.x - 9" :y="LAMP.y - 4" width="18" height="16" rx="6" fill="#4cc3ff" />
              <circle :cx="LAMP.x" :cy="LAMP.y - 2" r="5" fill="#fff6d8" />
            </g>

            <!-- Auto -->
            <g :transform="`translate(${CX} ${contactY})`">
              <!-- Radhäuser -->
              <path d="M233 -22 A60 60 0 1 0 117 -22 Z M-112 -22 A60 60 0 1 0 -228 -22 Z" fill="#05080f" />
              <!-- Räder -->
              <g v-for="wx in [-170, 175]" :key="wx" :transform="`translate(${wx} -40)`">
                <circle r="40" fill="#0b0d12" />
                <circle r="26" fill="#b9c0cc" />
                <circle r="20" fill="#8d95a3" />
                <g stroke="#d7dbe3" stroke-width="5" stroke-linecap="round">
                  <line v-for="k in 5" :key="k" x1="0" y1="0" :x2="Math.cos((k * 72 * Math.PI) / 180) * 20" :y2="Math.sin((k * 72 * Math.PI) / 180) * 20" />
                </g>
                <circle r="6" fill="#3a404c" />
              </g>
              <!-- Unterboden -->
              <path d="M-226 -20 L117 -20" stroke="#060a14" stroke-width="6" />
              <rect x="-252" y="-22" width="24" height="7" rx="3" fill="#6b7280" />
              <!-- Karosserie -->
              <path
                d="M-262 -24 L-268 -58 Q-268 -84 -246 -92 L-196 -98 Q-160 -132 -110 -142 Q-20 -154 50 -144 Q92 -130 132 -102 L226 -88 Q262 -82 270 -62 L268 -30 Q266 -22 252 -22 L233 -22 A60 60 0 1 0 117 -22 L-112 -22 A60 60 0 1 0 -228 -22 L-252 -22 Q-262 -22 -262 -24 Z"
                fill="url(#liftBody)"
              />
              <!-- Fenster -->
              <path d="M-150 -100 Q-126 -128 -100 -134 Q-20 -146 44 -136 L108 -102 Z" fill="url(#liftGlass)" opacity="0.9" />
              <rect x="-24" y="-142" width="9" height="42" fill="#0f1a33" />
              <!-- Linien & Details -->
              <path d="M-258 -66 Q0 -76 264 -66" fill="none" stroke="#5f79b0" stroke-width="2" opacity="0.6" />
              <path d="M-19 -100 L-17 -30 M104 -98 L100 -34 M-148 -98 L-136 -34" fill="none" stroke="#050a14" stroke-width="2" opacity="0.7" />
              <rect x="56" y="-84" width="22" height="5" rx="2.5" fill="#8ea2c9" />
              <rect x="-80" y="-84" width="22" height="5" rx="2.5" fill="#8ea2c9" />
              <path d="M104 -104 L122 -114 L128 -104 L112 -99 Z" fill="#0f1a33" />
              <path d="M236 -86 L264 -78 Q269 -72 262 -70 L238 -77 Z" fill="#fff6d8" />
              <path d="M-266 -82 L-246 -90 L-247 -79 L-266 -73 Z" fill="#e5484d" />
            </g>

            <!-- Prüfpunkte -->
            <g :transform="`translate(${CX} ${contactY})`">
              <g
                v-for="(c, i) in checks"
                :key="c.id"
                class="lift__spot"
                :class="`is-${state(i)}`"
                :transform="`translate(${c.x} ${c.y})`"
              >
                <circle class="lift__spot-ring" r="15" />
                <circle class="lift__spot-dot" r="9" />
                <text y="3.5" text-anchor="middle">{{ i + 1 }}</text>
              </g>
            </g>
          </svg>

          <div class="lift__passed" :class="{ 'is-shown': passed }" aria-live="polite">
            <HuBadge :year="nextHu" class="lift__passed-badge" />
            <div>
              <strong>Bestanden!</strong>
              <span>Plakette drauf – gute Fahrt.</span>
            </div>
          </div>

          <!-- Aktiver Prüfpunkt (mobil) -->
          <div class="lift__caption" aria-live="polite">
            <template v-if="passed">
              <span class="lift__num is-done"><Check aria-hidden="true" /></span>
              <div>
                <strong>Alle Prüfpunkte erledigt</strong>
                <p>Über 150 Kriterien – für Ihre Sicherheit.</p>
              </div>
            </template>
            <template v-else-if="activeCheck">
              <span class="lift__num">{{ String(active + 1).padStart(2, '0') }}</span>
              <div>
                <strong>{{ activeCheck.title }}</strong>
                <p>{{ activeCheck.text }}</p>
              </div>
            </template>
            <template v-else>
              <span class="lift__num lift__num--hint">↓</span>
              <div>
                <strong>Weiterscrollen</strong>
                <p>…und die Bühne fährt hoch.</p>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="lift__progress" aria-hidden="true">
        <span :style="{ transform: `scaleX(${progress})` }"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lift {
  position: relative;
  height: 340vh;
  background-color: var(--paper-2);
  background-image:
    linear-gradient(rgba(10, 22, 48, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(10, 22, 48, 0.05) 1px, transparent 1px);
  background-size: 36px 36px;
}

.lift__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: var(--header-h);
}

.lift__grid {
  display: grid;
  gap: 8px;
  height: 100%;
  grid-template-rows: auto minmax(0, 1fr);
  padding-block: 12px 20px;
}

.lift__copy .section-title {
  font-size: clamp(1.9rem, 5vw, 3.4rem);
}

.lift__lead,
.lift__list {
  display: none;
}

.lift__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.lift__svg {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 100%;
}

/* Lampe */
.lift__lamp {
  opacity: 0;
  transition: opacity 0.5s;
}

.lift__lamp.is-on {
  opacity: 1;
}

.lift__beam {
  transform-box: view-box;
  transform-origin: 0 0;
  transition: transform 0.6s var(--ease-out);
  mix-blend-mode: multiply;
}

/* Prüfpunkte */
.lift__spot {
  transition: opacity 0.4s;
}

.lift__spot text {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  fill: var(--ink-900);
}

.lift__spot-dot {
  fill: #fff;
  stroke: var(--ink-900);
  stroke-width: 2;
  transition: fill 0.3s;
}

.lift__spot-ring {
  fill: none;
  stroke: var(--light-strong);
  stroke-width: 3;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

.lift__spot.is-todo {
  opacity: 0.35;
}

.lift__spot.is-active .lift__spot-dot {
  fill: var(--light);
}

.lift__spot.is-active .lift__spot-ring {
  opacity: 1;
  animation: spot 1.4s ease-out infinite;
}

.lift__spot.is-done .lift__spot-dot {
  fill: var(--ok);
  stroke: var(--ok);
}

.lift__spot.is-done text {
  fill: #fff;
}

@keyframes spot {
  from {
    transform: scale(0.7);
    opacity: 1;
  }
  to {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* Liste (Desktop) */
.lift__list {
  list-style: none;
  margin: 28px 0 0;
  padding: 0;
  gap: 4px;
}

.lift__list li {
  display: flex;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 14px;
  transition:
    background-color 0.35s,
    opacity 0.35s,
    box-shadow 0.35s;
  opacity: 0.45;
}

.lift__list li p {
  display: none;
  font-size: 0.92rem;
  color: var(--muted);
}

.lift__list li.is-done {
  opacity: 0.85;
}

.lift__list li.is-active {
  opacity: 1;
  background: var(--white);
  box-shadow: var(--shadow-sm);
}

.lift__list li.is-active p {
  display: block;
  margin-top: 2px;
}

.lift__list strong {
  font-family: var(--font-display);
  font-weight: 600;
}

.lift__num {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 50%;
  background: var(--white);
  box-shadow: inset 0 0 0 1.5px var(--line);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
}

.lift__num svg {
  width: 16px;
  height: 16px;
}

.is-active > .lift__num {
  background: var(--light);
  box-shadow: none;
}

.is-done > .lift__num,
.lift__num.is-done {
  background: var(--ok);
  color: #fff;
  box-shadow: none;
}

.lift__num--hint {
  animation: bob 1.4s ease-in-out infinite;
}

@keyframes bob {
  50% {
    transform: translateY(3px);
  }
}

/* Caption (mobil) */
.lift__caption {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  min-height: 92px;
  padding: 14px 16px;
  border-radius: var(--r);
  background: var(--white);
  box-shadow: var(--shadow-sm);
}

.lift__caption strong {
  font-family: var(--font-display);
  font-weight: 600;
}

.lift__caption p {
  font-size: 0.92rem;
  color: var(--muted);
}

/* Bestanden */
.lift__passed {
  position: absolute;
  top: 2%;
  right: 2%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px 10px 10px;
  border-radius: 999px;
  background: var(--white);
  box-shadow: var(--shadow);
  opacity: 0;
  transform: scale(0.6) rotate(-12deg);
  transition:
    opacity 0.3s,
    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lift__passed.is-shown {
  opacity: 1;
  transform: none;
}

.lift__passed-badge {
  width: 52px;
  height: 52px;
}

.lift__passed strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--ok);
}

.lift__passed span {
  font-size: 0.85rem;
  color: var(--muted);
}

.lift__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: rgba(10, 22, 48, 0.08);
}

.lift__progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--blue), var(--light));
  transform-origin: left;
}

@media (min-width: 960px) {
  .lift {
    height: 380vh;
  }

  .lift__grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.25fr);
    grid-template-rows: 1fr;
    align-items: center;
    gap: 48px;
  }

  .lift__lead {
    display: block;
  }

  .lift__list {
    display: grid;
  }

  .lift__stage {
    height: min(78vh, 620px);
  }

  .lift__caption {
    display: none;
  }
}

@media (min-width: 960px) and (max-height: 760px) {
  .lift__lead {
    display: none;
  }
}
</style>
