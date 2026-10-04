<script setup lang="ts">
import { computed, ref } from 'vue'
import { placeGearTrain, type GearSpec } from '@/utils/gear'
import { useScrollTicker } from '@/composables/useScrollTicker'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const props = withDefaults(
  defineProps<{
    gears: GearSpec[]
    module?: number
    /** Grad × Zähne pro gescrolltem Pixel – höher = schneller */
    speed?: number
    /** zusätzliche Drehung des ganzen Getriebes */
    rotate?: number
  }>(),
  { module: 10, speed: 5, rotate: 0 },
)

const placed = computed(() => placeGearTrain(props.gears, props.module))

const viewBox = computed(() => {
  const pad = props.module * 2
  const xs = placed.value.flatMap((g) => [g.x - g.outerRadius, g.x + g.outerRadius])
  const ys = placed.value.flatMap((g) => [g.y - g.outerRadius, g.y + g.outerRadius])
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  return `${minX} ${minY} ${Math.max(...xs) - minX + pad} ${Math.max(...ys) - minY + pad}`
})

const spinners = ref<SVGGElement[]>([])
const reduced = prefersReducedMotion()

function setAngles(scrollY: number) {
  placed.value.forEach((g, i) => {
    const el = spinners.value[i]
    if (!el) return
    const angle = g.phase + (reduced ? 0 : (g.dir * props.speed * scrollY) / g.teeth)
    el.setAttribute('transform', `rotate(${angle.toFixed(2)})`)
  })
}

useScrollTicker(setAngles)
</script>

<template>
  <svg class="gear-train" :viewBox="viewBox" aria-hidden="true" focusable="false">
    <g :transform="`rotate(${rotate})`">
      <g v-for="(g, i) in placed" :key="i" :transform="`translate(${g.x.toFixed(2)} ${g.y.toFixed(2)})`">
        <g
          :ref="(el) => { if (el) spinners[i] = el as SVGGElement }"
          :transform="`rotate(${g.phase.toFixed(2)})`"
        >
          <path :d="g.d" :class="`gear-${g.variant}`" fill-rule="evenodd" />
        </g>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.gear-train {
  overflow: visible;
}
</style>
