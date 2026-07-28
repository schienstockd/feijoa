// Pure geometry helpers, no palette/type dependencies.
//
// Kept out of primitives.ts so that modules primitives.ts itself depends on — the logo trio
// (logo_common → logo_cascade_variants → primitives) — can use them without an import cycle.
// primitives.ts re-exports blobPath, so existing `from './primitives'` imports keep working.

// Generate a smooth closed-curve path through a set of anchor points (like a rounded polygon).
// Uses the "midpoint + quadratic" trick: the curve passes through the midpoint of each edge,
// with the anchor points acting as bezier control points — so the anchors become the "bulges"
// and the curve is continuously smooth. Handy for tissue-like patches, generic region blobs,
// or hand-shaped scatter clouds.
export function blobPath(anchors: Array<[number, number]>): string {
  const n = anchors.length
  if (n < 3) return ''
  const mid = (i: number): [number, number] => {
    const a = anchors[i], b = anchors[(i + 1) % n]
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  }
  const m0 = mid(n - 1)
  let d = `M ${m0[0]} ${m0[1]}`
  for (let i = 0; i < n; i++) {
    const m = mid(i)
    d += ` Q ${anchors[i][0]} ${anchors[i][1]}, ${m[0]} ${m[1]}`
  }
  return d + ' Z'
}

// An irregular oval as a ring of anchors — `jitter` breaks the machine-perfect arc so the
// resulting blobPath reads hand-drawn. `phase` varies the wobble between nested rings.
export function ovalAnchors(
  cx: number, cy: number, rx: number, ry: number,
  jitter = 0, phase = 0, n = 10,
): Array<[number, number]> {
  const pts: Array<[number, number]> = []
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n
    const j = 1 + jitter * Math.sin(3 * a + phase) * 0.5 + jitter * Math.sin(5 * a + phase * 2) * 0.3
    pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j])
  }
  return pts
}

// Rotate points about a centre (degrees, positive = clockwise in SVG's y-down space).
export function rotateAbout(
  pts: Array<[number, number]>, cx: number, cy: number, deg: number,
): Array<[number, number]> {
  const r = (deg * Math.PI) / 180
  const cs = Math.cos(r), sn = Math.sin(r)
  return pts.map(([x, y]) => {
    const dx = x - cx, dy = y - cy
    return [cx + dx * cs - dy * sn, cy + dx * sn + dy * cs] as [number, number]
  })
}
