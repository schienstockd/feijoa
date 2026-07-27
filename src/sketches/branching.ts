// Branching / structural analysis — skeletonise a segmentation into a branch/path network, then
// measure each branch (length, tortuosity, branch type, endpoints). Used for fibrous networks
// that AREN'T cells: SHG collagen, FRC/CCL19 reticular meshes, nerves, blood vessels.
// Ports `createBranching` from the old R (skan-based skeleton summary); the sketch shows a
// filled network on the left, then the same network skeletonised on the right with junction
// nodes highlighted (branch points) — that's the core visual metaphor of the algorithm.
import type { SketchDefinition } from '../lib/types'

export const branching: SketchDefinition = {
  id: 'branching',
  title: 'Branching networks',
  width: 720,
  height: 360,
  durationSec: 4.4,
  acts: [

    // ── Left panel: the filled network (collagen / reticular / vessel) — thick pastel paths.
    { type: 'text', at: [60, 100], value: 'network', size: 12, colour: 'textDim', delayMs: 500, drawMs: 300 },

    // A branching filamentous structure — thicker strokes, orange (evokes collagen SHG)
    { type: 'path', d: 'M 60 200 Q 100 190 140 200 T 220 210', stroke: 'orange', strokeWidth: 8, delayMs: 700,  drawMs: 700 },
    { type: 'path', d: 'M 140 200 Q 150 160 175 130',           stroke: 'orange', strokeWidth: 7, delayMs: 900,  drawMs: 600 },
    { type: 'path', d: 'M 175 130 Q 205 115 235 130',           stroke: 'orange', strokeWidth: 6, delayMs: 1100, drawMs: 500 },
    { type: 'path', d: 'M 175 130 Q 170 90 195 60',             stroke: 'orange', strokeWidth: 6, delayMs: 1250, drawMs: 500 },
    { type: 'path', d: 'M 220 210 Q 260 230 290 260',           stroke: 'orange', strokeWidth: 7, delayMs: 1400, drawMs: 500 },
    { type: 'path', d: 'M 220 210 Q 240 180 285 175',           stroke: 'orange', strokeWidth: 6, delayMs: 1550, drawMs: 500 },
    { type: 'path', d: 'M 60 200 Q 55 240 70 285',              stroke: 'orange', strokeWidth: 6, delayMs: 1700, drawMs: 500 },

    // Arrow: network → skeleton
    { type: 'arrow', from: [325, 200], to: [385, 200], colour: 'accent', delayMs: 2300, drawMs: 400 },

    // ── Right panel: the skeleton — same topology, thin lines + labelled branch points.
    { type: 'text', at: [420, 100], value: 'skeleton + branch points', size: 12, colour: 'textDim', delayMs: 2500, drawMs: 300 },

    // Thin skeleton paths mirroring the left panel (offset x+380)
    { type: 'path', d: 'M 440 200 Q 480 190 520 200 T 600 210', stroke: 'stroke', strokeWidth: 2, delayMs: 2700, drawMs: 700 },
    { type: 'path', d: 'M 520 200 Q 530 160 555 130',           stroke: 'stroke', strokeWidth: 2, delayMs: 2900, drawMs: 600 },
    { type: 'path', d: 'M 555 130 Q 585 115 615 130',           stroke: 'stroke', strokeWidth: 2, delayMs: 3100, drawMs: 500 },
    { type: 'path', d: 'M 555 130 Q 550 90 575 60',             stroke: 'stroke', strokeWidth: 2, delayMs: 3200, drawMs: 500 },
    { type: 'path', d: 'M 600 210 Q 640 230 670 260',           stroke: 'stroke', strokeWidth: 2, delayMs: 3300, drawMs: 500 },
    { type: 'path', d: 'M 600 210 Q 620 180 665 175',           stroke: 'stroke', strokeWidth: 2, delayMs: 3400, drawMs: 500 },
    { type: 'path', d: 'M 440 200 Q 435 240 450 285',           stroke: 'stroke', strokeWidth: 2, delayMs: 3500, drawMs: 500 },

    // Junction nodes (branch points) — accent circles
    { type: 'circle', at: [520, 200], r: 6, fill: 'accent', stroke: 'accent', delayMs: 3800, drawMs: 300 },
    { type: 'circle', at: [555, 130], r: 6, fill: 'accent', stroke: 'accent', delayMs: 3900, drawMs: 300 },
    { type: 'circle', at: [600, 210], r: 6, fill: 'accent', stroke: 'accent', delayMs: 4000, drawMs: 300 },
    { type: 'circle', at: [440, 200], r: 6, fill: 'accent', stroke: 'accent', delayMs: 4100, drawMs: 300 },

    // Callout for one branch — label sits well below the horizontal line, with a thin tick
    // connecting it back to the branch it names so it doesn't overlap any skeleton segment.
    { type: 'line', from: [485, 205], to: [485, 240], colour: 'textDim', delayMs: 4200, drawMs: 300 },
    { type: 'text', at: [458, 253], value: 'len 34µm', size: 11, colour: 'textDim', delayMs: 4400, drawMs: 400 },
  ],
}
