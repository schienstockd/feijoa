// Stats annotations on summary plots — between-group tests (Mann-Whitney / Kruskal-Wallis by
// default) rendered as brackets + significance markers (stars OR compact letters, Piepho 2004)
// on box/bar/strip plots. See docs/todo/STATS_ANNOTATIONS_PLAN.md and PR #384.
//
// Sketch: three box plots + brackets with significance stars between them.
import type { SketchDefinition } from '../lib/types'
import { SCHEME, STROKE } from './primitives'

const AXIS_L = 90, AXIS_R = 640, AXIS_B = 285, AXIS_T = 85

// Box positions (centre x + top/bottom/median y)
const A = { cx: 210, boxTop: 190, boxBottom: 240, med: 215, wTop: 155, wBot: 265 }
const B = { cx: 375, boxTop: 155, boxBottom: 205, med: 175, wTop: 130, wBot: 225 }
const C = { cx: 540, boxTop: 130, boxBottom: 185, med: 155, wTop: 105, wBot: 210 }
const BOX_W = 60

export const stats: SketchDefinition = {
  id: 'stats',
  title: 'Stats on plots',
  width: 720,
  height: 360,
  durationSec: 3.6,
  acts: [
    // Axes
    { type: 'line', from: [AXIS_L, AXIS_B], to: [AXIS_R, AXIS_B], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 300, drawMs: 400 },
    { type: 'line', from: [AXIS_L, AXIS_B], to: [AXIS_L, AXIS_T], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 300, drawMs: 400 },

    // ── Box A (cyan)
    { type: 'line', from: [A.cx, A.wBot], to: [A.cx, A.wTop], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 800, drawMs: 300 },
    { type: 'rect', at: [A.cx - BOX_W / 2, A.boxTop], size: [BOX_W, A.boxBottom - A.boxTop], fill: SCHEME.cell1.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 2, delayMs: 1000, drawMs: 400 },
    { type: 'line', from: [A.cx - BOX_W / 2, A.med], to: [A.cx + BOX_W / 2, A.med], colour: 'stroke', strokeWidth: 2.5, delayMs: 1300, drawMs: 250 },
    { type: 'text', at: [A.cx - 5, AXIS_B + 25], value: 'A', size: 14, weight: 700, colour: 'textDim', delayMs: 1500, drawMs: 250 },

    // ── Box B (lime)
    { type: 'line', from: [B.cx, B.wBot], to: [B.cx, B.wTop], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 900, drawMs: 300 },
    { type: 'rect', at: [B.cx - BOX_W / 2, B.boxTop], size: [BOX_W, B.boxBottom - B.boxTop], fill: SCHEME.cell2.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 2, delayMs: 1100, drawMs: 400 },
    { type: 'line', from: [B.cx - BOX_W / 2, B.med], to: [B.cx + BOX_W / 2, B.med], colour: 'stroke', strokeWidth: 2.5, delayMs: 1400, drawMs: 250 },
    { type: 'text', at: [B.cx - 5, AXIS_B + 25], value: 'B', size: 14, weight: 700, colour: 'textDim', delayMs: 1600, drawMs: 250 },

    // ── Box C (magenta)
    { type: 'line', from: [C.cx, C.wBot], to: [C.cx, C.wTop], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 1000, drawMs: 300 },
    { type: 'rect', at: [C.cx - BOX_W / 2, C.boxTop], size: [BOX_W, C.boxBottom - C.boxTop], fill: SCHEME.cell3.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 2, delayMs: 1200, drawMs: 400 },
    { type: 'line', from: [C.cx - BOX_W / 2, C.med], to: [C.cx + BOX_W / 2, C.med], colour: 'stroke', strokeWidth: 2.5, delayMs: 1500, drawMs: 250 },
    { type: 'text', at: [C.cx - 5, AXIS_B + 25], value: 'C', size: 14, weight: 700, colour: 'textDim', delayMs: 1700, drawMs: 250 },

    // ── Significance brackets — both above the plot area (top axis at y=85; highest whisker
    // top is C at y=105). The outer (A vs C) bracket sits higher; the inner (B vs C) is
    // between it and the boxes but still clear of every whisker.
    // A vs C (**) — widest, up top
    { type: 'line', from: [A.cx, 40], to: [C.cx, 40], colour: 'accent', strokeWidth: 2.5, delayMs: 2200, drawMs: 600 },
    { type: 'line', from: [A.cx, 40], to: [A.cx, 52], colour: 'accent', strokeWidth: 2.5, delayMs: 2200, drawMs: 250 },
    { type: 'line', from: [C.cx, 40], to: [C.cx, 52], colour: 'accent', strokeWidth: 2.5, delayMs: 2200, drawMs: 250 },
    { type: 'text', at: [(A.cx + C.cx) / 2 - 12, 34], value: '**', size: 20, weight: 700, colour: 'accent', delayMs: 2900, drawMs: 300 },

    // B vs C (*) — narrower, lower but clearly above C's whisker top (y=105)
    { type: 'line', from: [B.cx, 72], to: [C.cx, 72], colour: 'accent', strokeWidth: 2.5, delayMs: 3100, drawMs: 400 },
    { type: 'line', from: [B.cx, 72], to: [B.cx, 84], colour: 'accent', strokeWidth: 2.5, delayMs: 3100, drawMs: 250 },
    { type: 'line', from: [C.cx, 72], to: [C.cx, 84], colour: 'accent', strokeWidth: 2.5, delayMs: 3100, drawMs: 250 },
    { type: 'text', at: [(B.cx + C.cx) / 2 - 5, 66], value: '*', size: 18, weight: 700, colour: 'accent', delayMs: 3450, drawMs: 300 },
  ],
}
