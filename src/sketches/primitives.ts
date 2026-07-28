// Shared visual primitives for the feijoa pipeline sketches. Each pipeline sketch composes
// these to keep a coherent visual language with the main logo (see logo.ts).
//
// The three "slots" (cell1 / cell2 / cell3) refer to the three cell colours in the logo:
//   cell1 = cyan   (the cell inside the imaging window)
//   cell2 = lime   (middle cell)
//   cell3 = magenta (right cell)
// From the "vibrant" colour scheme in logo_cascade_variants.ts.
import type { SketchAct } from '../lib/types'
import { SCHEMES, type ColourSchemeKey } from './schemes'
import { NUC_FILL } from './logo_common'

export type SlotKey = 'cell1' | 'cell2' | 'cell3'
export const SLOTS: SlotKey[] = ['cell1', 'cell2', 'cell3']

// The colour scheme the pipeline sketches use — matches the main logo (vibrant).
export const SCHEME = SCHEMES.vibrant
export const SCHEME_NAME: ColourSchemeKey = 'vibrant'

// Standard stroke widths — the logo's locked-in values, so every sketch reads as a sibling.
export const STROKE = {
  frame: 11,   // pink imaging window
  cell: 3,     // cell body outline
  track: 8,    // migration track
  thin: 1.5,   // supporting lines (axes, callouts)
  nuc: 1.2,    // nucleus outline
} as const

// The pink accent + neutral text colours from the logo.
export const COLOUR = {
  accent: 'accent',      // pink — imaging window, gates, highlights
  stroke: 'stroke',      // dark — outlines, axes
  text: 'text',
  textDim: 'textDim',
  bg: 'background',
} as const

export { NUC_FILL }

// --- Immune cell primitive -------------------------------------------------------------------
//
// The amoeboid "migrating" cell — a polarised leaf/lens silhouette: sharp leading nose, a
// tapered trailing uropod tip, and two uneven pseudopod bumps (upper bigger than lower) so it
// doesn't read as mirror-symmetric. By default the leading edge (nose) is on the LEFT and the
// uropod on the RIGHT. Pass `flip: true` for the opposite — used when the cell should appear
// to move rightward.
//
// The nose and tail anchors use SHORT control-point handles (close to the anchor itself) so
// the curve breaks into an actual cusp there, instead of the smooth rounded corner a generic
// bezier gives — that's what makes it read as "pointed" rather than "blobby egg."
//
// Template coordinates are relative to the nucleus centre. Scale and flip are applied about
// that centre.
const CELL_ANCHORS: [number, number][] = [
  [-40, 0],    // 0: front tip — sharp nose, leading edge
  [-14, -24],  // 1: upper pseudopod bump (bigger)
  [16, -16],   // 2: upper-rear shoulder
  [42, 4],     // 3: tail tip — thin, tapered uropod
  [6, 20],     // 4: lower-rear shoulder (shallower — asymmetric vs upper)
  [-18, 18],   // 5: lower pseudopod bump (smaller than upper)
]
const CELL_CONTROLS: [[number, number], [number, number]][] = [
  [[-36, -10], [-20, -30]],  // 0→1  nose (sharp cusp) → upper bump (rounded)
  [[-4, -26], [8, -22]],     // 1→2  upper bump → shoulder (rounded)
  [[26, -18], [40, -4]],     // 2→3  shoulder → tail tip (sharp cusp)
  [[40, 10], [18, 20]],      // 3→4  tail tip (sharp cusp) → lower shoulder
  [[-4, 22], [-12, 22]],     // 4→5  lower shoulder → lower bump (rounded)
  [[-28, 12], [-38, 8]],     // 5→0  lower bump → nose (sharp cusp)
]

// --- Scanning / sessile cell primitive -----------------------------------------------------
//
// A patrolling cell that ISN'T committed to a direction — arrested or scanning states. A
// dendritic star with 5 protrusions radiating outward and no single leading edge. Same cusp
// trick as the migrating cell (short handles at the arm tips) so the arms read as distinct
// pointed protrusions rather than a soft cog/gear.
function scanningCellPathD(cx: number, cy: number, scale: number, rotate: number): string {
  const nArms = 5
  const rTip = 32, rNotch = 18      // arm-tip vs. inner-notch radius (unscaled) — shallow notches
                                     // so it reads as a lumpy dendritic blob, not a sharp asterisk
  const n = nArms * 2
  const anchors: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const deg = (i * 360) / n + rotate
    const r = (i % 2 === 0 ? rTip : rNotch) * scale
    const rad = (deg * Math.PI) / 180
    anchors.push([cx + Math.cos(rad) * r, cy + Math.sin(rad) * r])
  }
  const tipBulge = 10 * scale, notchPull = 14 * scale
  let d = `M ${anchors[0][0]} ${anchors[0][1]}`
  for (let i = 0; i < n; i++) {
    const a = anchors[i], b = anchors[(i + 1) % n]
    const midDeg = (i * 360) / n + 180 / n + rotate
    const midRad = (midDeg * Math.PI) / 180
    const tipToNotch = i % 2 === 0
    const pull = tipToNotch ? notchPull : tipBulge
    const outward = tipToNotch ? 1 : 1.15
    const c1: [number, number] = [a[0] * 0.4 + cx * 0.6 + Math.cos(midRad) * pull, a[1] * 0.4 + cy * 0.6 + Math.sin(midRad) * pull]
    const c2: [number, number] = [b[0] * 0.4 + cx * 0.6 + Math.cos(midRad) * pull * outward, b[1] * 0.4 + cy * 0.6 + Math.sin(midRad) * pull * outward]
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${b[0]} ${b[1]}`
  }
  return d + ' Z'
}

// Public helper — get just the scanning/sessile cell outline path string.
export function scanningCellPath(cx: number, cy: number, scale = 1, rotate = 0): string {
  return scanningCellPathD(cx, cy, scale, rotate)
}

// Public helper — get just the immune-cell outline path string. Useful when a sketch needs
// to draw the same cell shape twice (e.g. segmentation: filled fluorescence first, then the
// outline draws in as the segmentation mask). `rotate` is degrees (positive = clockwise).
export function cellPath(cx: number, cy: number, scale = 1, flip = false, rotate = 0): string {
  return cellPathD(cx, cy, scale, flip, rotate)
}

function cellPathD(cx: number, cy: number, scale: number, flip: boolean, rotate = 0): string {
  const sx = flip ? -1 : 1
  const rad = (rotate * Math.PI) / 180
  const cs = Math.cos(rad), sn = Math.sin(rad)
  const tx = ([x, y]: [number, number]) => {
    // 1. flip + scale about origin
    const sx1 = x * sx * scale
    const sy1 = y * scale
    // 2. rotate
    const rx = sx1 * cs - sy1 * sn
    const ry = sx1 * sn + sy1 * cs
    // 3. translate to (cx, cy)
    return `${cx + rx} ${cy + ry}`
  }
  let d = `M ${tx(CELL_ANCHORS[0])}`
  for (let i = 0; i < 6; i++) {
    const [c1, c2] = CELL_CONTROLS[i]
    const next = CELL_ANCHORS[(i + 1) % 6]
    d += ` C ${tx(c1)}, ${tx(c2)}, ${tx(next)}`
  }
  return d + ' Z'
}

export interface ImmuneCellOpts {
  slot?: SlotKey
  scale?: number
  flip?: boolean            // false = leading-left/uropod-right; true = leading-right/uropod-left
  rotate?: number           // degrees, applied on top of flip — point the nose along an arbitrary direction (e.g. a track's tangent)
  morphology?: 'migrating' | 'scanning'   // default 'migrating'; 'scanning' = sessile/patrolling star shape, ignores `flip`
  cellStroke?: number
  strokeColour?: string     // override the stroke colour (defaults to 'stroke' for filled cells, or the slot's colour for outline-only cells)
  nucRadius?: number        // defaults to 15 * scale
  cellDelayMs?: number
  cellDrawMs?: number
  nucDelayMs?: number
  nucDrawMs?: number
  showNucleus?: boolean     // default true
  fill?: 'solid' | 'soft' | 'none'   // default 'soft' (mid-tone, matches logo)
}

// Returns the acts for one immune cell (body + nucleus). Nucleus is drawn AFTER the body so
// it reads over the top. When composing into a sketch that has a migration track, put the
// TRACK first in the acts array so the cell body occludes the track's origin (see logo.ts).
export function immuneCell(cx: number, cy: number, opts: ImmuneCellOpts = {}): SketchAct[] {
  const {
    slot = 'cell1',
    scale = 1,
    flip = false,
    rotate = 0,
    morphology = 'migrating',
    cellStroke = STROKE.cell,
    strokeColour,
    nucRadius = 15 * scale,
    cellDelayMs,
    cellDrawMs = 350,
    nucDelayMs,
    nucDrawMs = 250,
    showNucleus = true,
    fill = 'soft',
  } = opts

  const cc = SCHEME[slot]
  const d = morphology === 'scanning' ? scanningCellPath(cx, cy, scale, rotate) : cellPathD(cx, cy, scale, flip, rotate)
  const strokeFilled = strokeColour ?? 'stroke'
  const strokeOutline = strokeColour ?? cc.solid

  const cellAct: SketchAct =
    fill === 'solid'
      ? { type: 'path', d, fill: cc.solid, fillStyle: 'solid', stroke: strokeFilled, strokeWidth: cellStroke, delayMs: cellDelayMs, drawMs: cellDrawMs }
      : fill === 'soft'
      ? { type: 'path', d, fill: cc.soft, fillStyle: 'solid', stroke: strokeFilled, strokeWidth: cellStroke, delayMs: cellDelayMs, drawMs: cellDrawMs }
      : { type: 'path', d, stroke: strokeOutline, strokeWidth: cellStroke, delayMs: cellDelayMs, drawMs: cellDrawMs }

  const out: SketchAct[] = [cellAct]

  if (showNucleus) {
    out.push({
      type: 'circle',
      at: [cx, cy],
      r: nucRadius,
      fill: NUC_FILL,
      fillStyle: 'solid',
      stroke: 'stroke',
      strokeWidth: STROKE.nuc,
      delayMs: nucDelayMs ?? (cellDelayMs !== undefined ? cellDelayMs + 200 : undefined),
      drawMs: nucDrawMs,
    })
  }

  return out
}

// --- Migration track --------------------------------------------------------------------------

export interface TrackOpts {
  slot?: SlotKey
  width?: number
  delayMs?: number
  drawMs?: number
}

// A pre-authored path (`d`) styled as a migration track — loud stroke, colour from the slot.
export function migrationTrack(d: string, opts: TrackOpts = {}): SketchAct {
  const { slot = 'cell1', width = STROKE.track, delayMs, drawMs } = opts
  return {
    type: 'path', d,
    stroke: SCHEME[slot].track, strokeWidth: width,
    delayMs, drawMs,
  }
}

// --- Blob helper -------------------------------------------------------------------------------
//
// Lives in geom.ts (pure geometry, no palette deps) so the logo modules — which primitives.ts
// itself imports from — can use it without an import cycle. Re-exported here because this is
// where callers expect to find it.
export { blobPath } from './geom'

// --- Imaging window (pink frame) --------------------------------------------------------------

export interface WindowOpts {
  size?: [number, number]     // default [100, 100] (matches logo)
  strokeWidth?: number        // default STROKE.frame (11)
  delayMs?: number
  drawMs?: number
}

// Rectangular pink imaging window. Default 100×100 to match the logo's ROI.
export function imagingWindow(x: number, y: number, opts: WindowOpts = {}): SketchAct {
  const { size = [100, 100], strokeWidth = STROKE.frame, delayMs = 0, drawMs = 400 } = opts
  return {
    type: 'rect', at: [x, y], size,
    stroke: COLOUR.accent, strokeWidth,
    delayMs, drawMs,
  }
}
