// In-app track stats + tracks in napari — the pairing that motivates most of cecelia's tracking
// module. Behaviour stats (state proportions per group) sit on module summary plots; the tracks
// themselves are best viewed as coloured polylines over the raw image in napari.
//
// Sketch splits: LEFT = mini stacked bar of state proportions per group; RIGHT = dark napari
// canvas with three immune cells over fluorescence blobs, each dragging a wavy track.
import type { SketchDefinition } from '../lib/types'
import { immuneCell, SCHEME, STROKE } from './primitives'

// Panel geometry
const L_X = 40,   L_W = 260, L_TITLE_Y = 100
const R_X = 320,  R_W = 370, R_TITLE_Y = 100, R_Y = 115, R_H = 205

// Bar column positions (LEFT panel)
const BAR_W = 42
const BAR_A = 78, BAR_B = 148, BAR_C = 218
const AXIS_Y = 305, TOP_Y = 130
const H = AXIS_Y - TOP_Y   // usable bar height 175

// Fluorescence blob positions (RIGHT panel)
const BLOBS: Array<{ p: [number, number]; slot: 'cell1' | 'cell2' | 'cell3' }> = [
  { p: [385, 175], slot: 'cell1' },
  { p: [500, 200], slot: 'cell2' },
  { p: [615, 180], slot: 'cell3' },
]

export const napariTracks: SketchDefinition = {
  id: 'napari_tracks',
  title: 'Track stats + napari tracks',
  width: 720,
  height: 360,
  durationSec: 4.0,
  acts: [
    // ══ LEFT panel — behaviour-state stacked bars per group
    { type: 'text', at: [L_X, L_TITLE_Y], value: 'behaviour stats', size: 12, colour: 'textDim', delayMs: 300, drawMs: 300 },
    { type: 'line', from: [L_X + 10, AXIS_Y], to: [L_X + L_W - 10, AXIS_Y], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 500, drawMs: 300 },
    { type: 'line', from: [L_X + 10, AXIS_Y], to: [L_X + 10, TOP_Y], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 500, drawMs: 300 },

    // Group A — mostly arrested (cyan), some directed (lime), little meandering (magenta)
    { type: 'rect', at: [BAR_A, AXIS_Y - 0.55 * H], size: [BAR_W, 0.55 * H], fill: SCHEME.cell1.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 900,  drawMs: 350 },
    { type: 'rect', at: [BAR_A, AXIS_Y - 0.80 * H], size: [BAR_W, 0.25 * H], fill: SCHEME.cell2.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 1000, drawMs: 350 },
    { type: 'rect', at: [BAR_A, AXIS_Y - 0.95 * H], size: [BAR_W, 0.15 * H], fill: SCHEME.cell3.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 1100, drawMs: 350 },
    { type: 'text', at: [BAR_A + 15, AXIS_Y + 20], value: 'A', size: 13, weight: 700, colour: 'textDim', delayMs: 1200, drawMs: 200 },

    // Group B — balanced
    { type: 'rect', at: [BAR_B, AXIS_Y - 0.30 * H], size: [BAR_W, 0.30 * H], fill: SCHEME.cell1.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 1000, drawMs: 350 },
    { type: 'rect', at: [BAR_B, AXIS_Y - 0.60 * H], size: [BAR_W, 0.30 * H], fill: SCHEME.cell2.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 1100, drawMs: 350 },
    { type: 'rect', at: [BAR_B, AXIS_Y - 0.90 * H], size: [BAR_W, 0.30 * H], fill: SCHEME.cell3.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 1200, drawMs: 350 },
    { type: 'text', at: [BAR_B + 15, AXIS_Y + 20], value: 'B', size: 13, weight: 700, colour: 'textDim', delayMs: 1300, drawMs: 200 },

    // Group C — mostly directed (lime)
    { type: 'rect', at: [BAR_C, AXIS_Y - 0.12 * H], size: [BAR_W, 0.12 * H], fill: SCHEME.cell1.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 1100, drawMs: 350 },
    { type: 'rect', at: [BAR_C, AXIS_Y - 0.75 * H], size: [BAR_W, 0.63 * H], fill: SCHEME.cell2.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 1200, drawMs: 350 },
    { type: 'rect', at: [BAR_C, AXIS_Y - 0.95 * H], size: [BAR_W, 0.20 * H], fill: SCHEME.cell3.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 1300, drawMs: 350 },
    { type: 'text', at: [BAR_C + 15, AXIS_Y + 20], value: 'C', size: 13, weight: 700, colour: 'textDim', delayMs: 1400, drawMs: 200 },

    // ══ RIGHT panel — napari view: dark canvas + fluorescence blobs + immune cells + tracks
    { type: 'text', at: [R_X, R_TITLE_Y], value: 'napari', size: 12, colour: 'textDim', delayMs: 1700, drawMs: 300 },
    { type: 'rect', at: [R_X, R_Y], size: [R_W, R_H], fill: 'stroke', fillStyle: 'solid', stroke: 'stroke', delayMs: 1800, drawMs: 400 },

    // Foggy fluorescence blobs behind each cell — soft ellipse, no stroke
    ...BLOBS.map((b, i): import('../lib/types').SketchAct => ({
      type: 'ellipse', at: b.p, size: [55, 45], fill: SCHEME[b.slot].soft, fillStyle: 'solid',
      delayMs: 2100 + i * 100, drawMs: 400,
    })),

    // Track polylines from each cell trailing off
    { type: 'path', d: 'M 385 175 L 395 200 L 415 220 L 405 250 L 420 275', stroke: SCHEME.cell1.track, strokeWidth: STROKE.track, delayMs: 2600, drawMs: 700 },
    { type: 'path', d: 'M 500 200 L 530 205 L 555 195 L 580 205 L 605 200', stroke: SCHEME.cell2.track, strokeWidth: STROKE.track, delayMs: 2700, drawMs: 700 },
    { type: 'path', d: 'M 615 180 L 625 205 L 600 230 L 625 258 L 605 285', stroke: SCHEME.cell3.track, strokeWidth: STROKE.track, delayMs: 2800, drawMs: 700 },

    // Immune cells at the head of each track — small scale. `rotate` points the nose along
    // that track's own first segment (flip:true puts the nose at 0°/east before rotating), so
    // the cell actually faces the way its track runs instead of a fixed direction.
    ...immuneCell(BLOBS[0].p[0], BLOBS[0].p[1], { slot: 'cell1', scale: 0.55, flip: true, rotate: 68, cellDelayMs: 2300, cellDrawMs: 300, nucDelayMs: 2450, nucDrawMs: 200 }),
    ...immuneCell(BLOBS[1].p[0], BLOBS[1].p[1], { slot: 'cell2', scale: 0.55, flip: true, rotate: 9,  cellDelayMs: 2400, cellDrawMs: 300, nucDelayMs: 2550, nucDrawMs: 200 }),
    ...immuneCell(BLOBS[2].p[0], BLOBS[2].p[1], { slot: 'cell3', scale: 0.55, flip: true, rotate: 68, cellDelayMs: 2500, cellDrawMs: 300, nucDelayMs: 2650, nucDrawMs: 200 }),
  ],
}
