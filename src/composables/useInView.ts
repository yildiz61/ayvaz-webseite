import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Wird einmalig true, sobald das Element in den Viewport kommt. */
export function useInView(target: Ref<HTMLElement | null>, threshold = 0.35) {
  const inView = ref(false)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    if (!target.value) return
    if (!('IntersectionObserver' in window)) {
      inView.value = true
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          inView.value = true
          observer?.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(target.value)
  })
  onBeforeUnmount(() => observer?.disconnect())

  return inView
}
