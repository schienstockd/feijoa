// Cecelia's gating plot is a SQUARE 2D scatter of cells across two markers/channels; the user
// draws a polygon (or ellipse) gate to define a named population. Cells inside get promoted to
// the child population and get an accent tint here. Mirrors the layout of `SquarePlot.vue` +
// `GatePlotPanel.vue` in the frontend, and the standard biology-journal biaxial plot.
import type { SketchDefinition } from '../lib/types'

const AX = { x0: 78, y0: 350, x1: 358, y1: 70 }   // square plot area 280×280 inside a 400×400 canvas

// The scatter — clustered background (soft grey) + a tighter target cluster the polygon will
// enclose. Points laid out by hand so the aesthetic feels intentional rather than random.
const bg: [number, number][] = [
  [110, 320], [130, 300], [150, 335], [170, 305],
  [200, 285], [220, 315], [155, 260], [180, 250],
  [210, 240], [250, 260], [275, 285], [300, 260],
  [320, 310], [285, 335], [255, 325],
]
const target: [number, number][] = [
  [175, 175], [195, 155], [215, 190], [235, 170],
  [255, 200], [230, 210], [200, 210], [275, 175],
]

export const gating: SketchDefinition = {
  id: 'gating',
  title: 'Gating a population',
  width: 400,
  height: 400,
  durationSec: 4.2,
  acts: [

    // Square axes — X across the bottom, Y up the left. Same aspect the real GatePlot uses.
    { type: 'line', from: [AX.x0, AX.y0], to: [AX.x1, AX.y0], colour: 'stroke', delayMs: 600, drawMs: 500 },
    { type: 'line', from: [AX.x0, AX.y0], to: [AX.x0, AX.y1], colour: 'stroke', delayMs: 600, drawMs: 500 },
    { type: 'text', at: [(AX.x0 + AX.x1) / 2 - 30, AX.y0 + 28], value: 'marker A', size: 12, colour: 'textDim', delayMs: 1100, drawMs: 300 },
    // marker B — rotated 90° so it runs along the Y axis instead of overlapping it.
    { type: 'text', at: [AX.x0 - 22, (AX.y0 + AX.y1) / 2 + 30], value: 'marker B', size: 12, colour: 'textDim', rotate: -90, delayMs: 1100, drawMs: 300 },

    // Background scatter — muted grey, staggered so the eye sees a cloud
    ...bg.map(([x, y], i) => ({
      type: 'circle' as const, at: [x, y] as [number, number], r: 5,
      fill: 'textDim', stroke: 'stroke',
      delayMs: 1200 + i * 45, drawMs: 200,
    })),
    // Target cluster — softer neutral fill; will be promoted to the gated pop below
    ...target.map(([x, y], i) => ({
      type: 'circle' as const, at: [x, y] as [number, number], r: 5,
      fill: 'textDim', stroke: 'stroke',
      delayMs: 1900 + i * 40, drawMs: 200,
    })),

    // The polygon gate around the target cluster — accent pink stroke, drawn in as a stroke path
    { type: 'path', d: 'M 155 195 L 285 145 L 305 205 L 220 235 Z', stroke: 'accent', strokeWidth: 3, delayMs: 2600, drawMs: 900 },

    // Cells INSIDE the gate get re-coloured — accent-tinted rings over each target point
    ...target.map(([x, y], i) => ({
      type: 'circle' as const, at: [x, y] as [number, number], r: 6,
      stroke: 'accent', strokeWidth: 2,
      delayMs: 3600 + i * 45, drawMs: 250,
    })),
  ],
}
