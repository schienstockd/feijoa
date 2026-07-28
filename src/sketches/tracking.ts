// Cell tracking — btrack links segmentation labels across frames into tracks. Each cell has a
// track_id and an (x, y[, z], t) at every timepoint; the visual is a polyline through the
// cell's positions. See docs/TRACKING.md.
//
// Sketch: one immune cell shown at five time points across the frame, with the migration path
// connecting them. Track segments are drawn UNDER the cells (DOM order) so each cell body
// covers its portion of the line — reads as "cell arriving at each frame."
import type { SketchDefinition } from '../lib/types'
import { immuneCell, STROKE, SCHEME } from './primitives'

// Five frame positions (t1..t5), roughly centred vertically with a natural wobble.
const P: [number, number][] = [
  [110, 210],
  [235, 180],
  [370, 210],
  [500, 175],
  [615, 195],
]

const CELL_SCALE = 0.7

export const tracking: SketchDefinition = {
  id: 'tracking',
  title: 'Cell tracking',
  width: 720,
  height: 360,
  durationSec: 3.6,
  acts: [
    // Track segments FIRST (drawn under the cells). Each segment reveals between the two
    // frames it joins. Slot 'cell1' (cyan) — this is a single cell tracked.
    { type: 'line', from: P[0], to: P[1], colour: SCHEME.cell1.track, strokeWidth: STROKE.track, delayMs: 700,  drawMs: 300 },
    { type: 'line', from: P[1], to: P[2], colour: SCHEME.cell1.track, strokeWidth: STROKE.track, delayMs: 1300, drawMs: 300 },
    { type: 'line', from: P[2], to: P[3], colour: SCHEME.cell1.track, strokeWidth: STROKE.track, delayMs: 1900, drawMs: 300 },
    { type: 'line', from: P[3], to: P[4], colour: SCHEME.cell1.track, strokeWidth: STROKE.track, delayMs: 2500, drawMs: 300 },

    // Cells at each timepoint — 400ms apart to feel like frames advancing. Leading edge alt-
    // ernates left/right slightly (frame-to-frame position dictates apparent direction).
    ...immuneCell(P[0][0], P[0][1], { slot: 'cell1', scale: CELL_SCALE, flip: true,  cellDelayMs: 400,  cellDrawMs: 300, nucDelayMs: 550,  nucDrawMs: 200 }),
    ...immuneCell(P[1][0], P[1][1], { slot: 'cell1', scale: CELL_SCALE, flip: true,  cellDelayMs: 1000, cellDrawMs: 300, nucDelayMs: 1150, nucDrawMs: 200 }),
    ...immuneCell(P[2][0], P[2][1], { slot: 'cell1', scale: CELL_SCALE, flip: true,  cellDelayMs: 1600, cellDrawMs: 300, nucDelayMs: 1750, nucDrawMs: 200 }),
    ...immuneCell(P[3][0], P[3][1], { slot: 'cell1', scale: CELL_SCALE, flip: true,  cellDelayMs: 2200, cellDrawMs: 300, nucDelayMs: 2350, nucDrawMs: 200 }),
    ...immuneCell(P[4][0], P[4][1], { slot: 'cell1', scale: CELL_SCALE, flip: true,  cellDelayMs: 2800, cellDrawMs: 300, nucDelayMs: 2950, nucDrawMs: 200 }),

    // Frame index below the last cell.
    { type: 'text', at: [P[0][0] - 10, 280], value: 't₁', size: 14, weight: 600, colour: 'textDim', delayMs: 700,  drawMs: 200 },
    { type: 'text', at: [P[1][0] - 10, 280], value: 't₂', size: 14, weight: 600, colour: 'textDim', delayMs: 1300, drawMs: 200 },
    { type: 'text', at: [P[2][0] - 10, 280], value: 't₃', size: 14, weight: 600, colour: 'textDim', delayMs: 1900, drawMs: 200 },
    { type: 'text', at: [P[3][0] - 10, 280], value: 't₄', size: 14, weight: 600, colour: 'textDim', delayMs: 2500, drawMs: 200 },
    { type: 'text', at: [P[4][0] - 10, 280], value: 't₅', size: 14, weight: 600, colour: 'textDim', delayMs: 3100, drawMs: 200 },
  ],
}
