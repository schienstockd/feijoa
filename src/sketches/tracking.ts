// Cell tracking — placeholder.
// Aim: a cell moves across five frames; the track line is drawn frame-by-frame.
import type { SketchDefinition } from '../lib/types'

export const tracking: SketchDefinition = {
  id: 'tracking',
  title: 'Cell tracking',
  width: 620,
  height: 300,
  durationSec: 3.8,
  acts: [
    { type: 'text', at: [30, 34], value: 'Cell tracking', size: 22, weight: 700, delayMs: 0, drawMs: 400 },
    { type: 'text', at: [30, 58], value: 'one cell across five frames', size: 13, colour: 'textDim', delayMs: 200, drawMs: 400 },

    // The cell appears at frame 1, then the trail is drawn segment by segment
    { type: 'cell', at: [110, 180], r: 20, colour: 'blue', delayMs: 700,  drawMs: 500 },

    { type: 'line', from: [110, 180], to: [210, 155], colour: 'blue', delayMs: 1300, drawMs: 350 },
    { type: 'cell', at: [210, 155], r: 20, colour: 'blue', delayMs: 1650, drawMs: 350 },

    { type: 'line', from: [210, 155], to: [310, 175], colour: 'blue', delayMs: 2000, drawMs: 350 },
    { type: 'cell', at: [310, 175], r: 20, colour: 'blue', delayMs: 2350, drawMs: 350 },

    { type: 'line', from: [310, 175], to: [420, 140], colour: 'blue', delayMs: 2700, drawMs: 350 },
    { type: 'cell', at: [420, 140], r: 20, colour: 'blue', delayMs: 3050, drawMs: 350 },

    { type: 'line', from: [420, 140], to: [510, 165], colour: 'blue', delayMs: 3400, drawMs: 350 },
    { type: 'cell', at: [510, 165], r: 20, colour: 'blue', delayMs: 3750, drawMs: 350 },
  ],
}
