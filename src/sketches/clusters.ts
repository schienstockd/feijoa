// Cluster labels → populations — placeholder.
// Aim: a UMAP-ish scatter split into three coloured clusters; one cluster gets
// promoted into a named population (chip on the right).
import type { SketchDefinition } from '../lib/types'

export const clusters: SketchDefinition = {
  id: 'clusters',
  title: 'Cluster labels → populations',
  width: 640,
  height: 340,
  durationSec: 3.8,
  acts: [
    { type: 'text', at: [30, 34], value: 'Cluster labels → populations', size: 22, weight: 700, delayMs: 0, drawMs: 400 },
    { type: 'text', at: [30, 58], value: 'promote a Leiden cluster into a named population', size: 13, colour: 'textDim', delayMs: 200, drawMs: 400 },

    // Cluster 1 — blue (top-left blob)
    { type: 'circle', at: [140, 150], r: 6, fill: 'blue', stroke: 'stroke', delayMs: 700,  drawMs: 200 },
    { type: 'circle', at: [175, 135], r: 6, fill: 'blue', stroke: 'stroke', delayMs: 750,  drawMs: 200 },
    { type: 'circle', at: [160, 175], r: 6, fill: 'blue', stroke: 'stroke', delayMs: 800,  drawMs: 200 },
    { type: 'circle', at: [200, 160], r: 6, fill: 'blue', stroke: 'stroke', delayMs: 850,  drawMs: 200 },

    // Cluster 2 — orange (middle blob)
    { type: 'circle', at: [255, 235], r: 6, fill: 'orange', stroke: 'stroke', delayMs: 900,  drawMs: 200 },
    { type: 'circle', at: [285, 210], r: 6, fill: 'orange', stroke: 'stroke', delayMs: 950,  drawMs: 200 },
    { type: 'circle', at: [270, 260], r: 6, fill: 'orange', stroke: 'stroke', delayMs: 1000, drawMs: 200 },
    { type: 'circle', at: [305, 245], r: 6, fill: 'orange', stroke: 'stroke', delayMs: 1050, drawMs: 200 },

    // Cluster 3 — yellow (right blob) — this is the one we'll promote
    { type: 'circle', at: [400, 160], r: 6, fill: 'yellow', stroke: 'stroke', delayMs: 1100, drawMs: 200 },
    { type: 'circle', at: [430, 140], r: 6, fill: 'yellow', stroke: 'stroke', delayMs: 1150, drawMs: 200 },
    { type: 'circle', at: [420, 180], r: 6, fill: 'yellow', stroke: 'stroke', delayMs: 1200, drawMs: 200 },
    { type: 'circle', at: [460, 165], r: 6, fill: 'yellow', stroke: 'stroke', delayMs: 1250, drawMs: 200 },

    // Ring around the yellow cluster — the "selection"
    { type: 'ellipse', at: [430, 160], size: [110, 70], stroke: 'accent', strokeWidth: 3, delayMs: 1700, drawMs: 700 },

    // Arrow out to the population chip on the right
    { type: 'arrow', from: [500, 160], to: [545, 160], colour: 'accent', delayMs: 2600, drawMs: 400 },

    // Population chip (rect + label)
    { type: 'rect', at: [548, 138], size: [72, 44], fill: 'soft1', stroke: 'accent', strokeWidth: 2, delayMs: 3050, drawMs: 400 },
    { type: 'text', at: [560, 165], value: 'pop A', size: 14, weight: 600, colour: 'accent', delayMs: 3350, drawMs: 400 },
  ],
}
