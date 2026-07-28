// The feijoa fruit mark — the project's namesake, drawn in the same idiom as everything else
// here (bold ink outline, soft pastel fills, slightly irregular hand-drawn geometry).
//
// Shown as a CUT half rather than a whole fruit: a whole feijoa is just a green egg and reads as
// any generic fruit, whereas the cut face — green skin ring, pale flesh, translucent seeded gel
// centre — is unmistakable, and the ring/pale-centre contrast is what survives at small sizes.
// This is the same geometry as the Cecelia app icon (cecelia-feijoa/frontend/public/feijoa.svg);
// keep the two in step if either changes.
import type { SketchAct } from '../lib/types'
import { blobPath, ovalAnchors, rotateAbout } from './geom'
import { SCHEMES } from './schemes'

const LIME = SCHEMES.vibrant.cell2      // solid / soft / nuc — the lime slot
const SEED_FILL = '#6d5326'
const FLESH_FILL = '#f0f0ee'            // same pale tone as the cell nuclei

// Radii are expressed against a nominal 64-unit mark, then scaled by `scale`.
const R_SKIN: [number, number] = [23, 26]
const R_FLESH: [number, number] = [17.5, 20.5]
const R_GEL: [number, number] = [9.5, 12.5]
// Seed offsets as a fraction of the gel radii.
const SEED_OFFSETS: Array<[number, number]> = [
  [0, -1.0], [-0.85, -0.15], [0.85, -0.15], [-0.55, 0.85], [0.55, 0.85],
]

export interface FeijoaMarkOpts {
  scale?: number          // 1 = the nominal 64-unit mark
  rotate?: number         // degrees, positive = clockwise
  delayMs?: number
  drawMs?: number
  strokeWidth?: number    // outer skin outline; inner strokes scale off this
  // If set, the whole mark "pings" in — scaling up from this factor, overshooting, settling back.
  // Every part then shares one delay so the fruit lands as a single object instead of the parts
  // arriving one by one (which is what the staggered default does).
  growFrom?: number
}

// Returns the acts for one feijoa mark centred on (cx, cy). Drawn outermost-first so the flesh,
// gel and seeds layer over the skin.
export function feijoaMark(cx: number, cy: number, opts: FeijoaMarkOpts = {}): SketchAct[] {
  const { scale = 1, rotate = 0, delayMs, drawMs = 400, strokeWidth = 3, growFrom } = opts

  const ring = (r: [number, number], jitter: number, phase: number) =>
    blobPath(rotateAbout(
      ovalAnchors(cx, cy, r[0] * scale, r[1] * scale, jitter, phase), cx, cy, rotate))

  // When pinging, every part shares the mark's delay + duration and scales about the fruit
  // centre, so the whole thing arrives as one object.
  const ping = growFrom === undefined ? undefined : { growFrom, growAbout: [cx, cy] as [number, number] }
  const at = (offset: number, dur: number) =>
    ping
      ? { delayMs, drawMs, ...ping }
      : { delayMs: delayMs === undefined ? undefined : delayMs + offset, drawMs: dur }

  const acts: SketchAct[] = [
    { type: 'path', d: ring(R_SKIN, 0.045, 0.6),
      fill: LIME.soft, fillStyle: 'solid', stroke: 'stroke', strokeWidth,
      ...at(0, drawMs) },
    { type: 'path', d: ring(R_FLESH, 0.05, 2.1),
      fill: FLESH_FILL, fillStyle: 'solid', stroke: 'stroke', strokeWidth: strokeWidth * 0.53,
      ...at(drawMs * 0.35, drawMs * 0.8) },
    { type: 'path', d: ring(R_GEL, 0.07, 4.2),
      fill: LIME.solid, fillStyle: 'hachure', stroke: LIME.nuc, strokeWidth: strokeWidth * 0.4,
      ...at(drawMs * 0.55, drawMs * 0.7) },
  ]

  // Seeds — rotated with the fruit so they sit in the gel however the mark is angled.
  const seedPts = rotateAbout(
    SEED_OFFSETS.map(([dx, dy]) =>
      [cx + dx * R_GEL[0] * 0.55 * scale, cy + dy * R_GEL[1] * 0.53 * scale] as [number, number]),
    cx, cy, rotate)
  seedPts.forEach(([sx, sy], i) => {
    acts.push({
      type: 'ellipse', at: [sx, sy], size: [4 * scale, 5.4 * scale],
      fill: SEED_FILL, fillStyle: 'solid', stroke: SEED_FILL, strokeWidth: 0.5,
      ...at(drawMs * 0.75 + i * 45, drawMs * 0.35),
    })
  })

  // Calyx nub at the blossom end — placed on the mark's "north" before rotation.
  const [nx, ny] = rotateAbout([[cx, cy - 28.5 * scale]], cx, cy, rotate)[0]
  acts.push({
    type: 'ellipse', at: [nx, ny], size: [7.5 * scale, 9 * scale],
    fill: LIME.nuc, fillStyle: 'solid', stroke: 'stroke', strokeWidth: strokeWidth * 0.53,
    ...at(drawMs * 0.15, drawMs * 0.6),
  })

  return acts
}
