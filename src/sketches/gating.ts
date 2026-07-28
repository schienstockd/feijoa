// Cecelia's gating plot is a 2D scatter of cells across two markers. The user draws a polygon
// (or ellipse) gate to define a named population; cells inside get promoted to the child pop.
// Mirrors the layout of `SquarePlot.vue` + `GatePlotPanel.vue` in the frontend.
//
// Sketch: dense flow-cytometry-style scatter with hundreds of small dots forming two clouds —
// a diffuse background cloud and a tighter target cloud. A pink polygon gate is drawn around
// the target; the gated cells then re-colour (magenta rings) to signal "promoted"; an arrow
// exports them to a named population chip on the right.
import type { SketchDefinition, SketchAct } from '../lib/types'
import { SCHEME, STROKE } from './primitives'

// Plot area — dots must stay INSIDE these bounds (axis lines are at x0/y0)
const AX = { x0: 90, x1: 410, y0: 320, y1: 55 }
const MARGIN = 8   // keep dots this many px away from the axis lines
const IN_X0 = AX.x0 + MARGIN, IN_X1 = AX.x1 - MARGIN
const IN_Y1 = AX.y1 + MARGIN, IN_Y0 = AX.y0 - MARGIN

// A tiny reproducible pseudo-random so the point clouds look natural but don't move between
// renders. Simple 32-bit xorshift-ish.
function makeRng(seed: number) {
  let s = seed | 0
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5
    return ((s >>> 0) % 10000) / 10000
  }
}

// Gaussian around (mx, my) with std (sx, sy). Box-Muller. Rejects points that fall outside
// the plot area — keeps sampling until we get `n` points inside.
function gaussCloud(mx: number, my: number, sx: number, sy: number, n: number, seed: number): Array<[number, number]> {
  const rng = makeRng(seed)
  const pts: Array<[number, number]> = []
  let guard = 0
  while (pts.length < n && guard++ < n * 20) {
    const u1 = Math.max(rng(), 1e-6), u2 = rng()
    const r = Math.sqrt(-2 * Math.log(u1))
    const z1 = r * Math.cos(2 * Math.PI * u2)
    const z2 = r * Math.sin(2 * Math.PI * u2)
    const x = mx + z1 * sx, y = my + z2 * sy
    if (x >= IN_X0 && x <= IN_X1 && y >= IN_Y1 && y <= IN_Y0) pts.push([x, y])
  }
  return pts
}

// Two clouds: a large diffuse background (unpromoted cells) and a tighter target cluster.
const BG = gaussCloud(230, 250, 60, 40, 140, 1337)
const TGT = gaussCloud(275, 160, 22, 22, 55, 4242)

// Which target points are INSIDE the polygon gate — pre-computed so we can highlight them
const GATE_POLY: Array<[number, number]> = [
  [230, 200], [225, 130], [275, 105], [335, 128], [335, 200], [285, 215],
]
function pointInPoly(p: [number, number], poly: Array<[number, number]>): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    const intersect = yi > p[1] !== yj > p[1] &&
      p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi + 1e-9) + xi
    if (intersect) inside = !inside
  }
  return inside
}
const IN_GATE = TGT.filter(p => pointInPoly(p, GATE_POLY))

const DOT_R = 2.2
function dot(p: [number, number], colour: string, delayMs: number, r = DOT_R): SketchAct {
  return {
    type: 'circle', at: p, r,
    fill: colour, fillStyle: 'solid',
    delayMs, drawMs: 100,
  }
}

const GATE_D = 'M ' + GATE_POLY.map(p => `${p[0]} ${p[1]}`).join(' L ') + ' Z'

export const gating: SketchDefinition = {
  id: 'gating',
  title: 'Gating a population',
  width: 720,
  height: 360,
  durationSec: 4.4,
  acts: [
    // Axes
    { type: 'line', from: [AX.x0, AX.y0], to: [AX.x1, AX.y0], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 300, drawMs: 400 },
    { type: 'line', from: [AX.x0, AX.y0], to: [AX.x0, AX.y1], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 300, drawMs: 400 },
    { type: 'text', at: [(AX.x0 + AX.x1) / 2 - 30, AX.y0 + 26], value: 'marker A', size: 12, colour: 'textDim', delayMs: 800, drawMs: 300 },
    { type: 'text', at: [AX.x0 - 22, (AX.y0 + AX.y1) / 2 + 30], value: 'marker B', size: 12, colour: 'textDim', rotate: -90, delayMs: 800, drawMs: 300 },

    // Background scatter — grey filled dots, dense; clipped to plot area
    ...BG.map((p, i): SketchAct => dot(p, '#3a3a35', 900 + i * 6)),
    // Target scatter — grey initially (they get promoted after the gate)
    ...TGT.map((p, i): SketchAct => dot(p, '#3a3a35', 1800 + i * 8)),

    // Polygon gate — pink accent
    { type: 'path', d: GATE_D, stroke: 'accent', strokeWidth: STROKE.cell, delayMs: 2400, drawMs: 900 },

    // Gated cells RE-COLOURED — magenta dots pop over each in-gate point
    ...IN_GATE.map((p, i): SketchAct => dot(p, SCHEME.cell3.solid, 3400 + i * 12, DOT_R + 0.5)),

    // Arrow → population chip on the right (solid magenta chip, white label)
    { type: 'arrow', from: [430, 175], to: [490, 175], colour: 'accent', strokeWidth: 3, delayMs: 3900, drawMs: 350 },
    { type: 'rect', at: [495, 148], size: [130, 56], fill: SCHEME.cell3.solid, fillStyle: 'solid', stroke: SCHEME.cell3.solid, strokeWidth: 2.5, delayMs: 4200, drawMs: 350 },
    { type: 'text', at: [515, 182], value: 'pop A', size: 16, weight: 700, colour: '#ffffff', delayMs: 4400, drawMs: 250 },
  ],
}
