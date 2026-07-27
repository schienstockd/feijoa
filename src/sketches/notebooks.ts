// Notebooks Playground — a per-project Pluto notebook for pure-Julia downstream analysis.
// Cells alternate code (light bg) with output (richer/plot). See docs/NOTEBOOKS.md.
// The sketch shows a stacked notebook: two code cells and one plot output.
import type { SketchDefinition } from '../lib/types'

export const notebooks: SketchDefinition = {
  id: 'notebooks',
  title: 'Notebooks Playground',
  width: 720,
  height: 360,
  durationSec: 4.0,
  acts: [

    // Notebook page frame
    { type: 'rect', at: [90, 90], size: [440, 250], stroke: 'stroke', strokeWidth: 1, fill: 'background', delayMs: 600, drawMs: 700 },
    { type: 'text', at: [105, 108], value: 'analysis.pluto.jl', size: 11, colour: 'textDim', family: 'ui-monospace, SFMono-Regular, Menlo, monospace', delayMs: 1200, drawMs: 300 },

    // ── Cell 1 — code (using CeceliaNb helper)
    { type: 'rect', at: [110, 120], size: [400, 40], stroke: 'stroke', strokeWidth: 1, fill: 'soft2', delayMs: 1400, drawMs: 500 },
    { type: 'text', at: [125, 138], value: 'df = CeceliaNb.load_pop_df("root/CD4+")', size: 12, family: 'ui-monospace, SFMono-Regular, Menlo, monospace', delayMs: 1700, drawMs: 400 },
    { type: 'text', at: [125, 154], value: '# 12,483 rows × 47 cols', size: 11, colour: 'textDim', family: 'ui-monospace, SFMono-Regular, Menlo, monospace', delayMs: 1900, drawMs: 400 },

    // ── Cell 2 — code (compute)
    { type: 'rect', at: [110, 170], size: [400, 32], stroke: 'stroke', strokeWidth: 1, fill: 'soft2', delayMs: 2100, drawMs: 500 },
    { type: 'text', at: [125, 190], value: 'means = combine(groupby(df, :state), :speed => mean)', size: 12, family: 'ui-monospace, SFMono-Regular, Menlo, monospace', delayMs: 2400, drawMs: 400 },

    // ── Cell 3 — output (a plot)
    { type: 'rect', at: [110, 212], size: [400, 115], stroke: 'stroke', strokeWidth: 1, fill: 'soft4', delayMs: 2600, drawMs: 500 },
    // Plot axes
    { type: 'line', from: [140, 310], to: [485, 310], colour: 'stroke', delayMs: 2900, drawMs: 400 },
    { type: 'line', from: [140, 310], to: [140, 230], colour: 'stroke', delayMs: 2900, drawMs: 400 },
    // Three bars — one per state
    { type: 'rect', at: [180, 275], size: [40, 35], fill: 'blue',   fillStyle: 'solid', delayMs: 3200, drawMs: 400 },
    { type: 'rect', at: [270, 250], size: [40, 60], fill: 'orange', fillStyle: 'solid', delayMs: 3250, drawMs: 400 },
    { type: 'rect', at: [360, 260], size: [40, 50], fill: 'yellow', fillStyle: 'solid', delayMs: 3300, drawMs: 400 },
  ],
}
