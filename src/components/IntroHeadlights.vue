<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits<{ reveal: []; done: [] }>()

type Phase = 'dark' | 'drl' | 'beam' | 'reveal'
const phase = ref<Phase>('dark')
const root = ref<HTMLElement | null>(null)
const lampLeft = ref<SVGGElement | null>(null)
const lampRight = ref<SVGGElement | null>(null)
const timers: number[] = []
let finished = false

function at(ms: number, fn: () => void) {
  timers.push(window.setTimeout(fn, ms))
}

/** Lichtkegel-Mittelpunkte in Bildschirmkoordinaten, damit sich die Seite genau dort „aufhellt“. */
function measureLamps() {
  const el = root.value
  if (!el) return
  const set = (name: string, lamp: SVGGElement | null) => {
    if (!lamp) return
    const r = lamp.getBoundingClientRect()
    el.style.setProperty(`--${name}x`, `${r.left + r.width / 2}px`)
    el.style.setProperty(`--${name}y`, `${r.top + r.height / 2}px`)
  }
  set('l1', lampLeft.value)
  set('l2', lampRight.value)
}

function finish() {
  if (finished) return
  finished = true
  timers.forEach(clearTimeout)
  emit('done')
}

function startReveal() {
  measureLamps()
  phase.value = 'reveal'
  emit('reveal')
}

function skip() {
  if (phase.value === 'reveal') return finish()
  timers.forEach(clearTimeout)
  startReveal()
  at(700, finish)
}

function onKey(e: KeyboardEvent) {
  if (['Escape', 'Enter', ' ', 'ArrowDown', 'PageDown'].includes(e.key)) skip()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('wheel', skip, { passive: true, once: true })
  at(650, () => (phase.value = 'drl'))
  at(1450, () => (phase.value = 'beam'))
  at(2000, startReveal)
  at(3300, finish)
})

onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('wheel', skip)
})
</script>

<template>
  <div ref="root" class="intro" :class="`is-${phase}`" role="presentation" @click="skip">
    <div class="intro__flare" aria-hidden="true">
      <span class="flare flare--l"></span>
      <span class="flare flare--r"></span>
      <span class="streak"></span>
    </div>

    <svg class="car" viewBox="0 0 800 420" aria-hidden="true">
      <defs>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#151b29" />
          <stop offset="1" stop-color="#07090f" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1a2234" />
          <stop offset="1" stop-color="#0a0e17" />
        </linearGradient>
        <radialGradient id="lampHot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#ffffff" />
          <stop offset="0.45" stop-color="#fff6d8" />
          <stop offset="1" stop-color="#ffd45c" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Räder -->
      <rect x="150" y="300" width="86" height="80" rx="16" fill="#05070b" />
      <rect x="564" y="300" width="86" height="80" rx="16" fill="#05070b" />

      <!-- Karosserie -->
      <path
        class="car__body"
        d="M262 74 Q400 58 538 74 L590 160 Q640 168 668 196 Q690 222 684 262 L676 318 Q672 340 646 344 L154 344 Q128 340 124 318 L116 262 Q110 222 132 196 Q160 168 210 160 Z"
        fill="url(#carBody)"
      />
      <!-- Spiegel -->
      <path class="car__line" d="M206 150 L170 146 Q160 150 166 160 L208 164 Z" fill="#0d121c" />
      <path class="car__line" d="M594 150 L630 146 Q640 150 634 160 L592 164 Z" fill="#0d121c" />
      <!-- Frontscheibe -->
      <path d="M274 86 Q400 74 526 86 L568 156 Q400 146 232 156 Z" fill="url(#glass)" class="car__line" />
      <!-- Motorhaube -->
      <path class="car__line" d="M232 168 Q400 158 568 168" fill="none" />
      <path class="car__line" d="M300 172 Q330 200 336 214 M500 172 Q470 200 464 214" fill="none" />

      <!-- Kühlergrill -->
      <rect x="320" y="214" width="160" height="70" rx="18" fill="#06080d" class="car__line" />
      <g class="car__slats">
        <line x1="332" y1="232" x2="468" y2="232" />
        <line x1="330" y1="249" x2="470" y2="249" />
        <line x1="332" y1="266" x2="468" y2="266" />
      </g>
      <circle cx="400" cy="249" r="11" fill="none" class="car__line" />

      <!-- Unterer Lufteinlass -->
      <path class="car__line" d="M250 304 Q400 316 550 304 L540 326 Q400 334 260 326 Z" fill="#05070b" />

      <!-- Scheinwerfer links -->
      <g ref="lampLeft" class="lamp lamp--l">
        <path class="lamp__housing" d="M150 214 Q200 200 300 214 L292 238 Q220 244 160 236 Z" />
        <circle class="lamp__core" cx="196" cy="224" r="22" fill="url(#lampHot)" />
        <circle class="lamp__core" cx="252" cy="226" r="18" fill="url(#lampHot)" />
        <path class="lamp__drl" d="M160 230 Q170 214 206 210 L290 216" />
      </g>
      <!-- Scheinwerfer rechts -->
      <g ref="lampRight" class="lamp lamp--r">
        <path class="lamp__housing" d="M650 214 Q600 200 500 214 L508 238 Q580 244 640 236 Z" />
        <circle class="lamp__core" cx="604" cy="224" r="22" fill="url(#lampHot)" />
        <circle class="lamp__core" cx="548" cy="226" r="18" fill="url(#lampHot)" />
        <path class="lamp__drl" d="M640 230 Q630 214 594 210 L510 216" />
      </g>
    </svg>

    <button type="button" class="intro__skip" @click.stop="skip">Intro überspringen</button>
  </div>
</template>

<style scoped>
@property --reveal {
  syntax: '<length>';
  inherits: true;
  initial-value: -160px;
}

.intro {
  --reveal: -160px;
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background: radial-gradient(120% 90% at 50% 60%, #0a0f1c 0%, var(--ink-950) 60%);
  overflow: hidden;
  cursor: pointer;
}

.car {
  width: min(96vw, 820px);
  height: auto;
  opacity: 0;
  transform: translateY(4%) scale(0.96);
  animation: car-in 1.4s var(--ease-out) 0.15s forwards;
  transform-origin: 50% 55%;
}

.car__line,
.car__body {
  stroke: #232c40;
  stroke-width: 2;
}

.car__slats line {
  stroke: #1a2232;
  stroke-width: 4;
  stroke-linecap: round;
}

.lamp__housing {
  fill: #0b0f18;
  stroke: #2a3448;
  stroke-width: 2;
  transition: fill 0.3s;
}

.lamp__drl {
  fill: none;
  stroke: #1d2536;
  stroke-width: 5;
  stroke-linecap: round;
}

.lamp__core {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

/* Tagfahrlicht: kurzes Flackern, dann an */
.is-drl .lamp__drl,
.is-beam .lamp__drl,
.is-reveal .lamp__drl {
  stroke: #eef5ff;
  filter: drop-shadow(0 0 6px #cfe3ff) drop-shadow(0 0 18px #8fb8ff);
  animation: flicker 0.55s steps(1) both;
}

.is-beam .lamp__housing,
.is-reveal .lamp__housing {
  fill: #2b2f39;
}

.is-beam .lamp__core,
.is-reveal .lamp__core {
  opacity: 1;
  animation: lamp-on 0.5s var(--ease-out) both;
}

.is-beam .car__body,
.is-reveal .car__body {
  stroke: #3a4560;
}

/* Lichteffekte über dem Auto */
.intro__flare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

.flare {
  position: absolute;
  top: 50%;
  width: 70vmax;
  height: 70vmax;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 246, 216, 0.95) 0%, rgba(255, 212, 92, 0.45) 10%, rgba(255, 212, 92, 0.12) 28%, transparent 50%);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}

.flare--l {
  left: var(--l1x, 30%);
  top: var(--l1y, 55%);
}

.flare--r {
  left: var(--l2x, 70%);
  top: var(--l2y, 55%);
}

.streak {
  position: absolute;
  left: 50%;
  top: var(--l1y, 55%);
  width: 160vw;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(160, 200, 255, 0.85) 30%, #fff 50%, rgba(160, 200, 255, 0.85) 70%, transparent);
  filter: blur(1px);
  transform: translate(-50%, -50%) scaleX(0);
  opacity: 0;
}

.is-beam .flare,
.is-reveal .flare {
  animation: flare 0.9s var(--ease-out) forwards;
}

.is-beam .streak,
.is-reveal .streak {
  animation: streak 1s var(--ease-out) forwards;
}

/* Die eigentliche „Anknipsen“-Enthüllung: zwei Lichtkreise fressen die Dunkelheit weg */
.is-reveal {
  -webkit-mask-image:
    radial-gradient(circle at var(--l1x, 30%) var(--l1y, 55%), transparent var(--reveal), #000 calc(var(--reveal) + 160px)),
    radial-gradient(circle at var(--l2x, 70%) var(--l2y, 55%), transparent var(--reveal), #000 calc(var(--reveal) + 160px));
  -webkit-mask-composite: source-in;
  mask-image:
    radial-gradient(circle at var(--l1x, 30%) var(--l1y, 55%), transparent var(--reveal), #000 calc(var(--reveal) + 160px)),
    radial-gradient(circle at var(--l2x, 70%) var(--l2y, 55%), transparent var(--reveal), #000 calc(var(--reveal) + 160px));
  mask-composite: intersect;
  animation: reveal 1.25s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.is-reveal .car {
  animation: car-out 1.1s cubic-bezier(0.5, 0, 0.75, 0) forwards;
}

.intro__skip {
  position: absolute;
  bottom: max(24px, env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 18px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.intro__skip:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}

.is-reveal .intro__skip {
  opacity: 0;
}

@keyframes car-in {
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes car-out {
  from {
    opacity: 1;
    transform: none;
  }
  to {
    opacity: 0;
    transform: scale(1.7);
  }
}

@keyframes flicker {
  0% { opacity: 1; }
  12% { opacity: 0.1; }
  22% { opacity: 1; }
  34% { opacity: 0.25; }
  44%, 100% { opacity: 1; }
}

@keyframes lamp-on {
  0% { opacity: 0; transform: scale(0.4); }
  40% { opacity: 1; transform: scale(1.25); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes flare {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  45% { opacity: 1; transform: translate(-50%, -50%) scale(0.95); }
  100% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.75); }
}

@keyframes streak {
  0% { opacity: 0; transform: translate(-50%, -50%) scaleX(0); }
  40% { opacity: 1; transform: translate(-50%, -50%) scaleX(1); }
  100% { opacity: 0.5; transform: translate(-50%, -50%) scaleX(1); }
}

@keyframes reveal {
  0% { --reveal: -160px; opacity: 1; }
  85% { opacity: 1; }
  100% { --reveal: 150vmax; opacity: 0; }
}
</style>
