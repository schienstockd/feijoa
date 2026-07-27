// HMM behaviour states — Cecelia fits a Gaussian HMM on track measurements (speed, angle)
// and classifies each timepoint into a hidden state. Standard states are arrested, directed,
// meandering; each frame gets a state label, added as a categorical obs column on the tracks
// h5ad (see app/src/tasks/behaviour/hmm_states.jl). Sketch shows three cells alongside a
// depiction of each state's motion — stationary vs straight-line vs wandering.
import type { SketchDefinition } from '../lib/types'

export const hmm: SketchDefinition = {
  id: 'hmm',
  title: 'HMM behaviour states',
  width: 720,
  height: 340,
  durationSec: 4.4,
  acts: [

    // ── Arrested — cell + dashed ring (no motion)
    { type: 'ellipse', at: [130, 180], size: [90, 70], stroke: 'blue', strokeWidth: 1.5, fill: 'soft2', delayMs: 700, drawMs: 500 },
    { type: 'cell',   at: [130, 180], r: 22, colour: 'blue', delayMs: 1000, drawMs: 500 },
    { type: 'text',   at: [95, 250], value: 'arrested', size: 14, weight: 600, colour: 'blue', delayMs: 1500, drawMs: 400 },
    { type: 'text',   at: [85, 268], value: 'stays put', size: 11, colour: 'textDim', delayMs: 1600, drawMs: 400 },

    // ── Directed — start cell + arrow + faded end cell
    { type: 'cell',   at: [305, 180], r: 22, colour: 'orange', delayMs: 1200, drawMs: 500 },
    { type: 'arrow',  from: [335, 180], to: [415, 180], colour: 'orange', delayMs: 1700, drawMs: 500 },
    { type: 'circle', at: [420, 180], r: 18, stroke: 'orange', strokeWidth: 1.5, delayMs: 2000, drawMs: 400 },
    { type: 'text',   at: [312, 250], value: 'directed', size: 14, weight: 600, colour: 'orange', delayMs: 2200, drawMs: 400 },
    { type: 'text',   at: [304, 268], value: 'straight line', size: 11, colour: 'textDim', delayMs: 2300, drawMs: 400 },

    // ── Meandering — cell + wavy trail + faded end cell
    { type: 'cell',   at: [530, 180], r: 22, colour: 'yellow', delayMs: 1400, drawMs: 500 },
    { type: 'path',   d: 'M 555 180 Q 585 145 605 180 T 655 180 T 685 175', stroke: 'yellow', strokeWidth: 3, delayMs: 1900, drawMs: 800 },
    { type: 'circle', at: [685, 175], r: 18, stroke: 'yellow', strokeWidth: 1.5, delayMs: 2600, drawMs: 400 },
    { type: 'text',   at: [532, 250], value: 'meandering', size: 14, weight: 600, colour: 'yellow', delayMs: 2800, drawMs: 400 },
    { type: 'text',   at: [530, 268], value: 'wanders around', size: 11, colour: 'textDim', delayMs: 2900, drawMs: 400 },
  ],
}
