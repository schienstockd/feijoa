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

// Colour schemes — each slot (cell1/cell2/cell3, corresponding to the blue/orange/yellow
// positions on canvas left-to-right) has its own solid, mid-tone, dark nucleus, and track
// colour. The "soft" fill is now a mid-tone (30% pastel + 70% saturated blend) — sitting
// between fully saturated and pastel — per Dominik's ask.
export type ColourSchemeKey = 'classic' | 'cool' | 'warm' | 'vibrant' | 'muted' | 'mono_pink'

export interface CellColours { solid: string; soft: string; nuc: string; track: string }
export interface ColourScheme { cell1: CellColours; cell2: CellColours; cell3: CellColours }

export const SCHEMES: Record<ColourSchemeKey, ColourScheme> = {
  classic: {
    cell1: { solid: '#6fb8db', soft: '#90c7e2', nuc: '#3d7ea0', track: '#6fb8db' },
    cell2: { solid: '#f4a26a', soft: '#f6b78a', nuc: '#c07a4a', track: '#f4a26a' },
    cell3: { solid: '#d4de4a', soft: '#dce372', nuc: '#a5ad35', track: '#d4de4a' },
  },
  cool: {
    cell1: { solid: '#4fb3a5', soft: '#74c3b7', nuc: '#2e6b62', track: '#4fb3a5' },
    cell2: { solid: '#5590c8', soft: '#78a7d4', nuc: '#2e5a86', track: '#5590c8' },
    cell3: { solid: '#8968b8', soft: '#a387c8', nuc: '#523d75', track: '#8968b8' },
  },
  warm: {
    cell1: { solid: '#e05a4f', soft: '#e67d73', nuc: '#8f3229', track: '#e05a4f' },
    cell2: { solid: '#f0894a', soft: '#f3a371', nuc: '#985028', track: '#f0894a' },
    cell3: { solid: '#e8c94a', soft: '#edd46f', nuc: '#8f7a20', track: '#e8c94a' },
  },
  vibrant: {
    // Cell1 (inside window) = cyan; cell2 (middle) = lime; cell3 (right) = magenta.
    cell1: { solid: '#3fc3d6', soft: '#66cedd', nuc: '#1f7684', track: '#3fc3d6' },
    cell2: { solid: '#b8d63f', soft: '#c5de66', nuc: '#6f841f', track: '#b8d63f' },
    cell3: { solid: '#e63d8f', soft: '#ea65a5', nuc: '#8a1c56', track: '#e63d8f' },
  },
  muted: {
    cell1: { solid: '#7d9db0', soft: '#99b2c0', nuc: '#3f5866', track: '#7d9db0' },
    cell2: { solid: '#c68a6b', soft: '#d1a287', nuc: '#7a4a30', track: '#c68a6b' },
    cell3: { solid: '#a89f6c', soft: '#b8b187', nuc: '#5f5738', track: '#a89f6c' },
  },
  mono_pink: {
    cell1: { solid: '#e05a86', soft: '#e67c9e', nuc: '#8a2e50', track: '#e05a86' },
    cell2: { solid: '#e88ab0', soft: '#eda2bf', nuc: '#9d4e6f', track: '#e88ab0' },
    cell3: { solid: '#f0b8ce', soft: '#f3c7d8', nuc: '#a86f8b', track: '#f0b8ce' },
  },
}

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
}

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

  return { id, title, width: LOGO_W, height: LOGO_H, durationSec: duration, acts }
}
