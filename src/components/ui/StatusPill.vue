<script setup lang="ts">
import { useOpeningStatus } from '@/composables/useOpeningStatus'

const status = useOpeningStatus()
</script>

<template>
  <p class="status" :class="`status--${status.state}`" aria-live="polite">
    <span class="status__dot" aria-hidden="true"></span>
    <strong>{{ status.label }}</strong>
    <span v-if="status.detail" class="status__detail">{{ status.detail }}</span>
  </p>
</template>

<style scoped>
.status {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45em;
  padding: 0.5em 1em 0.5em 0.85em;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  font-size: 0.92rem;
}

.status strong {
  font-weight: 600;
}

.status__detail {
  opacity: 0.75;
}

.status__detail::before {
  content: '· ';
}

.status__dot {
  position: relative;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--off);
}

.status--open .status__dot {
  background: var(--ok);
}

.status--break .status__dot {
  background: var(--warn);
}

.status--open .status__dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: inherit;
  animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}
</style>
