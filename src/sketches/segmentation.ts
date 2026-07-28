// Segmentation — Cecelia uses cellpose (v3, pinned) to turn a fluorescence image into per-cell
// labels. Each cell gets a label id, an (x, y[, z]) centroid, and every regionprops/intensity
// measure it has. This is the entry point for the whole cell-level pipeline: everything
// downstream (tracking, gating, clustering, HMM) reads from the segmentation's .h5ad.
//
// Sketch: a single dark "image" panel packed with cells of varied shape (rotated + scaled
// differently). Each cell first appears as a soft-filled amoeboid blob (raw fluorescence);
// then a white outline traces that exact same shape (the segmentation mask); then a numeric
// label id pops in near each. Outline uses the same path as the blob — the segmentation is
// literally tracing the fluorescent object.
import type { SketchDefinition, SketchAct } from '../lib/types'
import { cellPath, scanningCellPath, SCHEME, STROKE } from './primitives'

// Image panel
const P_X = 60, P_Y = 45, P_W = 600, P_H = 285

type Slot = 'cell1' | 'cell2' | 'cell3'
interface CellSpec {
  p: [number, number]
  slot: Slot
  id: string
  morphology: 'migrating' | 'scanning'
  flip: boolean
  scale: number
  rotate: number   // degrees
}

function pathFor(c: CellSpec): string {
  return c.morphology === 'scanning'
    ? scanningCellPath(c.p[0], c.p[1], c.scale, c.rotate)
    : cellPath(c.p[0], c.p[1], c.scale, c.flip, c.rotate)
}

// Crowded field: a mix of migrating and sessile/scanning morphologies, arranged as several
// tight overlapping clusters (like cells that clumped together) plus scattered singles filling
// the gaps between — dense and irregular, reads like a real field of view, not cells on a grid.
// Numbered in rough reading order.
const CELLS: CellSpec[] = [
  // Cluster A — upper-left, 4 overlapping cells
  { p: [145, 115], slot: 'cell1', id: '1',  morphology: 'migrating', flip: false, scale: 0.55, rotate: -20  },
  { p: [192, 140], slot: 'cell2', id: '2',  morphology: 'migrating', flip: true,  scale: 0.48, rotate: 150  },
  { p: [158, 175], slot: 'cell3', id: '3',  morphology: 'migrating', flip: false, scale: 0.44, rotate: 60   },
  { p: [205, 185], slot: 'cell1', id: '4',  morphology: 'scanning',  flip: false, scale: 0.42, rotate: 20   },

  // Cluster B — upper-middle, 4 overlapping cells
  { p: [405, 90],  slot: 'cell2', id: '5',  morphology: 'migrating', flip: false, scale: 0.55, rotate: -60  },
  { p: [452, 112], slot: 'cell3', id: '6',  morphology: 'migrating', flip: true,  scale: 0.50, rotate: 110  },
  { p: [418, 148], slot: 'cell1', id: '7',  morphology: 'migrating', flip: false, scale: 0.46, rotate: 170  },
  { p: [465, 155], slot: 'cell2', id: '8',  morphology: 'scanning',  flip: false, scale: 0.44, rotate: 0    },

  // Scattered singles filling the gaps
  { p: [295, 95],  slot: 'cell3', id: '9',  morphology: 'migrating', flip: false, scale: 0.60, rotate: 30   },
  { p: [555, 80],  slot: 'cell1', id: '10', morphology: 'migrating', flip: true,  scale: 0.58, rotate: 95   },
  { p: [615, 140], slot: 'cell2', id: '11', morphology: 'migrating', flip: false, scale: 0.50, rotate: -40  },
  { p: [335, 190], slot: 'cell1', id: '12', morphology: 'migrating', flip: false, scale: 0.62, rotate: -70  },
  { p: [490, 205], slot: 'cell3', id: '13', morphology: 'migrating', flip: true,  scale: 0.50, rotate: 200  },

  // Cluster D — right-middle, 3 overlapping cells
  { p: [575, 195], slot: 'cell3', id: '14', morphology: 'migrating', flip: false, scale: 0.55, rotate: -100 },
  { p: [618, 220], slot: 'cell1', id: '15', morphology: 'migrating', flip: true,  scale: 0.46, rotate: 40   },
  { p: [585, 250], slot: 'cell2', id: '16', morphology: 'scanning',  flip: false, scale: 0.42, rotate: 60   },

  // Cluster C — lower-left, 3 overlapping cells
  { p: [135, 265], slot: 'cell2', id: '17', morphology: 'migrating', flip: true,  scale: 0.58, rotate: -150 },
  { p: [185, 290], slot: 'cell3', id: '18', morphology: 'migrating', flip: false, scale: 0.46, rotate: 60   },
  { p: [150, 310], slot: 'cell1', id: '19', morphology: 'scanning',  flip: false, scale: 0.42, rotate: 10   },

  // Scattered singles, lower band
  { p: [270, 300], slot: 'cell3', id: '20', morphology: 'migrating', flip: false, scale: 0.50, rotate: 45   },
  { p: [345, 255], slot: 'cell1', id: '21', morphology: 'scanning',  flip: false, scale: 0.50, rotate: 0    },
  { p: [440, 295], slot: 'cell2', id: '22', morphology: 'migrating', flip: true,  scale: 0.62, rotate: -30  },
  { p: [505, 270], slot: 'cell1', id: '23', morphology: 'migrating', flip: false, scale: 0.48, rotate: 160  },
]

export const segmentation: SketchDefinition = {
  id: 'segmentation',
  title: 'Segmentation',
  width: 720,
  height: 360,
  durationSec: 3.8,
  acts: [
    // Dark imaging panel — the raw fluorescence field
    { type: 'rect', at: [P_X, P_Y], size: [P_W, P_H], fill: 'stroke', fillStyle: 'solid', stroke: 'stroke', delayMs: 300, drawMs: 400 },

    // Raw fluorescence — same amoeboid shape the segmentation will trace, filled with the
    // mid-tone slot colour. No stroke: this is a diffuse signal, not yet a bounded cell.
    ...CELLS.map((c, i): SketchAct => ({
      type: 'path', d: pathFor(c),
      fill: SCHEME[c.slot].soft, fillStyle: 'solid',
      delayMs: 700 + i * 45, drawMs: 380,
    })),

    // "cellpose" note — hint at the transformation
    { type: 'text', at: [P_X + P_W - 88, P_Y + P_H - 12], value: '↳ cellpose', size: 11, colour: 'textDim', delayMs: 1350, drawMs: 300 },

    // Segmentation MASK — white outline tracing each blob's exact shape
    ...CELLS.map((c, i): SketchAct => ({
      type: 'path', d: pathFor(c),
      stroke: '#ffffff', strokeWidth: 2.5,
      delayMs: 1600 + i * 50, drawMs: 420,
    })),

    // Numeric label id near each cell — white, positioned top-right so it doesn't overlap
    // the cell body
    ...CELLS.map((c, i): SketchAct => ({
      type: 'text',
      at: [c.p[0] + 22 * c.scale, c.p[1] - 24 * c.scale],
      value: c.id,
      size: 12,
      weight: 700,
      colour: '#ffffff',
      delayMs: 2500 + i * 45, drawMs: 220,
    })),
  ],
}
