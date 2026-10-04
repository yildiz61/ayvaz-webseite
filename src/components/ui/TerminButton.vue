<script setup lang="ts">
import { CalendarCheck, ArrowUpRight } from '@lucide/vue'
import { site } from '@/config/site'

withDefaults(defineProps<{ size?: 'md' | 'lg'; label?: string }>(), {
  size: 'md',
  label: 'Termin vereinbaren',
})
</script>

<template>
  <a
    class="btn btn--primary termin-btn"
    :class="{ 'btn--lg': size === 'lg' }"
    :href="site.terminUrl"
    target="_blank"
    rel="noopener"
  >
    <CalendarCheck aria-hidden="true" />
    <span>{{ label }}</span>
    <ArrowUpRight class="termin-btn__arrow" aria-hidden="true" />
    <span class="sr-only">(öffnet die Online-Terminbuchung von TÜV NORD in einem neuen Tab)</span>
  </a>
</template>

<style scoped>
.termin-btn__arrow {
  margin-left: -0.15em;
  transition: transform 0.25s var(--ease-out);
}

.termin-btn:hover .termin-btn__arrow {
  transform: translate(2px, -2px);
}
</style>
