// Gating — placeholder.
// Aim: a scatter of cells, then a polygon gate drawn over them, cells inside
// re-coloured to a different tone.
import type { SketchDefinition } from '../lib/types'

export const gating: SketchDefinition = {
  id: 'gating',
  title: 'Gating a population',
  width: 620,
  height: 340,
  durationSec: 3.6,
  acts: [
    { type: 'text', at: [30, 34], value: 'Gating a population', size: 22, weight: 700, delayMs: 0, drawMs: 400 },
    { type: 'text', at: [30, 58], value: 'draw a polygon; cells inside become the population', size: 13, colour: 'textDim', delayMs: 200, drawMs: 400 },

    // Axes
    { type: 'line', from: [80, 300], to: [560, 300], colour: 'stroke', delayMs: 600, drawMs: 500 },
    { type: 'line', from: [80, 300], to: [80, 90],   colour: 'stroke', delayMs: 600, drawMs: 500 },
    { type: 'text', at: [230, 322], value: 'marker A', size: 12, colour: 'textDim', delayMs: 1100, drawMs: 300 },
    { type: 'text', at: [40, 190],  value: 'marker B', size: 12, colour: 'textDim', delayMs: 1100, drawMs: 300 },

    // Scatter of cells (small circles — not the full cell primitive)
    { type: 'circle', at: [190, 240], r: 5, fill: 'textDim', stroke: 'stroke', delayMs: 1200, drawMs: 200 },
    { type: 'circle', at: [230, 210], r: 5, fill: 'textDim', stroke: 'stroke', delayMs: 1250, drawMs: 200 },
    { type: 'circle', at: [220, 260], r: 5, fill: 'textDim', stroke: 'stroke', delayMs: 1300, drawMs: 200 },
    { type: 'circle', at: [280, 190], r: 5, fill: 'textDim', stroke: 'stroke', delayMs: 1350, drawMs: 200 },
    { type: 'circle', at: [330, 170], r: 5, fill: 'textDim', stroke: 'stroke', delayMs: 1400, drawMs: 200 },
    { type: 'circle', at: [360, 200], r: 5, fill: 'textDim', stroke: 'stroke', delayMs: 1450, drawMs: 200 },
    { type: 'circle', at: [400, 160], r: 5, fill: 'textDim', stroke: 'stroke', delayMs: 1500, drawMs: 200 },
    { type: 'circle', at: [420, 220], r: 5, fill: 'textDim', stroke: 'stroke', delayMs: 1550, drawMs: 200 },
    { type: 'circle', at: [480, 240], r: 5, fill: 'textDim', stroke: 'stroke', delayMs: 1600, drawMs: 200 },
    { type: 'circle', at: [510, 200], r: 5, fill: 'textDim', stroke: 'stroke', delayMs: 1650, drawMs: 200 },

    // The polygon gate around the upper-right cluster
    { type: 'path', d: 'M 300 160 L 430 145 L 445 220 L 335 235 Z', stroke: 'accent', strokeWidth: 3, delayMs: 2000, drawMs: 900 },

    // Re-colour the cells inside — draw pink outlines over them
    { type: 'circle', at: [330, 170], r: 6, stroke: 'accent', strokeWidth: 2, delayMs: 3000, drawMs: 250 },
    { type: 'circle', at: [360, 200], r: 6, stroke: 'accent', strokeWidth: 2, delayMs: 3050, drawMs: 250 },
    { type: 'circle', at: [400, 160], r: 6, stroke: 'accent', strokeWidth: 2, delayMs: 3100, drawMs: 250 },
    { type: 'circle', at: [420, 220], r: 6, stroke: 'accent', strokeWidth: 2, delayMs: 3150, drawMs: 250 },
  ],
}
