<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Menu, X, Phone } from '@lucide/vue'
import { site } from '@/config/site'
import TerminButton from './ui/TerminButton.vue'
import BrandMark from './ui/BrandMark.vue'

const links = [
  { href: '#leistungen', label: 'Leistungen' },
  { href: '#pruefung', label: 'Prüfung' },
  { href: '#ablauf', label: 'Ablauf' },
  { href: '#station', label: 'Station' },
  { href: '#kontakt', label: 'Öffnungszeiten & Kontakt' },
]

const scrolled = ref(false)
const open = ref(false)

const onScroll = () => (scrolled.value = window.scrollY > 24)

watch(open, (v) => document.body.classList.toggle('is-locked', v))

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled || open, 'is-open': open }">
    <div class="container header__inner">
      <a href="#top" class="header__brand" @click="open = false">
        <BrandMark />
        <span class="header__brand-text">
          <strong>{{ site.name }}</strong>
          <small>{{ site.station }}</small>
        </span>
      </a>

      <nav class="header__nav" aria-label="Hauptnavigation">
        <a v-for="l in links" :key="l.href" :href="l.href">{{ l.label }}</a>
      </nav>

      <div class="header__actions">
        <a class="header__call" :href="site.phone.href" aria-label="Anrufen">
          <Phone aria-hidden="true" />
        </a>
        <TerminButton class="header__termin" label="Termin" />
        <button
          type="button"
          class="header__burger"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="open ? 'Menü schließen' : 'Menü öffnen'"
          @click="open = !open"
        >
          <X v-if="open" aria-hidden="true" />
          <Menu v-else aria-hidden="true" />
        </button>
      </div>
    </div>

    <Transition name="sheet">
      <nav v-if="open" id="mobile-nav" class="sheet" aria-label="Mobile Navigation">
        <a v-for="(l, i) in links" :key="l.href" :href="l.href" :style="{ '--i': i }" @click="open = false">
          {{ l.label }}
        </a>
        <div class="sheet__cta">
          <TerminButton size="lg" />
          <a class="btn btn--ghost btn--lg" :href="site.phone.href">
            <Phone aria-hidden="true" /> {{ site.phone.display }}
          </a>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  height: var(--header-h);
  color: #fff;
  transition:
    background-color 0.35s,
    box-shadow 0.35s,
    backdrop-filter 0.35s;
}

.header.is-scrolled {
  background: rgba(10, 22, 48, 0.82);
  backdrop-filter: saturate(160%) blur(14px);
  -webkit-backdrop-filter: saturate(160%) blur(14px);
  box-shadow: 0 1px 0 var(--line-on-dark);
}

.header__inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  min-width: 0;
}

.header__brand :deep(.brand-mark) {
  width: 40px;
  height: 40px;
  flex: none;
}

.header__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  min-width: 0;
}

.header__brand-text strong {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 650;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.header__brand-text small {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-on-dark);
  white-space: nowrap;
}

.header__nav {
  display: none;
  margin-left: auto;
  gap: 4px;
}

.header__nav a {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 500;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.82);
  transition: color 0.2s, background-color 0.2s;
}

.header__nav a:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.header__call,
.header__burger {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 0;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.header__call:hover,
.header__burger:hover {
  background: rgba(255, 255, 255, 0.16);
}

.header__call svg,
.header__burger svg {
  width: 20px;
  height: 20px;
}

.header__termin {
  display: none;
  min-height: 44px;
  padding: 0.6em 1.1em;
  font-size: 0.92rem;
}

/* Mobile Sheet */
.sheet {
  position: fixed;
  inset: var(--header-h) 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px var(--gutter) max(32px, env(safe-area-inset-bottom));
  background: var(--ink-900);
  overflow-y: auto;
}

.sheet > a {
  padding: 14px 4px;
  border-bottom: 1px solid var(--line-on-dark);
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 600;
  text-decoration: none;
  animation: sheet-item 0.5s var(--ease-out) both;
  animation-delay: calc(var(--i) * 50ms + 60ms);
}

.sheet__cta {
  display: grid;
  gap: 12px;
  margin-top: auto;
  padding-top: 32px;
}

.sheet-enter-active,
.sheet-leave-active {
  transition:
    opacity 0.3s,
    transform 0.4s var(--ease-out);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@keyframes sheet-item {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@media (min-width: 640px) {
  .header__termin {
    display: inline-flex;
  }
}

@media (min-width: 1100px) {
  .header__nav {
    display: flex;
  }

  .header__actions {
    margin-left: 8px;
  }

  .header__burger {
    display: none;
  }
}

@media (max-width: 380px) {
  .header__brand-text small {
    display: none;
  }
}
</style>
