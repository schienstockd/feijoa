// Cascade knob-turning variants — one factory function that takes an options bag and produces
// a SketchDefinition. Each named knob (frame thickness, cell fill, wordmark size, timing,
// colour scheme, ...) gets its own group of variants generated from the factory.
import type { SketchDefinition, SketchAct } from '../lib/types'
import {
  BLUE_CELL, ORANGE_CELL, YELLOW_CELL,
  BLUE_TRACK, ORANGE_TRACK, YELLOW_TRACK,
  BLUE_NUC, ORANGE_NUC, YELLOW_NUC,
  NUC_FILL,
  FRAME_AT, FRAME_SIZE, FRAME_TL, FRAME_TR, FRAME_BR, FRAME_BL,
  WORDMARK_AT, LOGO_W, LOGO_H,
} from './logo_common'
import { feijoaMark } from './feijoa_mark'
import { SCHEMES, type ColourSchemeKey } from './schemes'

interface Opts {
  frameStroke?: number
  frameStyle?: 'rect' | 'overshoot'
  frameColour?: string
  cellStroke?: number
  cellFill?: 'solid' | 'soft' | 'none'
  nucStyle?: 'pale' | 'color' | 'outline'
  trackStroke?: number
  wordmarkSize?: number
  wordmarkWeight?: number
  wordmarkFamily?: string
  duration?: number
  order?: 'boy' | 'yob' | 'sync'
  colourScheme?: ColourSchemeKey
}

// Colour schemes now live in schemes.ts (see the cycle note there). Re-exported so existing
// `from './logo_cascade_variants'` imports keep working.
export { SCHEMES } from './schemes'
export type { ColourSchemeKey, CellColours, ColourScheme } from './schemes'

const DEFAULT_FONT = '"Segoe UI", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif'

// Baseline timing (matches current logo_cascade at duration=2.5s). The factory scales every
// delay and drawMs by `duration / 2.5`.
const T = {
  frame_d: 0, frame_w: 500,
  blue_cell_d: 300, blue_cell_w: 280,
  blue_nuc_d: 480, blue_nuc_w: 180,
  blue_track_d: 550, blue_track_w: 450,
  wordmark_d: 800, wordmark_w: 400,
  orange_cell_d: 1150, orange_cell_w: 300,
  orange_nuc_d: 1350, orange_nuc_w: 180,
  orange_track_d: 1400, orange_track_w: 500,
  yellow_cell_d: 1650, yellow_cell_w: 300,
  yellow_nuc_d: 1850, yellow_nuc_w: 180,
  yellow_track_d: 1900, yellow_track_w: 600,
  feijoa_w: 620,
}

// The feijoa mark: right of the wordmark, tilted off-axis so it doesn't read as a button.
// Sized so its skin ring (2 × 26 × scale ≈ 94) matches the wordmark's cap height, and centred on
// the caps' midline — it reads as a sibling of the letters rather than a stray dot.
//
// x mirrors the gap on the other end of the logo: the imaging window's right edge (155) sits 25
// before the wordmark (180), so the mark sits 25 after the rightmost art — the yellow/magenta
// cell, whose path tops out at x≈707. Left edge 732, plus the rotated half-width (~43) → 775.
const FEIJOA_AT: [number, number] = [775, 146]
const FEIJOA_SCALE = 1.8
const FEIJOA_ROTATE = 30
const FEIJOA_STROKE = 4.5     // proportional to the enlarged mark, matching the cells' weight
const FEIJOA_GAP = 140        // baseline ms of breathing room after the last other act
const FEIJOA_GROW_FROM = 0.12

type Position = 'blue' | 'orange' | 'yellow'
type Slot = 'cell1' | 'cell2' | 'cell3'
const POS_TO_SLOT: Record<Position, Slot> = { blue: 'cell1', orange: 'cell2', yellow: 'cell3' }
const CELL_PATHS: Record<Position, string> = { blue: BLUE_CELL, orange: ORANGE_CELL, yellow: YELLOW_CELL }
const TRACK_PATHS: Record<Position, string> = { blue: BLUE_TRACK, orange: ORANGE_TRACK, yellow: YELLOW_TRACK }
const NUCS: Record<Position, typeof BLUE_NUC> = { blue: BLUE_NUC, orange: ORANGE_NUC, yellow: YELLOW_NUC }

function baseDelays(color: Position) {
  return color === 'blue'
    ? { cell: T.blue_cell_d,   cellW: T.blue_cell_w,   nuc: T.blue_nuc_d,   nucW: T.blue_nuc_w,   track: T.blue_track_d,   trackW: T.blue_track_w }
    : color === 'orange'
    ? { cell: T.orange_cell_d, cellW: T.orange_cell_w, nuc: T.orange_nuc_d, nucW: T.orange_nuc_w, track: T.orange_track_d, trackW: T.orange_track_w }
    : { cell: T.yellow_cell_d, cellW: T.yellow_cell_w, nuc: T.yellow_nuc_d, nucW: T.yellow_nuc_w, track: T.yellow_track_d, trackW: T.yellow_track_w }
}

export function makeCascade(id: string, title: string, opts: Opts = {}): SketchDefinition {
  const {
    frameStroke = 11,
    frameStyle = 'rect',
    frameColour = 'accent',
    cellStroke = 1.5,
    cellFill = 'solid',
    nucStyle = 'pale',
    trackStroke = 6,
    wordmarkSize = 140,
    wordmarkWeight = 800,
    wordmarkFamily = DEFAULT_FONT,
    duration = 2.5,
    order = 'boy',
    colourScheme = 'classic',
  } = opts

  const s = duration / 2.5
  const scheme = SCHEMES[colourScheme]

  // For `yob` / `sync` orders, remap which position gets which set of baseline timings.
  const timingFor = (color: Position) => {
    if (order === 'boy') return baseDelays(color)
    if (order === 'yob') {
      const remap: Record<Position, Position> = { yellow: 'blue', orange: 'orange', blue: 'yellow' }
      return baseDelays(remap[color])
    }
    // sync: every position uses blue's timings
    return baseDelays('blue')
  }

  const acts: SketchAct[] = []

  // Frame
  if (frameStyle === 'rect') {
    acts.push({ type: 'rect', at: FRAME_AT, size: FRAME_SIZE, stroke: frameColour, strokeWidth: frameStroke, delayMs: T.frame_d * s, drawMs: T.frame_w * s })
  } else {
    const stagger = 80 * s
    const lineDraw = 220 * s
    acts.push(
      { type: 'line', from: FRAME_TL, to: FRAME_TR, colour: frameColour, strokeWidth: frameStroke, overshoot: 3, delayMs: 0, drawMs: lineDraw },
      { type: 'line', from: FRAME_TR, to: FRAME_BR, colour: frameColour, strokeWidth: frameStroke, overshoot: 3, delayMs: stagger, drawMs: lineDraw },
      { type: 'line', from: FRAME_BR, to: FRAME_BL, colour: frameColour, strokeWidth: frameStroke, overshoot: 3, delayMs: 2 * stagger, drawMs: lineDraw },
      { type: 'line', from: FRAME_BL, to: FRAME_TL, colour: frameColour, strokeWidth: frameStroke, overshoot: 3, delayMs: 3 * stagger, drawMs: lineDraw },
    )
  }

  // Each position: TRACK first (below cell in z), then CELL, then NUCLEUS.
  for (const color of ['blue', 'orange', 'yellow'] as Position[]) {
    const d = timingFor(color)
    const nuc = NUCS[color]
    const cc = scheme[POS_TO_SLOT[color]]

    // Track
    acts.push({
      type: 'path', d: TRACK_PATHS[color],
      stroke: cc.track, strokeWidth: trackStroke,
      delayMs: d.track * s, drawMs: d.trackW * s,
    })

    // Cell — fill + stroke depend on cellFill option
    const cellAct: SketchAct = (() => {
      if (cellFill === 'solid') {
        return { type: 'path', d: CELL_PATHS[color], fill: cc.solid, fillStyle: 'solid', stroke: 'stroke', strokeWidth: cellStroke, delayMs: d.cell * s, drawMs: d.cellW * s }
      }
      if (cellFill === 'soft') {
        return { type: 'path', d: CELL_PATHS[color], fill: cc.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: cellStroke, delayMs: d.cell * s, drawMs: d.cellW * s }
      }
      // outline only — use the cell's main colour as stroke since there's no fill
      return { type: 'path', d: CELL_PATHS[color], stroke: cc.solid, strokeWidth: cellStroke, delayMs: d.cell * s, drawMs: d.cellW * s }
    })()
    acts.push(cellAct)

    // Nucleus
    const nucAct: SketchAct = (() => {
      if (nucStyle === 'pale') {
        return { type: 'circle', at: nuc.at, r: nuc.r, fill: NUC_FILL, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: d.nuc * s, drawMs: d.nucW * s }
      }
      if (nucStyle === 'color') {
        return { type: 'circle', at: nuc.at, r: nuc.r, fill: cc.nuc, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: d.nuc * s, drawMs: d.nucW * s }
      }
      return { type: 'circle', at: nuc.at, r: nuc.r, stroke: cc.nuc, strokeWidth: 1.5, delayMs: d.nuc * s, drawMs: d.nucW * s }
    })()
    acts.push(nucAct)
  }

  // Wordmark
  acts.push({
    type: 'text', at: WORDMARK_AT, value: 'Cecelia',
    size: wordmarkSize, weight: wordmarkWeight, family: wordmarkFamily,
    delayMs: T.wordmark_d * s, drawMs: T.wordmark_w * s,
  })

  // Feijoa mark — the namesake fruit, sitting to the right of the wordmark and tilted slightly
  // so it doesn't read as a button. It lands LAST, after everything else has settled: derived
  // from the actual end of the acts above rather than a fixed constant, because which element
  // finishes last depends on `order` (sync ends with the wordmark; boy/yob with the yellow track).
  const feijoaDelay = endOf(acts) + FEIJOA_GAP * s
  acts.push(...feijoaMark(FEIJOA_AT[0], FEIJOA_AT[1], {
    scale: FEIJOA_SCALE, rotate: FEIJOA_ROTATE, growFrom: FEIJOA_GROW_FROM,
    strokeWidth: FEIJOA_STROKE, delayMs: feijoaDelay, drawMs: T.feijoa_w * s,
  }))

  // The mark can run past the nominal duration on the slower orders — report what it actually takes.
  const durationSec = Math.max(duration, endOf(acts) / 1000)

  return { id, title, width: LOGO_W, height: LOGO_H, durationSec, acts }
}

// Latest point at which any act has finished drawing.
function endOf(acts: SketchAct[]): number {
  return acts.reduce((max, a) => {
    const t = a as { delayMs?: number; drawMs?: number }
    return Math.max(max, (t.delayMs ?? 0) + (t.drawMs ?? 0))
  }, 0)
}
