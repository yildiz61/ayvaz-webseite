<script setup lang="ts">
import { openingHours, site } from '@/config/site'
import BrandMark from './ui/BrandMark.vue'
import InstagramIcon from './ui/InstagramIcon.vue'
import GearTrain from './ui/GearTrain.vue'
import type { LegalPage } from './LegalDialog.vue'

const emit = defineEmits<{ legal: [page: LegalPage] }>()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer on-dark">
    <GearTrain
      class="footer__gears"
      :gears="[
        { teeth: 16, variant: 'outline' },
        { teeth: 9, angle: -30, variant: 'accent' },
      ]"
      :speed="7"
    />
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <BrandMark />
          <div>
            <strong>{{ site.name }}</strong>
            <span>{{ site.station }}</span>
          </div>
        </div>

        <div>
          <h3>Adresse</h3>
          <p>
            {{ site.address.street }}<br />
            {{ site.address.zip }} {{ site.address.city }}
          </p>
          <p>
            <a :href="site.phone.href">{{ site.phone.display }}</a><br />
            <a :href="`mailto:${site.email}`">{{ site.email }}</a>
          </p>
        </div>

        <div>
          <h3>Öffnungszeiten</h3>
          <ul class="footer__hours">
            <li v-for="d in openingHours.filter((o) => o.slots.length)" :key="d.day">
              <span>{{ d.short }}</span>
              <span>{{ d.slots.map((s) => `${s.from}–${s.to}`).join(', ') }}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3>Links</h3>
          <ul class="footer__links">
            <li><a :href="site.terminUrl" target="_blank" rel="noopener">Online-Terminbuchung</a></li>
            <li><a :href="site.stationUrl" target="_blank" rel="noopener">Station bei TÜV NORD</a></li>
            <li><a :href="site.mapsUrl" target="_blank" rel="noopener">Google Maps</a></li>
            <li>
              <a class="footer__insta" :href="site.instagram.url" target="_blank" rel="noopener">
                <InstagramIcon /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p>© {{ year }} {{ site.name }} · {{ site.station }}</p>
        <nav aria-label="Rechtliches">
          <button type="button" @click="emit('legal', 'impressum')">Impressum</button>
          <button type="button" @click="emit('legal', 'datenschutz')">Datenschutz</button>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  padding: clamp(56px, 8vw, 88px) 0 28px;
  background: var(--ink-900);
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.95rem;
  isolation: isolate;
}

.footer__gears {
  position: absolute;
  z-index: -1;
  right: -6%;
  top: -30%;
  width: min(60vw, 420px);
  color: rgba(255, 255, 255, 0.06);
}

.footer__grid {
  display: grid;
  gap: 36px;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.footer__brand :deep(.brand-mark) {
  width: 52px;
  height: 52px;
}

.footer__brand strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: #fff;
}

.footer__brand span {
  font-size: 0.85rem;
  color: var(--muted-on-dark);
}

.footer h3 {
  margin-bottom: 12px;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--light);
}

.footer p + p {
  margin-top: 10px;
}

.footer a {
  text-decoration: none;
  overflow-wrap: anywhere;
}

.footer a:hover {
  color: var(--light);
}

.footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}

.footer__hours li {
  display: flex;
  gap: 12px;
}

.footer__hours li span:first-child {
  width: 26px;
  color: var(--muted-on-dark);
}

.footer__insta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.footer__insta svg {
  width: 16px;
  height: 16px;
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-top: 48px;
  padding-top: 20px;
  border-top: 1px solid var(--line-on-dark);
  font-size: 0.85rem;
  color: var(--muted-on-dark);
}

.footer__bottom nav {
  display: flex;
  gap: 18px;
}

.footer__bottom button {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font-size: inherit;
  cursor: pointer;
}

.footer__bottom button:hover {
  color: var(--light);
}

@media (min-width: 720px) {
  .footer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .footer__grid {
    grid-template-columns: 1.3fr 1fr 1fr 1fr;
  }
}
</style>
