// Segmentation — Cecelia uses cellpose (v3, pinned) to turn a fluorescence image into per-cell
// labels. Each cell gets a label id, an (x, y[, z]) centroid, and every regionprops/intensity
// measure it has. This is the entry point for the whole cell-level pipeline: everything
// downstream (tracking, gating, clustering, HMM) reads from the segmentation's .h5ad.
// The sketch shows a foggy fluorescence blob → sharp cell outlines + label ids.
import type { SketchDefinition } from '../lib/types'

export const segmentation: SketchDefinition = {
  id: 'segmentation',
  title: 'Segmentation',
  width: 640,
  height: 340,
  durationSec: 4.0,
  acts: [
    { type: 'text', at: [30, 34], value: 'Segmentation', size: 22, weight: 700, delayMs: 0, drawMs: 400 },
    { type: 'text', at: [30, 58], value: 'cellpose finds each cell — labels feed everything downstream', size: 13, colour: 'textDim', delayMs: 200, drawMs: 400 },

    // ── Left: raw fluorescence — soft blobs, no outlines
    { type: 'text', at: [80, 100], value: 'raw', size: 12, colour: 'textDim', delayMs: 500, drawMs: 300 },
    { type: 'rect', at: [60, 115], size: [220, 180], fill: 'stroke', stroke: 'stroke', delayMs: 600, drawMs: 500 },
    // Foggy blobs — soft ellipses with no stroke
    { type: 'ellipse', at: [110, 175], size: [55, 45], fill: 'blue',   delayMs: 800,  drawMs: 500 },
    { type: 'ellipse', at: [190, 165], size: [50, 50], fill: 'orange', delayMs: 900,  drawMs: 500 },
    { type: 'ellipse', at: [155, 235], size: [60, 45], fill: 'yellow', delayMs: 1000, drawMs: 500 },
    { type: 'ellipse', at: [230, 240], size: [45, 45], fill: 'blue',   delayMs: 1100, drawMs: 500 },

    // Arrow — cellpose
    { type: 'arrow', from: [305, 200], to: [355, 200], colour: 'accent', delayMs: 1900, drawMs: 400 },
    { type: 'text', at: [305, 190], value: 'cellpose', size: 11, colour: 'textDim', delayMs: 2000, drawMs: 300 },

    // ── Right: labels — sharp outlines + numeric ids
    { type: 'text', at: [400, 100], value: 'labels', size: 12, colour: 'textDim', delayMs: 2200, drawMs: 300 },
    { type: 'rect', at: [380, 115], size: [220, 180], fill: 'background', stroke: 'stroke', strokeWidth: 2, delayMs: 2300, drawMs: 500 },
    // Sharp cell outlines matching the raw blobs
    { type: 'ellipse', at: [430, 175], size: [55, 45], stroke: 'blue',   strokeWidth: 2, delayMs: 2500, drawMs: 500 },
    { type: 'text',    at: [425, 180], value: '1', size: 12, weight: 700, colour: 'blue',   delayMs: 3000, drawMs: 300 },
    { type: 'ellipse', at: [510, 165], size: [50, 50], stroke: 'orange', strokeWidth: 2, delayMs: 2600, drawMs: 500 },
    { type: 'text',    at: [505, 170], value: '2', size: 12, weight: 700, colour: 'orange', delayMs: 3100, drawMs: 300 },
    { type: 'ellipse', at: [475, 235], size: [60, 45], stroke: 'yellow', strokeWidth: 2, delayMs: 2700, drawMs: 500 },
    { type: 'text',    at: [470, 240], value: '3', size: 12, weight: 700, colour: 'yellow', delayMs: 3200, drawMs: 300 },
    { type: 'ellipse', at: [550, 240], size: [45, 45], stroke: 'blue',   strokeWidth: 2, delayMs: 2800, drawMs: 500 },
    { type: 'text',    at: [546, 244], value: '4', size: 12, weight: 700, colour: 'blue',   delayMs: 3300, drawMs: 300 },
  ],
}
