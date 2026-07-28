// Analysis board — cecelia's /analysis route lays plots out on "comic plate" pages (A4). Each
// plate holds a grid of tiles; each tile is a plot (bar, box, UMAP, heatmap, gating strategy).
// Boards are the report/figure surface — cross-image, publish-ready. See docs/ANALYSIS.md.
//
// Sketch: A4 page outline with a 2×2 grid of plot silhouettes (bar / box / scatter / heatmap)
// and an "export as PDF · SVG · CSV" note on the right.
import type { SketchDefinition } from '../lib/types'
import { SCHEME, STROKE } from './primitives'

// Page geometry — page tall enough to hold the 2×2 grid with visible bottom margin
const P_X = 130, P_Y = 55, P_W = 380, P_H = 285
// Tile geometry (2×2 inside page); tiles shorter so they don't overflow the page bottom
const T_W = 165, T_H = 105
const TL: [number, number] = [P_X + 20, P_Y + 40]
const TR: [number, number] = [P_X + 20 + T_W + 15, P_Y + 40]
const BL: [number, number] = [P_X + 20, P_Y + 40 + T_H + 15]
const BR: [number, number] = [P_X + 20 + T_W + 15, P_Y + 40 + T_H + 15]

export const analysisBoard: SketchDefinition = {
  id: 'analysis_board',
  title: 'Analysis board',
  width: 720,
  height: 360,
  durationSec: 3.6,
  acts: [
    // A4 page
    { type: 'rect', at: [P_X, P_Y], size: [P_W, P_H], fill: 'background', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 2, delayMs: 300, drawMs: 500 },
    { type: 'text', at: [P_X + 15, P_Y + 22], value: 'page 1', size: 11, colour: 'textDim', delayMs: 850, drawMs: 250 },

    // ── Tile 1 (top-left) — bar plot (cyan)
    { type: 'rect', at: TL, size: [T_W, T_H], stroke: 'stroke', strokeWidth: 1, fill: SCHEME.cell1.soft, fillStyle: 'solid', delayMs: 1000, drawMs: 400 },
    { type: 'rect', at: [TL[0] + 20, TL[1] + T_H - 42], size: [16, 32], fill: SCHEME.cell1.solid, fillStyle: 'solid', delayMs: 1400, drawMs: 250 },
    { type: 'rect', at: [TL[0] + 45, TL[1] + T_H - 55], size: [16, 45], fill: SCHEME.cell1.solid, fillStyle: 'solid', delayMs: 1450, drawMs: 250 },
    { type: 'rect', at: [TL[0] + 70, TL[1] + T_H - 78], size: [16, 68], fill: SCHEME.cell1.solid, fillStyle: 'solid', delayMs: 1500, drawMs: 250 },
    { type: 'rect', at: [TL[0] + 95, TL[1] + T_H - 60], size: [16, 50], fill: SCHEME.cell1.solid, fillStyle: 'solid', delayMs: 1550, drawMs: 250 },

    // ── Tile 2 (top-right) — box plot (lime)
    { type: 'rect', at: TR, size: [T_W, T_H], stroke: 'stroke', strokeWidth: 1, fill: SCHEME.cell2.soft, fillStyle: 'solid', delayMs: 1100, drawMs: 400 },
    { type: 'line', from: [TR[0] + 30, TR[1] + 20], to: [TR[0] + 30, TR[1] + T_H - 15], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 1500, drawMs: 250 },
    { type: 'rect', at: [TR[0] + 20, TR[1] + 55], size: [20, 30], fill: SCHEME.cell2.solid, fillStyle: 'solid', delayMs: 1600, drawMs: 250 },
    { type: 'line', from: [TR[0] + 75, TR[1] + 15], to: [TR[0] + 75, TR[1] + T_H - 20], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 1550, drawMs: 250 },
    { type: 'rect', at: [TR[0] + 65, TR[1] + 40], size: [20, 35], fill: SCHEME.cell2.solid, fillStyle: 'solid', delayMs: 1650, drawMs: 250 },
    { type: 'line', from: [TR[0] + 120, TR[1] + 30], to: [TR[0] + 120, TR[1] + T_H - 10], colour: 'stroke', strokeWidth: STROKE.thin, delayMs: 1600, drawMs: 250 },
    { type: 'rect', at: [TR[0] + 110, TR[1] + 60], size: [20, 30], fill: SCHEME.cell2.solid, fillStyle: 'solid', delayMs: 1700, drawMs: 250 },

    // ── Tile 3 (bottom-left) — UMAP scatter (three-colour mix)
    { type: 'rect', at: BL, size: [T_W, T_H], stroke: 'stroke', strokeWidth: 1, fill: '#f8f4ea', fillStyle: 'solid', delayMs: 1200, drawMs: 400 },
    { type: 'circle', at: [BL[0] + 40, BL[1] + 40], r: 5, fill: SCHEME.cell1.solid, fillStyle: 'solid', delayMs: 1750, drawMs: 200 },
    { type: 'circle', at: [BL[0] + 55, BL[1] + 55], r: 5, fill: SCHEME.cell1.solid, fillStyle: 'solid', delayMs: 1780, drawMs: 200 },
    { type: 'circle', at: [BL[0] + 45, BL[1] + 70], r: 5, fill: SCHEME.cell1.solid, fillStyle: 'solid', delayMs: 1810, drawMs: 200 },
    { type: 'circle', at: [BL[0] + 85, BL[1] + 35], r: 5, fill: SCHEME.cell2.solid, fillStyle: 'solid', delayMs: 1840, drawMs: 200 },
    { type: 'circle', at: [BL[0] + 100, BL[1] + 50], r: 5, fill: SCHEME.cell2.solid, fillStyle: 'solid', delayMs: 1870, drawMs: 200 },
    { type: 'circle', at: [BL[0] + 110, BL[1] + 70], r: 5, fill: SCHEME.cell2.solid, fillStyle: 'solid', delayMs: 1900, drawMs: 200 },
    { type: 'circle', at: [BL[0] + 130, BL[1] + 55], r: 5, fill: SCHEME.cell3.solid, fillStyle: 'solid', delayMs: 1930, drawMs: 200 },
    { type: 'circle', at: [BL[0] + 140, BL[1] + 85], r: 5, fill: SCHEME.cell3.solid, fillStyle: 'solid', delayMs: 1960, drawMs: 200 },
    { type: 'circle', at: [BL[0] + 115, BL[1] + 95], r: 5, fill: SCHEME.cell3.solid, fillStyle: 'solid', delayMs: 1990, drawMs: 200 },

    // ── Tile 4 (bottom-right) — heatmap 3×3
    { type: 'rect', at: BR, size: [T_W, T_H], stroke: 'stroke', strokeWidth: 1, fill: 'background', fillStyle: 'solid', delayMs: 1300, drawMs: 400 },
    { type: 'rect', at: [BR[0] + 20, BR[1] + 20], size: [40, 25], fill: '#efefec', fillStyle: 'solid', delayMs: 2100, drawMs: 200 },
    { type: 'rect', at: [BR[0] + 62, BR[1] + 20], size: [40, 25], fill: 'accent',   fillStyle: 'solid', delayMs: 2100, drawMs: 200 },
    { type: 'rect', at: [BR[0] + 104, BR[1] + 20], size: [40, 25], fill: '#efefec', fillStyle: 'solid', delayMs: 2100, drawMs: 200 },
    { type: 'rect', at: [BR[0] + 20, BR[1] + 47], size: [40, 25], fill: 'accent',   fillStyle: 'solid', delayMs: 2150, drawMs: 200 },
    { type: 'rect', at: [BR[0] + 62, BR[1] + 47], size: [40, 25], fill: '#efefec', fillStyle: 'solid', delayMs: 2150, drawMs: 200 },
    { type: 'rect', at: [BR[0] + 104, BR[1] + 47], size: [40, 25], fill: '#efefec', fillStyle: 'solid', delayMs: 2150, drawMs: 200 },
    { type: 'rect', at: [BR[0] + 20, BR[1] + 74], size: [40, 25], fill: '#efefec', fillStyle: 'solid', delayMs: 2200, drawMs: 200 },
    { type: 'rect', at: [BR[0] + 62, BR[1] + 74], size: [40, 25], fill: '#efefec', fillStyle: 'solid', delayMs: 2200, drawMs: 200 },
    { type: 'rect', at: [BR[0] + 104, BR[1] + 74], size: [40, 25], fill: 'accent',  fillStyle: 'solid', delayMs: 2200, drawMs: 200 },

    // Export hint on the right side of the canvas
    { type: 'text', at: [545, 170], value: 'export as', size: 12, colour: 'textDim', delayMs: 2700, drawMs: 300 },
    { type: 'text', at: [545, 195], value: 'PDF · SVG · CSV', size: 13, weight: 700, colour: 'accent', delayMs: 2900, drawMs: 350 },
  ],
}
