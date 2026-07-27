// HMM behaviour states — placeholder.
// Aim: draw three cells moving in three ways (arrested / directed / meandering)
// with a state bar underneath colouring the frames.
import type { SketchDefinition } from '../lib/types'

export const hmm: SketchDefinition = {
  id: 'hmm',
  title: 'HMM behaviour states',
  width: 720,
  height: 300,
  durationSec: 4,
  acts: [
    { type: 'text',   at: [30, 40],   value: 'HMM behaviour states', size: 22, weight: 700, delayMs: 0,    drawMs: 400 },
    { type: 'text',   at: [30, 65],   value: 'three cells, three ways of moving', size: 13, colour: 'textDim', delayMs: 300, drawMs: 400 },

    // Arrested
    { type: 'cell',   at: [130, 160], r: 22, colour: 'blue',   delayMs: 800,  drawMs: 500 },
    { type: 'text',   at: [90, 220],  value: 'arrested', size: 14, colour: 'textDim', delayMs: 1400, drawMs: 400 },

    // Directed
    { type: 'cell',   at: [340, 160], r: 22, colour: 'orange', delayMs: 900,  drawMs: 500 },
    { type: 'arrow',  from: [370, 160], to: [430, 160], colour: 'orange',      delayMs: 1500, drawMs: 500 },
    { type: 'text',   at: [305, 220], value: 'directed', size: 14, colour: 'textDim', delayMs: 1600, drawMs: 400 },

    // Meandering
    { type: 'cell',   at: [560, 160], r: 22, colour: 'yellow', delayMs: 1000, drawMs: 500 },
    { type: 'path',   d: 'M 580 160 Q 610 130 620 165 T 660 170', stroke: 'yellow', strokeWidth: 2, delayMs: 1700, drawMs: 700 },
    { type: 'text',   at: [510, 220], value: 'meandering', size: 14, colour: 'textDim', delayMs: 1800, drawMs: 400 },
  ],
}
