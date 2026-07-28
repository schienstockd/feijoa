// Population hierarchy — Cecelia's gating produces a TREE of populations. A gate on the root
// yields a child pop; a gate applied to that child yields a grandchild; and so on. Populations
// are addressed by "/-separated" paths (root/live/CD4/effector).
//
// Sketch: nested rounded rectangles (root → CD4+ → effector), each stepped in slightly like a
// file-tree UI, with the "/"-separated address readout below in monospace.
import type { SketchDefinition } from '../lib/types'
import { SCHEME, STROKE } from './primitives'

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

// Nested-rect geometry — each level indents from the previous
const R_X = 90,  R_Y = 55,  R_W = 540, R_H = 200   // root
const C_X = 120, C_Y = 90,  C_W = 480, C_H = 155   // CD4+
const E_X = 160, E_Y = 130, E_W = 400, E_H = 100   // effector

export const hierarchy: SketchDefinition = {
  id: 'hierarchy',
  title: 'Population hierarchy',
  width: 720,
  height: 360,
  durationSec: 3.6,
  acts: [
    // Root — a soft neutral wash with textDim stroke
    { type: 'rect', at: [R_X, R_Y], size: [R_W, R_H], fill: '#f0efe9', fillStyle: 'solid', stroke: 'textDim', strokeWidth: STROKE.cell, delayMs: 300, drawMs: 500 },
    { type: 'text', at: [R_X + 12, R_Y + 22], value: 'root · all cells', size: 12, weight: 600, colour: 'textDim', delayMs: 850, drawMs: 300 },

    // CD4+ — cyan (cell1)
    { type: 'rect', at: [C_X, C_Y], size: [C_W, C_H], fill: SCHEME.cell1.soft, fillStyle: 'solid', stroke: SCHEME.cell1.solid, strokeWidth: STROKE.cell, delayMs: 1200, drawMs: 500 },
    { type: 'text', at: [C_X + 12, C_Y + 22], value: 'CD4+', size: 13, weight: 700, colour: SCHEME.cell1.nuc, delayMs: 1750, drawMs: 300 },

    // Effector — magenta (cell3)
    { type: 'rect', at: [E_X, E_Y], size: [E_W, E_H], fill: SCHEME.cell3.soft, fillStyle: 'solid', stroke: SCHEME.cell3.solid, strokeWidth: STROKE.cell, delayMs: 2100, drawMs: 500 },
    { type: 'text', at: [E_X + 12, E_Y + 22], value: 'effector', size: 13, weight: 700, colour: SCHEME.cell3.nuc, delayMs: 2650, drawMs: 300 },

    // Address readout below — monospace breadcrumb, colour-coded per level
    { type: 'text', at: [200, 305], value: 'root',     size: 16, weight: 700, family: MONO, colour: 'textDim',        delayMs: 2900, drawMs: 250 },
    { type: 'text', at: [272, 305], value: '/',        size: 16, weight: 700, family: MONO, colour: 'stroke',         delayMs: 2900, drawMs: 250 },
    { type: 'text', at: [284, 305], value: 'CD4+',     size: 16, weight: 700, family: MONO, colour: SCHEME.cell1.nuc, delayMs: 3000, drawMs: 250 },
    { type: 'text', at: [356, 305], value: '/',        size: 16, weight: 700, family: MONO, colour: 'stroke',         delayMs: 3000, drawMs: 250 },
    { type: 'text', at: [368, 305], value: 'effector', size: 16, weight: 700, family: MONO, colour: SCHEME.cell3.nuc, delayMs: 3100, drawMs: 250 },
  ],
}
