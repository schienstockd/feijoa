// Branching / structural analysis — skeletonise a segmentation into a branch/path network, then
// measure each branch (length, tortuosity, branch type, endpoints). Used for fibrous networks
// that AREN'T cells: SHG collagen, FRC/CCL19 reticular meshes, nerves, blood vessels.
//
// Sketch: filled fibrous network on the LEFT (lime — evokes SHG green), skeletonised network
// with branch-point nodes on the RIGHT. Same topology in both, arrow implies the transform.
import type { SketchDefinition, SketchAct } from '../lib/types'
import { SCHEME } from './primitives'

// Branch definitions — one entry per branch, with LEFT-panel and RIGHT-panel path strings.
// Right paths mirror lefts, shifted +340 px in x.
const BRANCHES: Array<{ left: string; right: string; width: number; delayMs: number }> = [
  { left:  'M 70 235 Q 120 220 160 235 T 240 245',
    right: 'M 410 235 Q 460 220 500 235 T 580 245', width: 9, delayMs: 500 },
  { left:  'M 160 235 Q 175 190 195 155',
    right: 'M 500 235 Q 515 190 535 155',           width: 8, delayMs: 700 },
  { left:  'M 195 155 Q 225 140 255 155',
    right: 'M 535 155 Q 565 140 595 155',           width: 7, delayMs: 900 },
  { left:  'M 195 155 Q 190 135 210 122',
    right: 'M 535 155 Q 530 135 550 122',           width: 7, delayMs: 1050 },
  { left:  'M 240 245 Q 280 265 310 290',
    right: 'M 580 245 Q 620 265 650 290',           width: 8, delayMs: 1200 },
  { left:  'M 240 245 Q 260 215 305 210',
    right: 'M 580 245 Q 600 215 645 210',           width: 7, delayMs: 1350 },
  { left:  'M 70 235 Q 62 275 78 315',
    right: 'M 410 235 Q 402 275 418 315',           width: 7, delayMs: 1500 },
]

// Junctions (branch-point positions) on the RIGHT panel
const JUNCTIONS: [number, number][] = [
  [500, 235], [535, 155], [580, 245], [410, 235],
]

export const branching: SketchDefinition = {
  id: 'branching',
  title: 'Branching networks',
  width: 720,
  height: 360,
  durationSec: 4.4,
  acts: [
    // ── LEFT: filled network — thick lime strokes
    { type: 'text', at: [60, 100], value: 'network', size: 12, colour: 'textDim', delayMs: 300, drawMs: 300 },
    ...BRANCHES.map((b): SketchAct => ({
      type: 'path', d: b.left,
      stroke: SCHEME.cell2.solid, strokeWidth: b.width,
      delayMs: b.delayMs, drawMs: 500,
    })),

    // Arrow: network → skeleton
    { type: 'arrow', from: [340, 210], to: [395, 210], colour: 'accent', strokeWidth: 3, delayMs: 2000, drawMs: 400 },

    // ── RIGHT: skeleton — thin dark lines + branch-point dots
    { type: 'text', at: [420, 100], value: 'skeleton + branch points', size: 12, colour: 'textDim', delayMs: 2200, drawMs: 300 },
    ...BRANCHES.map((b, i): SketchAct => ({
      type: 'path', d: b.right,
      stroke: 'stroke', strokeWidth: 2,
      delayMs: 2400 + i * 130, drawMs: 500,
    })),
    ...JUNCTIONS.map((p, i): SketchAct => ({
      type: 'circle', at: p, r: 7,
      fill: 'accent', fillStyle: 'solid', stroke: 'accent',
      delayMs: 3700 + i * 100, drawMs: 250,
    })),
  ],
}
