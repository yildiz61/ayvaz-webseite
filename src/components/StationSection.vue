<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheck, Wrench, HeartHandshake, MapPin, X, ChevronLeft, ChevronRight } from '@lucide/vue'
import { site } from '@/config/site'
import { photos, type Photo } from '@/config/photos'
import { vReveal } from '@/composables/reveal'
import InstagramIcon from './ui/InstagramIcon.vue'

const values = [
  { icon: ShieldCheck, title: 'Amtlich anerkannt', text: 'Geprüft wird nach den Standards von TÜV NORD.' },
  { icon: HeartHandshake, title: 'Persönlich & ehrlich', text: 'Feste Ansprechpartner statt Hotline-Schleife.' },
  { icon: Wrench, title: 'Moderne Prüftechnik', text: 'Von der Scherenhebebühne bis zur Abgasmessung.' },
  { icon: MapPin, title: 'Mitten in Penzberg', text: 'Gut erreichbar an der Bürgermeister-Rummer-Straße.' },
]

const gallery: { photo: Photo; caption: string; focus?: string }[] = [
  { photo: photos.unterboden, caption: 'Licht ins Dunkel: Kontrolle am Unterboden' },
  { photo: photos.buero, caption: 'Hell & freundlich: unser Büro', focus: '78% 50%' },
  { photo: photos.radkasten, caption: 'Radkasten & Reifen im Blick' },
  { photo: photos.hebebuehne, caption: 'Unter der Scherenhebebühne' },
  { photo: photos.felge, caption: 'Bremse & Felge – genau hingeschaut' },
  { photo: photos.nervennahrung, caption: 'Nervennahrung für die Wartezeit' },
]

const dialog = ref<HTMLDialogElement | null>(null)
const current = ref(0)

function openAt(i: number) {
  current.value = i
  dialog.value?.showModal()
}

const step = (d: number) => (current.value = (current.value + d + gallery.length) % gallery.length)
</script>

<template>
  <section id="station" class="section station">
    <div class="container">
      <div class="station__intro">
        <div v-reveal class="station__photo">
          <img
            :src="photos.weste.src"
            :srcset="photos.weste.srcset"
            sizes="(min-width: 960px) 560px, 92vw"
            :width="photos.weste.width"
            :height="photos.weste.height"
            :alt="photos.weste.alt"
            loading="lazy"
          />
          <div class="station__name">
            <span class="station__initials" aria-hidden="true">RA</span>
            <div>
              <strong>{{ site.owner }}</strong>
              <span>{{ site.name }}</span>
            </div>
          </div>
        </div>

        <div class="station__copy">
          <p v-reveal class="eyebrow">Die Station</p>
          <h2 v-reveal="80" class="section-title">Ihr Prüfer um die Ecke.</h2>
          <p v-reveal="160" class="section-lead">
            Hinter der {{ site.station }} steht das {{ site.name }} von {{ site.owner }}. Sie bekommen die Qualität
            und Unabhängigkeit von TÜV NORD – kombiniert mit kurzen Wegen, festen Ansprechpartnern und ehrlicher
            Beratung.
          </p>
          <p v-reveal="200" class="section-lead">
            Während Ihr Fahrzeug auf der Bühne ist, nehmen Sie gerne Platz. Und wenn etwas nicht passt, sagen wir
            Ihnen klar, was zu tun ist – ohne erhobenen Zeigefinger.
          </p>
          <ul class="station__values">
            <li v-for="(v, i) in values" :key="v.title" v-reveal="i * 70">
              <component :is="v.icon" aria-hidden="true" />
              <div>
                <strong>{{ v.title }}</strong>
                <span>{{ v.text }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="station__gallery-head">
        <h3 v-reveal>Einblicke</h3>
        <a v-reveal="80" class="station__insta" :href="site.instagram.url" target="_blank" rel="noopener">
          <InstagramIcon />
          <span>{{ site.instagram.handle }}</span>
        </a>
      </div>

      <ul class="gallery">
        <li v-for="(g, i) in gallery" :key="g.caption" v-reveal="(i % 3) * 80">
          <button type="button" class="gallery__item" :aria-label="`Bild vergrößern: ${g.caption}`" @click="openAt(i)">
            <img
              :src="g.photo.src"
              :srcset="g.photo.srcset"
              sizes="(min-width: 960px) 380px, 46vw"
              :width="g.photo.width"
              :height="g.photo.height"
              :alt="g.photo.alt"
              :style="g.focus ? { objectPosition: g.focus } : undefined"
              loading="lazy"
            />
            <span class="gallery__caption">{{ g.caption }}</span>
          </button>
        </li>
      </ul>
    </div>

    <dialog ref="dialog" class="lightbox" @click.self="dialog?.close()" @keydown.left="step(-1)" @keydown.right="step(1)">
      <figure>
        <img
          :src="gallery[current]?.photo.src"
          :srcset="gallery[current]?.photo.srcset"
          sizes="90vw"
          :alt="gallery[current]?.photo.alt"
        />
        <figcaption>{{ gallery[current]?.caption }}</figcaption>
      </figure>
      <button type="button" class="lightbox__btn lightbox__close" aria-label="Schließen" @click="dialog?.close()">
        <X aria-hidden="true" />
      </button>
      <button type="button" class="lightbox__btn lightbox__prev" aria-label="Vorheriges Bild" @click="step(-1)">
        <ChevronLeft aria-hidden="true" />
      </button>
      <button type="button" class="lightbox__btn lightbox__next" aria-label="Nächstes Bild" @click="step(1)">
        <ChevronRight aria-hidden="true" />
      </button>
    </dialog>
  </section>
</template>

<style scoped>
.station {
  background: var(--paper);
}

.station__intro {
  display: grid;
  gap: 48px;
  align-items: center;
}

.station__photo {
  position: relative;
}

.station__photo img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  object-position: 50% 30%;
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg);
}

.station__name {
  position: absolute;
  right: 16px;
  bottom: -22px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px 10px 10px;
  border-radius: 999px;
  background: var(--white);
  box-shadow: var(--shadow);
}

.station__initials {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--ink-900);
  color: var(--light);
  font-family: var(--font-display);
  font-weight: 700;
}

.station__name strong {
  display: block;
  font-family: var(--font-display);
  line-height: 1.2;
}

.station__name span {
  font-size: 0.82rem;
  color: var(--muted);
}

.station__copy .section-lead + .section-lead {
  margin-top: 14px;
}

.station__values {
  list-style: none;
  margin: 32px 0 0;
  padding: 0;
  display: grid;
  gap: 18px;
}

.station__values li {
  display: flex;
  gap: 14px;
}

.station__values svg {
  width: 40px;
  height: 40px;
  flex: none;
  padding: 9px;
  border-radius: 12px;
  background: var(--blue-soft);
  color: var(--blue);
}

.station__values strong {
  display: block;
  font-family: var(--font-display);
}

.station__values span {
  font-size: 0.94rem;
  color: var(--muted);
}

.station__gallery-head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  margin: clamp(72px, 10vw, 120px) 0 24px;
}

.station__gallery-head h3 {
  font-size: clamp(1.6rem, 3.6vw, 2.4rem);
}

.station__insta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--white);
  box-shadow: var(--shadow-sm);
  font-weight: 500;
  font-size: 0.92rem;
  text-decoration: none;
  transition: transform 0.25s var(--ease-out);
}

.station__insta:hover {
  transform: translateY(-2px);
}

.station__insta svg {
  width: 18px;
  height: 18px;
  color: #d62976;
}

.gallery {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.gallery__item {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: var(--r);
  overflow: hidden;
  background: var(--ink-800);
  cursor: zoom-in;
}

.gallery__item img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  transition: transform 0.8s var(--ease-out);
}

.gallery__item:hover img {
  transform: scale(1.05);
}

.gallery__caption {
  position: absolute;
  inset: auto 0 0;
  padding: 40px 14px 12px;
  background: linear-gradient(transparent, rgba(5, 10, 23, 0.82));
  color: #fff;
  font-size: 0.86rem;
  font-weight: 500;
  text-align: left;
}

/* Lightbox */
.lightbox {
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgba(3, 6, 15, 0.94);
  color: #fff;
}

.lightbox[open] {
  display: grid;
  place-items: center;
  animation: fade 0.3s ease;
}

.lightbox::backdrop {
  background: transparent;
}

.lightbox figure {
  margin: 0;
  display: grid;
  gap: 12px;
  justify-items: center;
  pointer-events: none;
}

.lightbox img {
  max-width: 92vw;
  max-height: 80dvh;
  width: auto;
  height: auto;
  border-radius: var(--r-sm);
}

.lightbox figcaption {
  color: var(--muted-on-dark);
}

.lightbox__btn {
  position: absolute;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
}

.lightbox__btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox__close {
  top: 16px;
  right: 16px;
}

.lightbox__prev {
  left: 12px;
  top: 50%;
}

.lightbox__next {
  right: 12px;
  top: 50%;
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

@media (min-width: 720px) {
  .gallery {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .station__values {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 960px) {
  .station__photo img {
    aspect-ratio: 4 / 5;
  }

  .station__intro {
    grid-template-columns: 1.05fr 1fr;
    gap: 72px;
  }
}
</style>
