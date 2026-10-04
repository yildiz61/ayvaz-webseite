import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { openingHours, type OpeningDay, type Weekday } from '@/config/site'

export type OpeningState = 'open' | 'break' | 'closed'

export interface OpeningStatus {
  state: OpeningState
  label: string
  detail: string
  today: Weekday
}

const WEEKDAYS: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

const toMinutes = (hhmm: string) => {
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Aktuelle Uhrzeit in Penzberg – unabhängig von der Zeitzone des Besuchers. */
function nowInBerlin(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return {
    day: WEEKDAYS[get('weekday')] ?? 1,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

const dayFor = (d: Weekday): OpeningDay | undefined => openingHours.find((o) => o.day === d)

function nextOpening(fromDay: Weekday): { offset: number; day: OpeningDay } | undefined {
  for (let offset = 1; offset <= 7; offset++) {
    const day = dayFor(((fromDay + offset) % 7) as Weekday)
    if (day?.slots.length) return { offset, day }
  }
  return undefined
}

export function computeStatus(date = new Date()): OpeningStatus {
  const { day, minutes } = nowInBerlin(date)
  const today = dayFor(day)
  const slots = today?.slots ?? []

  const current = slots.find((s) => minutes >= toMinutes(s.from) && minutes < toMinutes(s.to))
  if (current) {
    return { state: 'open', label: 'Jetzt geöffnet', detail: `bis ${current.to} Uhr`, today: day }
  }

  const later = slots.find((s) => minutes < toMinutes(s.from))
  if (later) {
    const isBreak = slots.some((s) => minutes >= toMinutes(s.to))
    return {
      state: isBreak ? 'break' : 'closed',
      label: isBreak ? 'Mittagspause' : 'Noch geschlossen',
      detail: `${isBreak ? 'wieder ab' : 'öffnet um'} ${later.from} Uhr`,
      today: day,
    }
  }

  const next = nextOpening(day)
  const when = next ? (next.offset === 1 ? 'morgen' : next.day.short) : ''
  return {
    state: 'closed',
    label: 'Geschlossen',
    detail: next ? `öffnet ${when} um ${next.day.slots[0]?.from}` : '',
    today: day,
  }
}

/** Reaktiver Öffnungsstatus, aktualisiert sich alle 30 Sekunden. */
export function useOpeningStatus() {
  const now = ref(new Date())
  let timer: number | undefined

  onMounted(() => {
    timer = window.setInterval(() => (now.value = new Date()), 30_000)
  })
  onBeforeUnmount(() => window.clearInterval(timer))

  return computed(() => computeStatus(now.value))
}
