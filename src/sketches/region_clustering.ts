// Region clustering — spatial clustering of cells by their neighbourhood composition. Each
// region is a spatial patch whose local cell-mix looks similar; cells inside a region keep
// their own phenotype but share a region label. See docs/todo/SPATIAL_REGIONS_PLAN.md.
// Sketch: multiple cell types (blue / orange / yellow) scattered across the image, with
// three soft coloured washes underneath showing the discovered regions.
import type { SketchDefinition } from '../lib/types'

export const regionClustering: SketchDefinition = {
  id: 'region_clustering',
  title: 'Region clustering',
  width: 720,
  height: 360,
  durationSec: 4.2,
  acts: [
    // ── Region washes (soft, behind everything) — three spatial patches with different mixes
    { type: 'ellipse', at: [220, 170], size: [280, 200], fill: 'soft2', stroke: 'blue',   strokeWidth: 2, delayMs: 500,  drawMs: 800 },
    { type: 'ellipse', at: [500, 150], size: [220, 160], fill: 'soft3', stroke: 'orange', strokeWidth: 2, delayMs: 700,  drawMs: 800 },
    { type: 'ellipse', at: [420, 300], size: [260, 130], fill: 'soft4', stroke: 'yellow', strokeWidth: 2, delayMs: 900,  drawMs: 800 },

    // Region labels — corners of each wash
    { type: 'text', at: [95, 110],  value: 'region 1', size: 12, weight: 600, colour: 'blue',   delayMs: 1500, drawMs: 300 },
    { type: 'text', at: [560, 100], value: 'region 2', size: 12, weight: 600, colour: 'orange', delayMs: 1600, drawMs: 300 },
    { type: 'text', at: [550, 355], value: 'region 3', size: 12, weight: 600, colour: 'yellow', delayMs: 1700, drawMs: 300 },

    // ── Cells (on top) — mix of phenotypes across regions; region tells you the NEIGHBOURHOOD,
    // not the cell's own type. Each region has a characteristic mix.
    // Region 1 — mostly blue, some orange
    { type: 'circle', at: [140, 130], r: 6, fill: 'blue',   fillStyle: 'solid', stroke: 'stroke', delayMs: 2000, drawMs: 200 },
    { type: 'circle', at: [180, 160], r: 6, fill: 'blue',   fillStyle: 'solid', stroke: 'stroke', delayMs: 2050, drawMs: 200 },
    { type: 'circle', at: [220, 140], r: 6, fill: 'blue',   fillStyle: 'solid', stroke: 'stroke', delayMs: 2100, drawMs: 200 },
    { type: 'circle', at: [160, 200], r: 6, fill: 'orange', fillStyle: 'solid', stroke: 'stroke', delayMs: 2150, drawMs: 200 },
    { type: 'circle', at: [270, 175], r: 6, fill: 'blue',   fillStyle: 'solid', stroke: 'stroke', delayMs: 2200, drawMs: 200 },
    { type: 'circle', at: [310, 200], r: 6, fill: 'blue',   fillStyle: 'solid', stroke: 'stroke', delayMs: 2250, drawMs: 200 },
    { type: 'circle', at: [245, 220], r: 6, fill: 'orange', fillStyle: 'solid', stroke: 'stroke', delayMs: 2300, drawMs: 200 },

    // Region 2 — mostly orange, some yellow
    { type: 'circle', at: [450, 130], r: 6, fill: 'orange', fillStyle: 'solid', stroke: 'stroke', delayMs: 2400, drawMs: 200 },
    { type: 'circle', at: [500, 110], r: 6, fill: 'orange', fillStyle: 'solid', stroke: 'stroke', delayMs: 2450, drawMs: 200 },
    { type: 'circle', at: [540, 140], r: 6, fill: 'orange', fillStyle: 'solid', stroke: 'stroke', delayMs: 2500, drawMs: 200 },
    { type: 'circle', at: [575, 115], r: 6, fill: 'yellow', fillStyle: 'solid', stroke: 'stroke', delayMs: 2550, drawMs: 200 },
    { type: 'circle', at: [485, 170], r: 6, fill: 'orange', fillStyle: 'solid', stroke: 'stroke', delayMs: 2600, drawMs: 200 },
    { type: 'circle', at: [560, 185], r: 6, fill: 'orange', fillStyle: 'solid', stroke: 'stroke', delayMs: 2650, drawMs: 200 },

    // Region 3 — mixed yellow + blue at the bottom
    { type: 'circle', at: [350, 290], r: 6, fill: 'yellow', fillStyle: 'solid', stroke: 'stroke', delayMs: 2750, drawMs: 200 },
    { type: 'circle', at: [400, 310], r: 6, fill: 'yellow', fillStyle: 'solid', stroke: 'stroke', delayMs: 2800, drawMs: 200 },
    { type: 'circle', at: [450, 285], r: 6, fill: 'yellow', fillStyle: 'solid', stroke: 'stroke', delayMs: 2850, drawMs: 200 },
    { type: 'circle', at: [500, 315], r: 6, fill: 'blue',   fillStyle: 'solid', stroke: 'stroke', delayMs: 2900, drawMs: 200 },
    { type: 'circle', at: [540, 290], r: 6, fill: 'yellow', fillStyle: 'solid', stroke: 'stroke', delayMs: 2950, drawMs: 200 },
    { type: 'circle', at: [370, 335], r: 6, fill: 'yellow', fillStyle: 'solid', stroke: 'stroke', delayMs: 3000, drawMs: 200 },
    { type: 'circle', at: [430, 340], r: 6, fill: 'blue',   fillStyle: 'solid', stroke: 'stroke', delayMs: 3050, drawMs: 200 },
  ],
}
