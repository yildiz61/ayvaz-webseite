<script setup lang="ts">
import { ref } from 'vue'
import { X } from '@lucide/vue'
import { site } from '@/config/site'

export type LegalPage = 'impressum' | 'datenschutz'

const dialog = ref<HTMLDialogElement | null>(null)
const page = ref<LegalPage>('impressum')

function open(p: LegalPage) {
  page.value = p
  dialog.value?.showModal()
}

defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="legal" :aria-label="page === 'impressum' ? 'Impressum' : 'Datenschutzerklärung'" @click.self="dialog?.close()">
    <div class="legal__inner">
      <button type="button" class="legal__close" aria-label="Schließen" @click="dialog?.close()">
        <X aria-hidden="true" />
      </button>

      <template v-if="page === 'impressum'">
        <h2>Impressum</h2>
        <h3>Angaben gemäß § 5 DDG</h3>
        <p>
          {{ site.name }}<br />
          Inhaber: {{ site.owner }}<br />
          {{ site.address.street }}<br />
          {{ site.address.zip }} {{ site.address.city }}
        </p>
        <h3>Kontakt</h3>
        <p>
          Telefon: <a :href="site.phone.href">{{ site.phone.display }}</a><br />
          E-Mail: <a :href="`mailto:${site.email}`">{{ site.email }}</a>
        </p>
        <h3>Tätigkeit</h3>
        <p>
          Betrieb der {{ site.station }} als Partnerunternehmen von TÜV NORD. Die Prüfungen erfolgen im Auftrag und
          nach den Vorgaben von TÜV NORD.
        </p>
        <h3>Verantwortlich für den Inhalt</h3>
        <p>{{ site.owner }}, Anschrift wie oben.</p>
        <h3>Haftung für Links</h3>
        <p>
          Diese Website enthält Links zu externen Websites Dritter (z. B. TÜV NORD Online-Terminbuchung, Google Maps,
          Instagram), auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der
          jeweilige Anbieter verantwortlich.
        </p>
      </template>

      <template v-else>
        <h2>Datenschutzerklärung</h2>
        <h3>Verantwortlicher</h3>
        <p>
          {{ site.name }}, {{ site.owner }}, {{ site.address.street }}, {{ site.address.zip }} {{ site.address.city }},
          E-Mail: <a :href="`mailto:${site.email}`">{{ site.email }}</a>
        </p>
        <h3>Hosting & Server-Logfiles</h3>
        <p>
          Beim Aufruf dieser Website verarbeitet der Hosting-Anbieter technisch notwendige Daten (z. B. IP-Adresse,
          Datum und Uhrzeit, aufgerufene Seite, Browser). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO – unser
          berechtigtes Interesse an einem sicheren und stabilen Betrieb.
        </p>
        <h3>Keine Cookies, kein Tracking</h3>
        <p>
          Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Werkzeuge. Schriftarten
          werden lokal ausgeliefert, es werden dafür keine Verbindungen zu Google hergestellt.
        </p>
        <h3>Google Maps</h3>
        <p>
          Die Karte wird erst geladen, wenn Sie auf „Karte laden“ klicken. Dann wird eine Verbindung zu Google
          (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) hergestellt und u. a. Ihre
          IP-Adresse übertragen. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO.
        </p>
        <h3>Externe Links</h3>
        <p>
          Die Online-Terminbuchung erfolgt auf den Seiten von TÜV NORD. Für die dortige Datenverarbeitung gelten die
          Datenschutzhinweise von TÜV NORD. Gleiches gilt für unser Profil bei Instagram (Meta Platforms Ireland Ltd.).
        </p>
        <h3>Kontaktaufnahme</h3>
        <p>
          Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer
          Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO).
        </p>
        <h3>Ihre Rechte</h3>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch sowie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
          beschweren – in Bayern beim Bayerischen Landesamt für Datenschutzaufsicht (BayLDA).
        </p>
      </template>
    </div>
  </dialog>
</template>

<style scoped>
.legal {
  width: min(720px, calc(100vw - 24px));
  max-height: min(86dvh, 900px);
  padding: 0;
  border: 0;
  border-radius: var(--r-lg);
  background: var(--white);
  color: var(--text);
  box-shadow: var(--shadow-lg);
}

.legal::backdrop {
  background: rgba(3, 6, 15, 0.7);
  backdrop-filter: blur(4px);
}

.legal__inner {
  position: relative;
  padding: clamp(24px, 5vw, 48px);
}

.legal h2 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.legal h3 {
  margin-top: 24px;
  font-size: 1.05rem;
}

.legal p {
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.96rem;
}

.legal a {
  color: var(--blue);
}

.legal__close {
  position: sticky;
  top: 0;
  float: right;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: var(--paper);
  cursor: pointer;
}

.legal__close svg {
  width: 20px;
  height: 20px;
}
</style>
