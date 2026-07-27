// Analysis board — cecelia's /analysis route lays plots out on "comic plate" pages (A4). Each
// plate holds a grid of tiles; each tile is a plot (bar, box, UMAP, heatmap, gating strategy).
// Boards are the report/figure surface — cross-image, publish-ready. See docs/ANALYSIS.md.
// Sketch: an A4 page outline with a 2×2 grid of plot silhouettes.
import type { SketchDefinition } from '../lib/types'

export const analysisBoard: SketchDefinition = {
  id: 'analysis_board',
  title: 'Analysis board',
  width: 620,
  height: 360,
  durationSec: 4.0,
  acts: [

    // A4 page frame — portrait-ish, page background
    { type: 'rect', at: [180, 90], size: [260, 240], stroke: 'stroke', strokeWidth: 2, fill: 'background', delayMs: 600, drawMs: 700 },
    { type: 'text', at: [200, 110], value: 'page 1', size: 11, colour: 'textDim', delayMs: 1200, drawMs: 300 },

    // ── Tile 1 (top-left) — a bar plot silhouette
    { type: 'rect', at: [195, 120], size: [110, 90], stroke: 'stroke', strokeWidth: 1, fill: 'soft2', delayMs: 1400, drawMs: 500 },
    { type: 'rect', at: [210, 175], size: [12, 30], fill: 'blue',   fillStyle: 'solid', delayMs: 1700, drawMs: 300 },
    { type: 'rect', at: [230, 165], size: [12, 40], fill: 'blue',   fillStyle: 'solid', delayMs: 1750, drawMs: 300 },
    { type: 'rect', at: [250, 150], size: [12, 55], fill: 'blue',   fillStyle: 'solid', delayMs: 1800, drawMs: 300 },
    { type: 'rect', at: [270, 160], size: [12, 45], fill: 'blue',   fillStyle: 'solid', delayMs: 1850, drawMs: 300 },

    // ── Tile 2 (top-right) — box plot silhouette
    { type: 'rect', at: [315, 120], size: [110, 90], stroke: 'stroke', strokeWidth: 1, fill: 'soft1', delayMs: 1500, drawMs: 500 },
    { type: 'line', from: [335, 145], to: [335, 200], colour: 'stroke', delayMs: 1900, drawMs: 300 },
    { type: 'rect', at: [325, 170], size: [20, 20], fill: 'orange', fillStyle: 'solid', delayMs: 2000, drawMs: 300 },
    { type: 'line', from: [370, 135], to: [370, 205], colour: 'stroke', delayMs: 1950, drawMs: 300 },
    { type: 'rect', at: [360, 155], size: [20, 25], fill: 'orange', fillStyle: 'solid', delayMs: 2050, drawMs: 300 },
    { type: 'line', from: [405, 155], to: [405, 200], colour: 'stroke', delayMs: 2000, drawMs: 300 },
    { type: 'rect', at: [395, 170], size: [20, 20], fill: 'orange', fillStyle: 'solid', delayMs: 2100, drawMs: 300 },

    // ── Tile 3 (bottom-left) — UMAP scatter
    { type: 'rect', at: [195, 220], size: [110, 95], stroke: 'stroke', strokeWidth: 1, fill: 'soft4', delayMs: 1600, drawMs: 500 },
    { type: 'circle', at: [220, 250], r: 4, fill: 'blue',   fillStyle: 'solid', delayMs: 2200, drawMs: 200 },
    { type: 'circle', at: [235, 260], r: 4, fill: 'blue',   fillStyle: 'solid', delayMs: 2230, drawMs: 200 },
    { type: 'circle', at: [225, 275], r: 4, fill: 'blue',   fillStyle: 'solid', delayMs: 2260, drawMs: 200 },
    { type: 'circle', at: [260, 245], r: 4, fill: 'yellow', fillStyle: 'solid', delayMs: 2290, drawMs: 200 },
    { type: 'circle', at: [275, 260], r: 4, fill: 'yellow', fillStyle: 'solid', delayMs: 2320, drawMs: 200 },
    { type: 'circle', at: [285, 275], r: 4, fill: 'yellow', fillStyle: 'solid', delayMs: 2350, drawMs: 200 },
    { type: 'circle', at: [265, 290], r: 4, fill: 'orange', fillStyle: 'solid', delayMs: 2380, drawMs: 200 },
    { type: 'circle', at: [280, 295], r: 4, fill: 'orange', fillStyle: 'solid', delayMs: 2410, drawMs: 200 },

    // ── Tile 4 (bottom-right) — heatmap 3×3 (profile matrix)
    { type: 'rect', at: [315, 220], size: [110, 95], stroke: 'stroke', strokeWidth: 1, fill: 'background', delayMs: 1700, drawMs: 500 },
    { type: 'rect', at: [325, 230], size: [30, 25], fill: 'soft1', fillStyle: 'solid', delayMs: 2500, drawMs: 200 },
    { type: 'rect', at: [355, 230], size: [30, 25], fill: 'accent', fillStyle: 'solid', delayMs: 2500, drawMs: 200 },
    { type: 'rect', at: [385, 230], size: [30, 25], fill: 'soft1', fillStyle: 'solid', delayMs: 2500, drawMs: 200 },
    { type: 'rect', at: [325, 255], size: [30, 25], fill: 'accent', fillStyle: 'solid', delayMs: 2550, drawMs: 200 },
    { type: 'rect', at: [355, 255], size: [30, 25], fill: 'soft1', fillStyle: 'solid', delayMs: 2550, drawMs: 200 },
    { type: 'rect', at: [385, 255], size: [30, 25], fill: 'soft1', fillStyle: 'solid', delayMs: 2550, drawMs: 200 },
    { type: 'rect', at: [325, 280], size: [30, 25], fill: 'soft1', fillStyle: 'solid', delayMs: 2600, drawMs: 200 },
    { type: 'rect', at: [355, 280], size: [30, 25], fill: 'soft1', fillStyle: 'solid', delayMs: 2600, drawMs: 200 },
    { type: 'rect', at: [385, 280], size: [30, 25], fill: 'accent', fillStyle: 'solid', delayMs: 2600, drawMs: 200 },

    // Export hint
    { type: 'text', at: [460, 165], value: 'export as', size: 11, colour: 'textDim', delayMs: 3000, drawMs: 300 },
    { type: 'text', at: [460, 185], value: 'PDF · SVG · CSV', size: 12, weight: 600, colour: 'accent', delayMs: 3200, drawMs: 400 },
  ],
}
