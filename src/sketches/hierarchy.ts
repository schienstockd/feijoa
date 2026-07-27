// Population hierarchy — Cecelia's gating produces a TREE of populations. A gate on the root
// yields a child pop; a gate applied to that child yields a grandchild; and so on. Populations
// are addressed by "/-separated" paths (root/live/CD4/effector). Sketch shows the hierarchy as
// a nested-boxes tree — an outer parent, an inner child, an inner-inner grandchild — with the
// path label alongside. Matches PopulationManager.vue's flatFor(populations) rendering.
import type { SketchDefinition } from '../lib/types'

export const hierarchy: SketchDefinition = {
  id: 'hierarchy',
  title: 'Population hierarchy',
  width: 720,
  height: 360,
  durationSec: 4.0,
  acts: [

    // Root (all cells) — largest ring, muted grey
    { type: 'ellipse', at: [220, 200], size: [280, 200], stroke: 'stroke', strokeWidth: 2, fill: 'soft4', delayMs: 700, drawMs: 900 },
    { type: 'text', at: [95, 120], value: 'root · all cells', size: 12, colour: 'textDim', delayMs: 1600, drawMs: 300 },

    // Child gate — CD4+ (nested inside root)
    { type: 'ellipse', at: [220, 210], size: [200, 140], stroke: 'accent', strokeWidth: 2, fill: 'soft1', delayMs: 1800, drawMs: 700 },
    { type: 'text', at: [140, 160], value: 'CD4+', size: 12, weight: 600, colour: 'accent', delayMs: 2500, drawMs: 300 },

    // Grandchild gate — effector (nested inside CD4+)
    { type: 'ellipse', at: [220, 220], size: [110, 80], stroke: 'blue', strokeWidth: 2, fill: 'soft2', delayMs: 2700, drawMs: 700 },
    { type: 'text', at: [190, 224], value: 'effector', size: 12, weight: 600, colour: 'blue', delayMs: 3400, drawMs: 300 },

    // Path readout — reads the address of the innermost pop
    { type: 'text', at: [400, 170], value: 'address:', size: 12, colour: 'textDim', delayMs: 3600, drawMs: 300 },
    { type: 'text', at: [400, 195], value: 'root/CD4+/effector', size: 13, weight: 600, family: 'ui-monospace, SFMono-Regular, Menlo, monospace', delayMs: 3700, drawMs: 400 },
  ],
}
