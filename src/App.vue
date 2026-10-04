<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import IntroHeadlights from './components/IntroHeadlights.vue'
import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import LiftScene from './components/LiftScene.vue'
import ProcessSection from './components/ProcessSection.vue'
import StationSection from './components/StationSection.vue'
import ContactSection from './components/ContactSection.vue'
import CtaLift from './components/CtaLift.vue'
import AppFooter from './components/AppFooter.vue'
import LegalDialog from './components/LegalDialog.vue'

// Kein Intro bei reduzierter Bewegung oder wenn direkt ein Abschnitt verlinkt wurde (#kontakt …)
const skipIntro = prefersReducedMotion() || (location.hash.length > 1 && location.hash !== '#top')
const showIntro = ref(!skipIntro)
const ready = ref(skipIntro)
const legal = ref<InstanceType<typeof LegalDialog> | null>(null)

function onReveal() {
  ready.value = true
}

function onIntroDone() {
  showIntro.value = false
  ready.value = true
  document.body.classList.remove('is-locked')
}

onMounted(() => {
  if (showIntro.value) {
    window.scrollTo(0, 0)
    document.body.classList.add('is-locked')
  }
})
</script>

<template>
  <IntroHeadlights v-if="showIntro" @reveal="onReveal" @done="onIntroDone" />
  <AppHeader />
  <main>
    <HeroSection :ready="ready" />
    <ServicesSection />
    <LiftScene />
    <ProcessSection />
    <StationSection />
    <ContactSection />
    <CtaLift />
  </main>
  <AppFooter @legal="(p) => legal?.open(p)" />
  <LegalDialog ref="legal" />
</template>
