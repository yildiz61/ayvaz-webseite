<script setup lang="ts">
import { ref } from 'vue'
import { Clock, Phone, Mail, Headset, Navigation, MapPin, Map as MapIcon } from '@lucide/vue'
import { openingHours, site } from '@/config/site'
import { useOpeningStatus } from '@/composables/useOpeningStatus'
import { vReveal } from '@/composables/reveal'
import StatusPill from './ui/StatusPill.vue'
import TerminButton from './ui/TerminButton.vue'
import InstagramIcon from './ui/InstagramIcon.vue'

const status = useOpeningStatus()
const mapLoaded = ref(false)

const contacts = [
  { icon: Phone, label: 'Telefon', value: site.phone.display, href: site.phone.href },
  { icon: Mail, label: 'E-Mail', value: site.email, href: `mailto:${site.email}` },
  { icon: Headset, label: 'TÜV NORD Service (kostenlos)', value: site.hotline.display, href: site.hotline.href },
]
</script>

<template>
  <section id="kontakt" class="section contact">
    <div class="container">
      <div class="contact__head">
        <p v-reveal class="eyebrow">Öffnungszeiten & Kontakt</p>
        <h2 v-reveal="80" class="section-title">Wir sind für Sie da.</h2>
      </div>

      <div class="contact__grid">
        <article v-reveal class="card hours">
          <header class="card__head">
            <span class="card__icon"><Clock aria-hidden="true" /></span>
            <h3>Öffnungszeiten</h3>
          </header>
          <StatusPill class="hours__status" />

          <dl class="hours__table">
            <div v-for="d in openingHours" :key="d.day" class="hours__row" :class="{ 'is-today': d.day === status.today, 'is-closed': !d.slots.length }">
              <dt>
                {{ d.label }}
                <span v-if="d.day === status.today" class="hours__today">Heute</span>
              </dt>
              <dd>
                <template v-if="d.slots.length">
                  <span v-for="s in d.slots" :key="s.from">{{ s.from }} – {{ s.to }}</span>
                </template>
                <span v-else>geschlossen</span>
              </dd>
            </div>
          </dl>

          <p class="hours__note">
            Mit Termin geht’s am schnellsten. Geprüft werden Fahrzeuge bis {{ site.limits.weight }} und
            {{ site.limits.height }} Höhe.
          </p>
          <TerminButton class="hours__cta" />
        </article>

        <div class="contact__side">
          <article v-reveal="100" class="card">
            <header class="card__head">
              <span class="card__icon"><Phone aria-hidden="true" /></span>
              <h3>Kontakt</h3>
            </header>
            <ul class="contact__list">
              <li v-for="c in contacts" :key="c.label">
                <a :href="c.href">
                  <component :is="c.icon" aria-hidden="true" />
                  <span>
                    <small>{{ c.label }}</small>
                    <strong>{{ c.value }}</strong>
                  </span>
                </a>
              </li>
              <li>
                <a :href="site.instagram.url" target="_blank" rel="noopener">
                  <InstagramIcon />
                  <span>
                    <small>Instagram</small>
                    <strong>{{ site.instagram.handle }}</strong>
                  </span>
                </a>
              </li>
            </ul>
          </article>

          <article v-reveal="180" class="card map">
            <header class="card__head">
              <span class="card__icon"><MapPin aria-hidden="true" /></span>
              <h3>Anfahrt</h3>
            </header>
            <address>
              {{ site.station }}<br />
              {{ site.address.street }}<br />
              {{ site.address.zip }} {{ site.address.city }}
            </address>

            <div class="map__frame">
              <iframe
                v-if="mapLoaded"
                :src="site.mapsEmbedUrl"
                title="Karte: TÜV NORD Station Penzberg"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              <div v-else class="map__consent">
                <MapIcon aria-hidden="true" />
                <p>Zum Schutz Ihrer Daten wird Google Maps erst nach Klick geladen.</p>
                <button type="button" class="btn btn--blue" @click="mapLoaded = true">Karte laden</button>
              </div>
            </div>

            <a class="btn btn--ghost map__route" :href="site.mapsUrl" target="_blank" rel="noopener">
              <Navigation aria-hidden="true" /> Route planen
            </a>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  background: var(--paper-2);
}

.contact__head {
  margin-bottom: clamp(32px, 5vw, 56px);
}

.contact__grid {
  display: grid;
  gap: 16px;
}

.contact__side {
  display: grid;
  gap: 16px;
}

.card {
  padding: clamp(22px, 3.5vw, 32px);
  border-radius: var(--r-lg);
  background: var(--white);
  box-shadow: var(--shadow-sm);
}

.card__head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card__head h3 {
  font-size: 1.45rem;
}

.card__icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--ink-900);
  color: var(--light);
}

.card__icon svg {
  width: 20px;
  height: 20px;
}

/* Öffnungszeiten */
.hours__status {
  margin-top: 20px;
  background: rgba(10, 22, 48, 0.05) !important;
  box-shadow: inset 0 0 0 1px var(--line) !important;
}

.hours__table {
  margin: 20px 0 0;
}

.hours__row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 14px;
  border-radius: 12px;
  border-bottom: 1px solid var(--line);
}

.hours__row:last-child {
  border-bottom: 0;
}

.hours__row dt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.hours__row dd {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.hours__row.is-closed dd {
  color: var(--muted);
}

.hours__row.is-today {
  background: #fff8e1;
  border-bottom-color: transparent;
  box-shadow: inset 4px 0 0 var(--light-strong);
}

.hours__row.is-today dt,
.hours__row.is-today dd {
  font-weight: 650;
}

.hours__today {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--light);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hours__note {
  margin-top: 20px;
  font-size: 0.94rem;
  color: var(--muted);
}

.hours__cta {
  margin-top: 20px;
  width: 100%;
}

/* Kontakt */
.contact__list {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
}

.contact__list a {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 8px;
  border-radius: 12px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.contact__list a:hover {
  background: var(--paper);
}

.contact__list svg {
  width: 22px;
  height: 22px;
  flex: none;
  color: var(--blue);
}

.contact__list span {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.contact__list small {
  font-size: 0.8rem;
  color: var(--muted);
}

.contact__list strong {
  font-weight: 600;
  overflow-wrap: anywhere;
}

/* Karte */
.map address {
  margin-top: 14px;
  font-style: normal;
  color: var(--muted);
}

.map__frame {
  margin-top: 18px;
  aspect-ratio: 16 / 10;
  border-radius: var(--r);
  overflow: hidden;
  background:
    radial-gradient(circle at 30% 40%, rgba(36, 87, 230, 0.12), transparent 50%),
    repeating-linear-gradient(45deg, var(--paper) 0 12px, var(--paper-2) 12px 24px);
}

.map__frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.map__consent {
  height: 100%;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 12px;
  padding: 20px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--muted);
}

.map__consent svg {
  width: 32px;
  height: 32px;
  color: var(--blue);
}

.map__route {
  margin-top: 16px;
  width: 100%;
  color: var(--ink-900);
}

@media (min-width: 960px) {
  .contact__grid {
    grid-template-columns: 1.1fr 1fr;
    align-items: start;
  }
}
</style>
