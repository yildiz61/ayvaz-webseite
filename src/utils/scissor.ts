export interface ScissorOptions {
  /** horizontale Mitte */
  cx: number
  /** Oberkante der Grundplatte (hier setzen die Scheren an) */
  baseY: number
  /** Länge eines Scherenarms */
  armLength: number
  stages: number
  /** Scherenhöhe eingefahren / ausgefahren */
  minHeight: number
  maxHeight: number
}

export interface ScissorArm {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface ScissorGeometry {
  arms: ScissorArm[]
  pivots: { x: number; y: number }[]
  /** y-Koordinate, an der die Plattform aufliegt */
  topY: number
  left: number
  right: number
}

/** Geometrie einer (mehrstufigen) Scherenhebebühne für einen Hub 0–1. */
export function scissorGeometry(lift: number, o: ScissorOptions): ScissorGeometry {
  const t = Math.min(1, Math.max(0, lift))
  const height = o.minHeight + (o.maxHeight - o.minHeight) * t
  const stage = height / o.stages
  const width = Math.sqrt(Math.max(0, o.armLength ** 2 - stage ** 2))
  const left = o.cx - width / 2
  const right = o.cx + width / 2

  const arms: ScissorArm[] = []
  const pivots: { x: number; y: number }[] = []
  for (let k = 0; k < o.stages; k++) {
    const bottom = o.baseY - k * stage
    const top = bottom - stage
    arms.push({ x1: left, y1: bottom, x2: right, y2: top })
    arms.push({ x1: left, y1: top, x2: right, y2: bottom })
    pivots.push({ x: o.cx, y: bottom - stage / 2 })
  }
  return { arms, pivots, topY: o.baseY - height, left, right }
}

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
/** Bildet einen Teilbereich [from, to] des Fortschritts auf 0–1 ab. */
export const segment = (p: number, from: number, to: number) => clamp01((p - from) / (to - from))
