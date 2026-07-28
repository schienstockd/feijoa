// Cluster labels → populations — cells cluster in feature space (Leiden on scanpy graph); each
// cluster gets an integer label written back to obs. A cluster can be promoted to a named
// population via a sidecar. See docs/POPULATION.md.
//
// Sketch: three coloured cluster blobs in a UMAP-ish scatter; one cluster gets a pink
// selection ring and is exported to a population chip on the right.
import type { SketchDefinition, SketchAct } from '../lib/types'
import { SCHEME, STROKE } from './primitives'

type Slot = 'cell1' | 'cell2' | 'cell3'
const DOT_R = 8

function cluster(centers: [number, number][], slot: Slot, delayBase: number): SketchAct[] {
  return centers.map((p, i) => ({
    type: 'circle', at: p, r: DOT_R,
    fill: SCHEME[slot].soft, fillStyle: 'solid',
    stroke: 'stroke', strokeWidth: STROKE.thin,
    delayMs: delayBase + i * 40, drawMs: 200,
  }))
}

// Three clusters — target (cell3, magenta) is the rightmost so the arrow reads left→right.
const C1: [number, number][] = [[140, 155], [175, 138], [160, 178], [200, 160], [175, 195]]
const C2: [number, number][] = [[220, 260], [255, 240], [240, 275], [285, 258], [270, 290]]
const C3: [number, number][] = [[380, 155], [415, 138], [400, 178], [440, 160], [420, 195]]

export const clusters: SketchDefinition = {
  id: 'clusters',
  title: 'Cluster labels → populations',
  width: 720,
  height: 360,
  durationSec: 3.8,
  acts: [
    // Three cluster blobs
    ...cluster(C1, 'cell1', 500),
    ...cluster(C2, 'cell2', 750),
    ...cluster(C3, 'cell3', 1000),

    // Selection ring around the magenta cluster
    { type: 'ellipse', at: [410, 165], size: [130, 95], stroke: 'accent', strokeWidth: STROKE.cell, delayMs: 1600, drawMs: 700 },

    // Arrow out to the population chip
    { type: 'arrow', from: [480, 165], to: [530, 165], colour: 'accent', strokeWidth: 3, delayMs: 2500, drawMs: 400 },

    // Population chip
    { type: 'rect', at: [540, 138], size: [130, 56], fill: SCHEME.cell3.soft, fillStyle: 'solid', stroke: SCHEME.cell3.solid, strokeWidth: 2.5, delayMs: 2900, drawMs: 400 },
    { type: 'text', at: [560, 172], value: 'pop A', size: 16, weight: 700, colour: SCHEME.cell3.nuc, delayMs: 3200, drawMs: 300 },
  ],
}
