// Stats annotations on summary plots — between-group tests (Mann-Whitney/Kruskal-Wallis by
// default) rendered as brackets + significance markers (stars OR compact letters, Piepho 2004)
// on bar/box/strip charts. See docs/todo/STATS_ANNOTATIONS_PLAN.md and PR #384.
// The sketch draws three box-plot silhouettes plus a bracket with a star between two of them.
import type { SketchDefinition } from '../lib/types'

export const stats: SketchDefinition = {
  id: 'stats',
  title: 'Stats on plots',
  width: 560,
  height: 340,
  durationSec: 4.0,
  acts: [
    { type: 'text', at: [30, 34], value: 'Stats on plots', size: 22, weight: 700, delayMs: 0, drawMs: 400 },
    { type: 'text', at: [30, 58], value: 'brackets, stars, and compact letters — right on the chart', size: 13, colour: 'textDim', delayMs: 200, drawMs: 400 },

    // Axes
    { type: 'line', from: [80, 260], to: [510, 260], colour: 'stroke', delayMs: 600, drawMs: 500 },
    { type: 'line', from: [80, 260], to: [80,  100], colour: 'stroke', delayMs: 600, drawMs: 500 },

    // Three box plots — vertical whisker + rectangle. Y-axis inverted (bigger = up).
    // Group A — lowest median, blue
    { type: 'line', from: [155, 235], to: [155, 165], colour: 'stroke', delayMs: 1100, drawMs: 400 },
    { type: 'rect', at: [135, 200], size: [40, 30], fill: 'blue', stroke: 'stroke', strokeWidth: 2, delayMs: 1300, drawMs: 500 },
    { type: 'line', from: [135, 215], to: [175, 215], colour: 'stroke', delayMs: 1500, drawMs: 300 },
    { type: 'text', at: [143, 280], value: 'A', size: 14, weight: 600, delayMs: 1600, drawMs: 300 },

    // Group B — mid median, orange
    { type: 'line', from: [275, 210], to: [275, 130], colour: 'stroke', delayMs: 1200, drawMs: 400 },
    { type: 'rect', at: [255, 165], size: [40, 35], fill: 'orange', stroke: 'stroke', strokeWidth: 2, delayMs: 1400, drawMs: 500 },
    { type: 'line', from: [255, 180], to: [295, 180], colour: 'stroke', delayMs: 1600, drawMs: 300 },
    { type: 'text', at: [263, 280], value: 'B', size: 14, weight: 600, delayMs: 1700, drawMs: 300 },

    // Group C — highest median, yellow
    { type: 'line', from: [395, 195], to: [395, 115], colour: 'stroke', delayMs: 1300, drawMs: 400 },
    { type: 'rect', at: [375, 145], size: [40, 35], fill: 'yellow', stroke: 'stroke', strokeWidth: 2, delayMs: 1500, drawMs: 500 },
    { type: 'line', from: [375, 160], to: [415, 160], colour: 'stroke', delayMs: 1700, drawMs: 300 },
    { type: 'text', at: [383, 280], value: 'C', size: 14, weight: 600, delayMs: 1800, drawMs: 300 },

    // ── Between-group bracket A vs C with a significance star
    { type: 'line', from: [155, 90], to: [395, 90], colour: 'accent', delayMs: 2400, drawMs: 700 },
    { type: 'line', from: [155, 90], to: [155, 100], colour: 'accent', delayMs: 2400, drawMs: 300 },
    { type: 'line', from: [395, 90], to: [395, 100], colour: 'accent', delayMs: 2400, drawMs: 300 },
    { type: 'text', at: [265, 82], value: '**', size: 18, weight: 700, colour: 'accent', delayMs: 3200, drawMs: 400 },

    // Smaller bracket B vs C with a single star
    { type: 'line', from: [275, 115], to: [395, 115], colour: 'accent', delayMs: 3400, drawMs: 500 },
    { type: 'line', from: [275, 115], to: [275, 125], colour: 'accent', delayMs: 3400, drawMs: 300 },
    { type: 'line', from: [395, 115], to: [395, 125], colour: 'accent', delayMs: 3400, drawMs: 300 },
    { type: 'text', at: [325, 110], value: '*', size: 16, weight: 700, colour: 'accent', delayMs: 3800, drawMs: 400 },
  ],
}
