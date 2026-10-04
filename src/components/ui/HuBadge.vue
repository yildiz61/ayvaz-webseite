<script setup lang="ts">
import { computed } from 'vue'
import { plaketteFor } from '@/utils/hu'

const props = defineProps<{ year: number }>()
const p = computed(() => plaketteFor(props.year))
const months = Array.from({ length: 12 }, (_, i) => i + 1)
</script>

<template>
  <svg class="hu-badge" viewBox="-60 -60 120 120" role="img" :aria-label="`HU-Plakette ${p.year} (${p.name})`">
    <circle r="58" :fill="p.color" />
    <circle r="57" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1" />
    <circle r="22" fill="none" :stroke="p.text" stroke-opacity=".5" stroke-width="1" />
    <!-- Monatssegmente -->
    <g :fill="p.text">
      <text
        v-for="m in months"
        :key="m"
        :x="(Math.sin((m / 12) * Math.PI * 2) * 40).toFixed(2)"
        :y="(-Math.cos((m / 12) * Math.PI * 2) * 40 + 4.5).toFixed(2)"
        text-anchor="middle"
        font-size="12"
        font-weight="700"
        font-family="var(--font-display)"
      >{{ m }}</text>
      <text y="7" text-anchor="middle" font-size="21" font-weight="800" font-family="var(--font-display)">
        {{ String(p.year).slice(-2) }}
      </text>
    </g>
    <g :stroke="p.text" stroke-opacity=".35" stroke-width="1">
      <line
        v-for="m in months"
        :key="`l${m}`"
        :x1="(Math.sin(((m + 0.5) / 12) * Math.PI * 2) * 24).toFixed(2)"
        :y1="(-Math.cos(((m + 0.5) / 12) * Math.PI * 2) * 24).toFixed(2)"
        :x2="(Math.sin(((m + 0.5) / 12) * Math.PI * 2) * 54).toFixed(2)"
        :y2="(-Math.cos(((m + 0.5) / 12) * Math.PI * 2) * 54).toFixed(2)"
      />
    </g>
  </svg>
</template>
