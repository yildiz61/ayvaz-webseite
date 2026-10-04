<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Phone } from '@lucide/vue'
import { site } from '@/config/site'
import { useInView } from '@/composables/useInView'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { easeInOutCubic, scissorGeometry } from '@/utils/scissor'
import { vReveal } from '@/composables/reveal'
import TerminButton from './ui/TerminButton.vue'

const VB_W = 420
const VB_H = 320
const BASE_Y = 292
const PLATFORM_H = 14

const rig = ref<HTMLElement | null>(null)
const inView = useInView(rig, 0.6)
const lift = ref(0)
let frame = 0

const geo = computed(() =>
  scissorGeometry(lift.value, { cx: VB_W / 2, baseY: BASE_Y, armLength: 150, stages: 2, minHeight: 18, maxHeight: 196 }),
)
const platformTop = computed(() => geo.value.topY - PLATFORM_H)
const payloadBottom = computed(() => `${((VB_H - platformTop.value) / VB_H) * 100}%`)
const atTop = computed(() => lift.value > 0.98)

function raise() {
  if (prefersReducedMotion()) {
    lift.value = 1
    return
  }
  const duration = 2200
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    lift.value = easeInOutCubic(t)
    if (t < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}

watch(inView, (v) => v && raise())
onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <section class="section cta on-dark" aria-labelledby="cta-title">
    <div class="container cta__grid">
      <div class="cta__copy">
        <p v-reveal class="eyebrow">Termin vereinbaren</p>
        <h2 id="cta-title" v-reveal="80" class="section-title">Bereit für die Bühne?</h2>
        <p v-reveal="160" class="section-lead">
          Buchen Sie Ihren Termin bequem online über TÜV NORD – oder rufen Sie uns einfach an. Wir freuen uns auf Sie
          und Ihr Fahrzeug.
        </p>
        <a v-reveal="220" class="cta__phone" :href="site.phone.href">
          <Phone aria-hidden="true" /> {{ site.phone.display }}
        </a>
      </div>

      <div ref="rig" class="cta__rig" :class="{ 'is-top': atTop }">
        <div class="cta__spot" aria-hidden="true"></div>

        <svg class="cta__svg" :viewBox="`0 0 ${VB_W} ${VB_H}`" aria-hidden="true">
          <defs>
            <pattern id="ctaHazard" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="16" height="16" fill="#111521" />
              <rect width="8" height="16" fill="#ffc21a" />
            </pattern>
          </defs>
          <ellipse :cx="VB_W / 2" :cy="BASE_Y + 22" rx="190" ry="8" fill="#000" opacity="0.35" />
          <rect x="70" :y="BASE_Y" width="280" height="16" rx="3" fill="#2a3142" />
          <rect x="70" :y="BASE_Y + 16" width="280" height="6" fill="url(#ctaHazard)" />

          <g stroke-linecap="round">
            <line
              v-for="(a, i) in geo.arms"
              :key="i"
              :x1="a.x1"
              :y1="a.y1"
              :x2="a.x2"
              :y2="a.y2"
              :stroke="i % 2 ? '#56607a' : '#3d4558'"
              stroke-width="11"
            />
            <circle v-for="(p, i) in geo.pivots" :key="`p${i}`" :cx="p.x" :cy="p.y" r="6" fill="#c4cad6" />
          </g>

          <g :transform="`translate(0 ${platformTop})`">
            <rect x="46" y="0" width="328" :height="PLATFORM_H" rx="3" fill="#3d4558" />
            <rect x="46" y="0" width="328" height="3" rx="1.5" fill="#7d879c" />
            <path d="M46 0 L24 14 L46 14 Z" fill="#c73a2c" />
            <path d="M374 0 L396 14 L374 14 Z" fill="#c73a2c" />
            <text :x="VB_W / 2" y="11" text-anchor="middle" font-size="8.5" font-weight="700" fill="#c4cad6" letter-spacing="1.5">
              MAX. {{ site.limits.weight.toUpperCase() }}
            </text>
          </g>
        </svg>

        <div class="cta__payload" :style="{ bottom: payloadBottom }">
          <TerminButton size="lg" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  overflow: hidden;
  background:
    radial-gradient(60% 80% at 75% 0%, rgba(36, 87, 230, 0.25), transparent 70%),
    var(--ink-950);
  color: #fff;
}

.cta__grid {
  display: grid;
  gap: 40px;
  align-items: center;
}

.cta__phone {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
}

.cta__phone svg {
  width: 22px;
  height: 22px;
  color: var(--light);
}

.cta__phone:hover {
  color: var(--light);
}

.cta__rig {
  position: relative;
  width: 100%;
  max-width: 520px;
  justify-self: center;
  aspect-ratio: 420 / 320;
}

.cta__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.cta__payload {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.cta__payload :deep(.btn) {
  box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.7);
  transition:
    box-shadow 0.6s,
    transform 0.25s var(--ease-out);
}

.is-top .cta__payload :deep(.btn) {
  animation: glow 2.4s ease-in-out 0.2s infinite;
}

/* Spot von oben, sobald der Button oben angekommen ist */
.cta__spot {
  position: absolute;
  left: 50%;
  top: -40%;
  width: 120%;
  height: 120%;
  transform: translateX(-50%);
  background: conic-gradient(from 150deg at 50% 0%, transparent 0deg, rgba(255, 230, 160, 0.22) 15deg, rgba(255, 230, 160, 0.22) 45deg, transparent 60deg);
  filter: blur(6px);
  opacity: 0;
  transition: opacity 0.8s;
  pointer-events: none;
}

.is-top .cta__spot {
  opacity: 1;
}

@keyframes glow {
  0%,
  100% {
    box-shadow:
      0 0 0 0 rgba(255, 212, 92, 0.5),
      0 10px 30px -12px rgba(0, 0, 0, 0.7);
  }
  50% {
    box-shadow:
      0 0 0 12px rgba(255, 212, 92, 0),
      0 0 50px 4px rgba(255, 212, 92, 0.35);
  }
}

@media (min-width: 960px) {
  .cta__grid {
    grid-template-columns: 1fr 1fr;
    gap: 64px;
  }
}

@media (max-width: 420px) {
  .cta__payload :deep(.btn--lg) {
    min-height: 54px;
    padding: 0.8em 1.3em;
    font-size: 1rem;
  }
}
</style>
