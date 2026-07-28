// Region clustering — spatial clustering of cells by their neighbourhood composition. Each
// region is a spatial patch whose local cell-mix looks similar; cells inside keep their own
// phenotype but share a region label. See docs/todo/SPATIAL_REGIONS_PLAN.md.
//
// Real region-clustering figures (CytoMAP-style) are dense XY scatter plots of individual
// cells coloured by region membership — the "regions" are just where same-coloured dots are
// locally dense, with organic, intermixing, non-convex boundaries. NOT painted/outlined
// patches — an earlier version of this sketch drew hard-edged blobs and it read completely
// wrong. Rebuilt as: a dense procedural dot scatter, region assignment = nearest seed point
// PLUS a smooth pseudo-noise perturbation (so boundaries wiggle and interleave instead of
// forming clean Voronoi cells), framed like a plot, with one triangle marker per region
// (the anchor cell whose neighbourhood composition defines that region).
import type { SketchDefinition, SketchAct } from '../lib/types'
import { SCHEME } from './primitives'

type Slot = 'cell1' | 'cell2' | 'cell3'

// ── Plot panel
const P_X = 40, P_Y = 60, P_W = 640, P_H = 275

// ── Compact legend — small dot + label per region, top strip (NOT big composition swatches;
// the scatter itself is the content here).
const LEGEND: Array<{ slot: Slot; label: string; x: number }> = [
  { slot: 'cell1', label: 'region 1', x: 40 },
  { slot: 'cell2', label: 'region 2', x: 220 },
  { slot: 'cell3', label: 'region 3', x: 400 },
]
const LEG_Y = 28

// ── Region seeds — irregular spread, not a neat grid.
const REGIONS: Array<{ slot: Slot; seed: [number, number] }> = [
  { slot: 'cell1', seed: [175, 155] },
  { slot: 'cell2', seed: [430, 120] },
  { slot: 'cell3', seed: [520, 260] },
]

// Deterministic smooth pseudo-noise (summed sinusoids — no Perlin lib needed) so region
// boundaries wiggle and interleave instead of forming clean Voronoi edges.
function noise2(x: number, y: number, seed: number): number {
  return (
    Math.sin(x * 0.021 + seed * 1.7) * Math.cos(y * 0.017 + seed * 0.9) +
    Math.sin(x * 0.011 - y * 0.013 + seed * 3.1) * 0.6 +
    Math.sin((x + y) * 0.008 + seed * 5.3) * 0.4
  )
}
const NOISE_AMP = 75

function assignRegion(x: number, y: number): Slot {
  let best = 0, bestScore = Infinity
  REGIONS.forEach((r, i) => {
    const dx = x - r.seed[0], dy = y - r.seed[1]
    const score = Math.sqrt(dx * dx + dy * dy) + noise2(x, y, i * 13 + 7) * NOISE_AMP
    if (score < bestScore) { bestScore = score; best = i }
  })
  return REGIONS[best].slot
}

// Deterministic seeded RNG (mulberry32) — hand-authoring hundreds of dot coordinates doesn't
// scale; a fixed seed keeps the sketch reproducible across reloads.
function mulberry32(seed: number): () => number {
  let t = seed
  return () => {
    t |= 0; t = (t + 0x6d2b79f5) | 0
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

const N_DOTS = 450
const DOT_R = 3.4
const rng = mulberry32(20260728)
const DOTS: Array<{ p: [number, number]; slot: Slot }> = []
for (let i = 0; i < N_DOTS; i++) {
  const x = P_X + 12 + rng() * (P_W - 24)
  const y = P_Y + 12 + rng() * (P_H - 24)
  let slot = assignRegion(x, y)
  // occasional stray from a neighbouring region — real neighbourhoods interleave at the edges
  if (rng() < 0.06) slot = REGIONS[Math.floor(rng() * REGIONS.length)].slot
  DOTS.push({ p: [x, y], slot })
}

export const regionClustering: SketchDefinition = {
  id: 'region_clustering',
  title: 'Region clustering',
  width: 720,
  height: 360,
  durationSec: 4.2,
  acts: [
    // ══ Compact legend row
    ...LEGEND.flatMap((L, i): SketchAct[] => {
      const base = 200 + i * 120
      return [
        { type: 'circle', at: [L.x, LEG_Y], r: 7,
          fill: SCHEME[L.slot].solid, fillStyle: 'solid',
          stroke: SCHEME[L.slot].solid, strokeWidth: 0.5,
          delayMs: base, drawMs: 250 } as SketchAct,
        { type: 'text', at: [L.x + 14, LEG_Y + 5], value: L.label,
          size: 13, weight: 600, colour: SCHEME[L.slot].nuc,
          delayMs: base + 100, drawMs: 250 } as SketchAct,
      ]
    }),

    // ══ Plot frame
    { type: 'rect', at: [P_X, P_Y], size: [P_W, P_H], stroke: 'stroke', strokeWidth: 1.5, delayMs: 700, drawMs: 400 },

    // ══ Dense dot scatter — the region IS the local dot density, not a drawn shape
    ...DOTS.map((d, i): SketchAct => ({
      type: 'circle', at: d.p, r: DOT_R,
      fill: SCHEME[d.slot].solid, fillStyle: 'solid',
      stroke: SCHEME[d.slot].solid, strokeWidth: 0.4,
      delayMs: 1100 + i * 3, drawMs: 90,
    })),
  ],
}
