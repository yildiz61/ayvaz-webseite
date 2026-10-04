/** Farben der HU-Plakette – Zyklus von sechs Jahren (2026 = blau, 2027 = gelb, 2028 = braun …). */
const CYCLE = [
  { name: 'blau', color: '#2f6bd8', text: '#fff' },
  { name: 'gelb', color: '#f5c518', text: '#111' },
  { name: 'braun', color: '#8a5a32', text: '#fff' },
  { name: 'rosa', color: '#f3a2c0', text: '#111' },
  { name: 'grün', color: '#3e9b4f', text: '#fff' },
  { name: 'orange', color: '#f08a24', text: '#111' },
] as const

export function plaketteFor(year: number) {
  const idx = (((year - 2026) % 6) + 6) % 6
  return { year, ...CYCLE[idx]! }
}
