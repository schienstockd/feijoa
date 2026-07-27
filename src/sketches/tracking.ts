// Cell tracking — btrack links segmentation labels across frames into tracks. Each cell has a
// track_id and an (x, y[, z], t) at every timepoint; the visual is a trailing polyline through
// the cell's positions. See docs/TRACKING.md.
//
// Paint order matters: all track segments go into the acts array FIRST so they sit behind the
// cells; the cells come after so their fill covers their portion of the line. Timing (delayMs)
// still reveals them frame-by-frame, independent of paint order.
import type { SketchDefinition } from '../lib/types'

// Track waypoints — one cell per frame, five frames.
const P: [number, number][] = [
  [110, 180],
  [210, 155],
  [310, 175],
  [420, 140],
  [510, 165],
]

export const tracking: SketchDefinition = {
  id: 'tracking',
  title: 'Cell tracking',
  width: 720,
  height: 360,
  durationSec: 4.1,
  acts: [

    // Track segments FIRST (drawn behind the cells) — timed so each reveals between the two
    // frames it joins.
    { type: 'line', from: P[0], to: P[1], colour: 'blue', delayMs: 1300, drawMs: 350 },
    { type: 'line', from: P[1], to: P[2], colour: 'blue', delayMs: 2000, drawMs: 350 },
    { type: 'line', from: P[2], to: P[3], colour: 'blue', delayMs: 2700, drawMs: 350 },
    { type: 'line', from: P[3], to: P[4], colour: 'blue', delayMs: 3400, drawMs: 350 },

    // Cells AFTER — painted on top so segments read as "arriving into" each cell rather than
    // slicing through it.
    { type: 'cell', at: P[0], r: 20, colour: 'blue', delayMs: 700,  drawMs: 500 },
    { type: 'cell', at: P[1], r: 20, colour: 'blue', delayMs: 1650, drawMs: 350 },
    { type: 'cell', at: P[2], r: 20, colour: 'blue', delayMs: 2350, drawMs: 350 },
    { type: 'cell', at: P[3], r: 20, colour: 'blue', delayMs: 3050, drawMs: 350 },
    { type: 'cell', at: P[4], r: 20, colour: 'blue', delayMs: 3750, drawMs: 350 },
  ],
}
