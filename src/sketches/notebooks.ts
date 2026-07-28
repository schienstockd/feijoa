// Notebooks Playground — a per-project Pluto notebook for pure-Julia downstream analysis.
// Cells alternate code (light bg) with output (plot). See docs/NOTEBOOKS.md.
//
// Sketch: notebook page with a filename header, two code cells that pull a pop_df + compute
// group means, and an output plot cell with three bars (one per behaviour state).
import type { SketchDefinition } from '../lib/types'
import { SCHEME, STROKE } from './primitives'

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
const PAGE_X = 60, PAGE_Y = 45, PAGE_W = 600, PAGE_H = 285
const CELL_X = 80, CELL_W = 560

export const notebooks: SketchDefinition = {
  id: 'notebooks',
  title: 'Notebooks Playground',
  width: 720,
  height: 360,
  durationSec: 3.8,
  acts: [
    // Notebook page
    { type: 'rect', at: [PAGE_X, PAGE_Y], size: [PAGE_W, PAGE_H], stroke: 'stroke', strokeWidth: 1, fill: 'background', fillStyle: 'solid', delayMs: 300, drawMs: 500 },
    { type: 'text', at: [PAGE_X + 15, PAGE_Y + 22], value: 'analysis.pluto.jl', size: 12, colour: 'textDim', family: MONO, delayMs: 900, drawMs: 300 },

    // ── Cell 1 — code: load population
    { type: 'rect', at: [CELL_X, 85], size: [CELL_W, 42], stroke: 'stroke', strokeWidth: 1, fill: SCHEME.cell1.soft, fillStyle: 'solid', delayMs: 1100, drawMs: 400 },
    { type: 'text', at: [CELL_X + 15, 106], value: 'df = CeceliaNb.load_pop_df("root/CD4+")', size: 13, family: MONO, delayMs: 1400, drawMs: 400 },
    { type: 'text', at: [CELL_X + 15, 122], value: '# 12,483 rows × 47 cols', size: 11, colour: 'textDim', family: MONO, delayMs: 1600, drawMs: 300 },

    // ── Cell 2 — code: compute group means
    { type: 'rect', at: [CELL_X, 138], size: [CELL_W, 34], stroke: 'stroke', strokeWidth: 1, fill: SCHEME.cell2.soft, fillStyle: 'solid', delayMs: 1800, drawMs: 400 },
    { type: 'text', at: [CELL_X + 15, 160], value: 'means = combine(groupby(df, :state), :speed => mean)', size: 13, family: MONO, delayMs: 2100, drawMs: 400 },

    // ── Cell 3 — plot output. WHITE background (like a real Pluto plot) with room at the
    // bottom for the tick labels so they don't get squashed against the cell edge.
    { type: 'rect', at: [CELL_X, 182], size: [CELL_W, 138], stroke: 'stroke', strokeWidth: 1, fill: '#ffffff', fillStyle: 'solid', delayMs: 2300, drawMs: 400 },
    // Axes — leave 25 px of clearance below the axis for the tick labels
    { type: 'line', from: [CELL_X + 30, 295], to: [CELL_X + CELL_W - 20, 295], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 2600, drawMs: 300 },
    { type: 'line', from: [CELL_X + 30, 295], to: [CELL_X + 30, 200], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 2600, drawMs: 300 },
    // Three bars — one per state
    { type: 'rect', at: [CELL_X + 85,  262], size: [70, 33], fill: SCHEME.cell1.solid, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 2900, drawMs: 350 },
    { type: 'rect', at: [CELL_X + 200, 232], size: [70, 63], fill: SCHEME.cell2.solid, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 2950, drawMs: 350 },
    { type: 'rect', at: [CELL_X + 315, 247], size: [70, 48], fill: SCHEME.cell3.solid, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 3000, drawMs: 350 },
    // State labels below the bars — inside the plot cell with breathing room
    { type: 'text', at: [CELL_X + 100, 314], value: 'arr',  size: 11, colour: 'textDim', delayMs: 3300, drawMs: 200 },
    { type: 'text', at: [CELL_X + 215, 314], value: 'dir',  size: 11, colour: 'textDim', delayMs: 3350, drawMs: 200 },
    { type: 'text', at: [CELL_X + 328, 314], value: 'mea',  size: 11, colour: 'textDim', delayMs: 3400, drawMs: 200 },
  ],
}
