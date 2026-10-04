<script setup lang="ts">
import { gearShape } from '@/utils/gear'

// Zahnrad ohne Aussparungen – nur der Außenumriss, das „A“ sitzt in der Mitte.
const gear = gearShape(10, 10).d.split('Z')[0] + 'Z'
</script>

<template>
  <svg class="brand-mark" viewBox="-62 -62 124 124" aria-hidden="true">
    <path :d="gear" fill="var(--light)" />
    <circle r="36" fill="var(--ink-900)" />
    <path
      d="M-15 18 L0 -20 L15 18 M-8.5 4 H8.5"
      fill="none"
      stroke="#fff"
      stroke-width="7"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
