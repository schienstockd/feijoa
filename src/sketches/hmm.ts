// HMM behaviour states — Cecelia fits a Gaussian HMM on track measurements (speed, angle) and
// classifies each timepoint into a hidden state. Standard states are arrested, directed,
// meandering; each frame gets a state label. See app/src/tasks/behaviour/hmm_states.jl.
//
// Sketch: three immune cells side by side, each with a state-specific motion visualization:
//   arrested   — no motion, a tight dashed ring around the cell
//   directed   — a straight arrow pointing to a future faded outline
//   meandering — a wavy multi-turn track ending in a faded outline
import type { SketchDefinition } from '../lib/types'
import { immuneCell, STROKE, SCHEME } from './primitives'

const Y = 180  // shared centre line

const P_ARR: [number, number] = [130, Y]
const P_DIR: [number, number] = [340, Y]
const P_MEA: [number, number] = [560, Y]

export const hmm: SketchDefinition = {
  id: 'hmm',
  title: 'HMM behaviour states',
  width: 720,
  height: 360,
  durationSec: 4.0,
  acts: [
    // ── Arrested — sessile/scanning morphology (star, no leading edge) + a dashed ring that
    // hints at "no net displacement"
    ...immuneCell(P_ARR[0], P_ARR[1], { slot: 'cell1', scale: 0.85, morphology: 'scanning', cellDelayMs: 500, cellDrawMs: 350, nucDelayMs: 700, nucDrawMs: 220 }),
    // Dashed ring (stroke-dasharray applied via SVG line — but our renderer doesn't support
    // dasharray on rects/ellipses directly. Approximate with a thin outline circle instead.)
    { type: 'circle', at: P_ARR, r: 42, stroke: SCHEME.cell1.nuc, strokeWidth: STROKE.thin, delayMs: 900, drawMs: 500 },
    { type: 'text', at: [P_ARR[0] - 40, 275], value: 'arrested',  size: 14, weight: 700, colour: SCHEME.cell1.nuc, delayMs: 1300, drawMs: 300 },
    { type: 'text', at: [P_ARR[0] - 44, 295], value: 'stays put', size: 11, colour: 'textDim', delayMs: 1400, drawMs: 300 },

    // ── Directed — cell + straight arrow + faded end outline
    ...immuneCell(P_DIR[0], P_DIR[1], { slot: 'cell2', scale: 0.85, flip: true, cellDelayMs: 700, cellDrawMs: 350, nucDelayMs: 900, nucDrawMs: 220 }),
    { type: 'arrow', from: [P_DIR[0] + 35, Y], to: [P_DIR[0] + 130, Y], colour: SCHEME.cell2.track, strokeWidth: STROKE.track, delayMs: 1200, drawMs: 500 },
    { type: 'circle', at: [P_DIR[0] + 135, Y], r: 22, stroke: SCHEME.cell2.nuc, strokeWidth: STROKE.thin, delayMs: 1600, drawMs: 300 },
    { type: 'text', at: [P_DIR[0] - 40, 275], value: 'directed',     size: 14, weight: 700, colour: SCHEME.cell2.nuc, delayMs: 1900, drawMs: 300 },
    { type: 'text', at: [P_DIR[0] - 48, 295], value: 'straight line', size: 11, colour: 'textDim', delayMs: 2000, drawMs: 300 },

    // ── Meandering — cell + wavy multi-turn trail + faded end outline
    ...immuneCell(P_MEA[0], P_MEA[1], { slot: 'cell3', scale: 0.85, flip: true, cellDelayMs: 900, cellDrawMs: 350, nucDelayMs: 1100, nucDrawMs: 220 }),
    { type: 'path', d: 'M 595 180 Q 615 145 640 170 Q 665 195 660 165 Q 655 135 685 155',
      stroke: SCHEME.cell3.track, strokeWidth: STROKE.track, delayMs: 1500, drawMs: 900 },
    { type: 'circle', at: [685, 155], r: 20, stroke: SCHEME.cell3.nuc, strokeWidth: STROKE.thin, delayMs: 2400, drawMs: 300 },
    { type: 'text', at: [P_MEA[0] - 48, 275], value: 'meandering', size: 14, weight: 700, colour: SCHEME.cell3.nuc, delayMs: 2700, drawMs: 300 },
    { type: 'text', at: [P_MEA[0] - 44, 295], value: 'wanders',    size: 11, colour: 'textDim', delayMs: 2800, drawMs: 300 },
  ],
}
