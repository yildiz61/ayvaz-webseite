<script setup lang="ts">
import GearTrain from './GearTrain.vue'
import type { GearSpec } from '@/utils/gear'

const teeth = [13, 9, 16, 10, 12, 8, 15, 11, 14, 9, 17, 10, 13]
const gears: GearSpec[] = teeth.map((t, i) => ({ teeth: t, angle: i % 2 ? 14 : -14, variant: 'solid' }))
</script>

<template>
  <!-- Der Rahmen schneidet seitlich ab, damit das breite Getriebe keinen horizontalen Scroll erzeugt -->
  <div class="gear-band" aria-hidden="true">
    <GearTrain class="gear-band__train" :gears="gears" :module="9" :speed="4" />
  </div>
</template>

<style scoped>
.gear-band {
  position: absolute;
  left: 0;
  right: 0;
  top: -120px;
  height: 240px;
  overflow: hidden;
  color: var(--band-color, var(--paper));
  pointer-events: none;
  z-index: 2;
}

.gear-band__train {
  position: absolute;
  left: 50%;
  top: 50%;
  width: max(1200px, 112%);
  transform: translate(-50%, -50%);
}
</style>
