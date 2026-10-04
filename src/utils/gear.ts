export interface GearShape {
  d: string
  /** Teilkreisradius */
  pitchRadius: number
  /** Kopfkreisradius */
  outerRadius: number
}

const pt = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`

function circle(cx: number, cy: number, r: number) {
  return `M${(cx + r).toFixed(2)} ${cy.toFixed(2)}A${r} ${r} 0 1 0 ${(cx - r).toFixed(2)} ${cy.toFixed(2)}A${r} ${r} 0 1 0 ${(cx + r).toFixed(2)} ${cy.toFixed(2)}Z`
}

/**
 * Erzeugt den SVG-Pfad eines Zahnrads (um 0/0 zentriert, Zahn 0 zeigt nach rechts).
 * Mit fill-rule="evenodd" rendern, damit Nabe und Aussparungen ausgestanzt werden.
 */
export function gearShape(teeth: number, module = 10): GearShape {
  const pitchRadius = (module * teeth) / 2
  const outerRadius = pitchRadius + module * 0.9
  const rootRadius = pitchRadius - module * 1.15
  const pitch = (Math.PI * 2) / teeth
  const rootHalf = pitch * 0.27
  const tipHalf = pitch * 0.15

  let d = `M${pt(rootRadius, -rootHalf)}`
  for (let i = 0; i < teeth; i++) {
    const c = i * pitch
    d += `L${pt(outerRadius, c - tipHalf)}`
    d += `A${outerRadius} ${outerRadius} 0 0 1 ${pt(outerRadius, c + tipHalf)}`
    d += `L${pt(rootRadius, c + rootHalf)}`
    d += `A${rootRadius} ${rootRadius} 0 0 1 ${pt(rootRadius, c + pitch - rootHalf)}`
  }
  d += 'Z'

  // Nabe
  d += circle(0, 0, Math.max(pitchRadius * 0.17, module * 1.1))

  // Erleichterungsbohrungen bei größeren Rädern
  const holes = teeth >= 16 ? 6 : teeth >= 11 ? 5 : 0
  for (let i = 0; i < holes; i++) {
    const a = (i / holes) * Math.PI * 2 + Math.PI / holes
    const r = pitchRadius * 0.56
    d += circle(r * Math.cos(a), r * Math.sin(a), pitchRadius * (holes === 6 ? 0.17 : 0.19))
  }

  return { d, pitchRadius, outerRadius }
}

export interface GearSpec {
  teeth: number
  /** Richtung (Grad) vom vorherigen Zahnrad zu diesem. Wird beim ersten ignoriert. */
  angle?: number
  variant?: 'solid' | 'outline' | 'accent'
}

export interface PlacedGear extends GearShape {
  teeth: number
  x: number
  y: number
  /** Startwinkel (Grad), so dass die Zähne sauber ineinandergreifen */
  phase: number
  /** +1 / -1 – Drehrichtung im Getriebe */
  dir: 1 | -1
  variant: 'solid' | 'outline' | 'accent'
}

/** Platziert eine Kette ineinandergreifender Zahnräder. */
export function placeGearTrain(specs: GearSpec[], module = 10): PlacedGear[] {
  const placed: PlacedGear[] = []
  specs.forEach((spec, i) => {
    const shape = gearShape(spec.teeth, module)
    const variant = spec.variant ?? 'solid'
    const prev = placed[i - 1]
    if (!prev) {
      placed.push({ ...shape, teeth: spec.teeth, x: 0, y: 0, phase: 0, dir: 1, variant })
      return
    }
    const phi = spec.angle ?? 0
    const rad = (phi * Math.PI) / 180
    const distance = prev.pitchRadius + shape.pitchRadius + module * 0.12
    const prevPitch = 360 / prev.teeth
    const pitch = 360 / spec.teeth
    const tPrev = ((((phi - prev.phase) / prevPitch) % 1) + 1) % 1
    const phase = phi + 180 - pitch * (0.5 - tPrev)
    placed.push({
      ...shape,
      teeth: spec.teeth,
      x: prev.x + distance * Math.cos(rad),
      y: prev.y + distance * Math.sin(rad),
      phase,
      dir: prev.dir === 1 ? -1 : 1,
      variant,
    })
  })
  return placed
}
