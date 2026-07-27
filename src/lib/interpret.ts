// Interprets a SketchDefinition by drawing precise SVG primitives, then animating each element's
// opacity + stroke-dashoffset with animejs. The aesthetic target is *pastel figure drawing*, not
// wobble — crisp geometry, soft palette, round stroke caps, and a subtle paper filter for pen-
// on-paper texture. Rough.js used to live here; it produced too much scribble and the upstream
// project is effectively abandoned (last release 2022).
//
// The trick for "someone is drawing this": every strokeable element gets its total length
// measured via getTotalLength(), stroke-dasharray set to that length, and stroke-dashoffset
// animated from length → 0 over `drawMs`. Filled shapes fade in alongside.
import anime from 'animejs'
import type { SketchDefinition, SketchAct, Pt } from './types'
import { palette, paletteColour } from './palette'

const SVG_NS = 'http://www.w3.org/2000/svg'

// One-off id for the paper filter — each sketch owns its own defs so several SketchCanvases can
// coexist on a page (e.g. the What's New modal listing multiple tips).
let filterCounter = 0

export interface PlayHandle {
  play: () => void
  pause: () => void
  reset: () => void
  destroy: () => void
}

// Strokeable elements that expose getTotalLength() — used to prep the draw-in dashoffset.
type StrokeGeom = SVGPathElement | SVGLineElement | SVGRectElement | SVGCircleElement | SVGEllipseElement | SVGPolygonElement | SVGPolylineElement
const STROKE_SELECTOR = 'path, line, rect, circle, ellipse, polygon, polyline'

export function render(svg: SVGSVGElement, def: SketchDefinition, opts: { reducedMotion?: boolean } = {}): PlayHandle {
  while (svg.firstChild) svg.removeChild(svg.firstChild)
  svg.setAttribute('viewBox', `0 0 ${def.width} ${def.height}`)
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

  const paperId = `feijoa-paper-${++filterCounter}`
  svg.appendChild(buildDefs(paperId))

  const bg = document.createElementNS(SVG_NS, 'rect')
  bg.setAttribute('x', '0'); bg.setAttribute('y', '0')
  bg.setAttribute('width', String(def.width))
  bg.setAttribute('height', String(def.height))
  bg.setAttribute('fill', def.background ?? palette.background)
  svg.appendChild(bg)

  // Stage sits under the paper filter — subtle pen-on-paper displacement across all shapes.
  // Text is added outside the filtered group so labels stay crisp.
  const gStage = document.createElementNS(SVG_NS, 'g')
  gStage.setAttribute('class', 'stage')
  const gArt = document.createElementNS(SVG_NS, 'g')
  gArt.setAttribute('filter', `url(#${paperId})`)
  gStage.appendChild(gArt)
  const gText = document.createElementNS(SVG_NS, 'g')
  gStage.appendChild(gText)
  svg.appendChild(gStage)

  type Entry = { node: SVGElement; delayMs: number; drawMs: number; kind: 'draw' | 'fade' | 'wipe' }
  const timeline: Entry[] = []
  let cursor = 0

  for (const act of def.acts) {
    if (act.type === 'pause') { cursor += act.ms; continue }
    if (act.type === 'wipe') {
      const marker = document.createElementNS(SVG_NS, 'g')
      marker.setAttribute('data-wipe', '1')
      gStage.appendChild(marker)
      timeline.push({ node: marker, delayMs: cursor, drawMs: 400, kind: 'wipe' })
      cursor += 400
      continue
    }
    const delayMs = (act as { delayMs?: number }).delayMs ?? cursor
    const drawMs  = (act as { drawMs?: number }).drawMs ?? 600
    const node = drawAct(act)
    if (node) {
      const kind: 'draw' | 'fade' = act.type === 'text' ? 'fade' : 'draw'
      ;(act.type === 'text' ? gText : gArt).appendChild(node)
      timeline.push({ node, delayMs, drawMs, kind })
    }
    cursor = delayMs + drawMs
  }

  // Prep initial state — everything hidden; strokeable geometry gets its dashoffset set to length.
  for (const t of timeline) {
    if (t.kind === 'wipe') { t.node.setAttribute('opacity', '0'); continue }
    t.node.setAttribute('opacity', '0')
    if (t.kind === 'draw') {
      for (const el of Array.from(t.node.querySelectorAll(STROKE_SELECTOR)) as StrokeGeom[]) {
        const len = geomLength(el)
        if (len > 0) {
          el.setAttribute('stroke-dasharray', String(len))
          el.setAttribute('stroke-dashoffset', String(len))
        }
      }
      // For a group whose root IS strokeable (e.g. a bare <path>), the query above already covers it.
    }
  }

  let timelineObj: anime.AnimeTimelineInstance | null = null

  const build = (reduced: boolean) => {
    if (reduced) {
      for (const t of timeline) {
        if (t.kind === 'wipe') continue
        t.node.setAttribute('opacity', '1')
        for (const el of Array.from(t.node.querySelectorAll(STROKE_SELECTOR)) as StrokeGeom[]) {
          el.setAttribute('stroke-dashoffset', '0')
        }
      }
      return null
    }
    const tl = anime.timeline({ autoplay: false, easing: 'easeOutQuad' })
    for (const t of timeline) {
      if (t.kind === 'wipe') {
        tl.add({
          targets: gStage,
          opacity: [1, 0],
          duration: t.drawMs,
          complete: () => {
            for (const t2 of timeline) {
              if (t2 === t) break
              if (t2.node.parentNode) t2.node.parentNode.removeChild(t2.node)
            }
            gStage.setAttribute('opacity', '1')
          }
        }, t.delayMs)
        continue
      }
      if (t.kind === 'fade') {
        tl.add({ targets: t.node, opacity: [0, 1], duration: t.drawMs }, t.delayMs)
        continue
      }
      // 'draw' — fade the group in fast, then draw the strokes.
      tl.add({
        targets: t.node,
        opacity: [0, 1],
        duration: Math.min(200, t.drawMs / 3),
      }, t.delayMs)
      const strokes = Array.from(t.node.querySelectorAll(STROKE_SELECTOR)) as StrokeGeom[]
      const drawable = strokes.filter(el => geomLength(el) > 0)
      if (drawable.length) {
        tl.add({
          targets: drawable,
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: t.drawMs,
        }, t.delayMs)
      }
    }
    return tl
  }

  timelineObj = build(!!opts.reducedMotion)

  return {
    play:  () => { if (timelineObj) timelineObj.play() },
    pause: () => { if (timelineObj) timelineObj.pause() },
    reset: () => {
      if (timelineObj) { timelineObj.pause(); timelineObj.seek(0) }
    },
    destroy: () => {
      if (timelineObj) timelineObj.pause()
      while (svg.firstChild) svg.removeChild(svg.firstChild)
    }
  }
}

// One SVG <defs> block per sketch — the paper filter is a single feTurbulence + feDisplacementMap.
// Scale is deliberately tiny (0.9): a hint of pen-on-paper, never a scribble.
function buildDefs(paperId: string): SVGDefsElement {
  const defs = document.createElementNS(SVG_NS, 'defs')
  const f = document.createElementNS(SVG_NS, 'filter')
  f.setAttribute('id', paperId)
  f.setAttribute('x', '-5%'); f.setAttribute('y', '-5%')
  f.setAttribute('width', '110%'); f.setAttribute('height', '110%')
  const turb = document.createElementNS(SVG_NS, 'feTurbulence')
  turb.setAttribute('type', 'fractalNoise')
  turb.setAttribute('baseFrequency', '1.2')
  turb.setAttribute('numOctaves', '1')
  turb.setAttribute('seed', '7')
  turb.setAttribute('result', 'noise')
  const disp = document.createElementNS(SVG_NS, 'feDisplacementMap')
  disp.setAttribute('in', 'SourceGraphic')
  disp.setAttribute('in2', 'noise')
  disp.setAttribute('scale', '0.9')
  disp.setAttribute('xChannelSelector', 'R')
  disp.setAttribute('yChannelSelector', 'G')
  f.appendChild(turb)
  f.appendChild(disp)
  defs.appendChild(f)
  return defs
}

function drawAct(act: SketchAct): SVGElement | null {
  switch (act.type) {
    case 'line': {
      const [x1, y1] = act.from, [x2, y2] = act.to
      return strokeLine(x1, y1, x2, y2, paletteColour(act.colour, palette.stroke), 2)
    }
    case 'arrow': {
      const [x1, y1] = act.from, [x2, y2] = act.to
      const colour = paletteColour(act.colour, palette.stroke)
      const g = document.createElementNS(SVG_NS, 'g')
      g.appendChild(strokeLine(x1, y1, x2, y2, colour, 2))
      g.appendChild(arrowhead(act.from, act.to, colour))
      return g
    }
    case 'rect': {
      const [x, y] = act.at, [w, h] = act.size
      const g = document.createElementNS(SVG_NS, 'g')
      if (act.fill) {
        const fillEl = svgRect(x, y, w, h)
        fillEl.setAttribute('fill', paletteColour(act.fill, palette.accent))
        fillEl.setAttribute('opacity', String(fillOpacity(act.fillStyle)))
        fillEl.setAttribute('stroke', 'none')
        g.appendChild(fillEl)
      }
      const outline = svgRect(x, y, w, h)
      styleStroke(outline, paletteColour(act.stroke, palette.accent), act.strokeWidth ?? 3)
      outline.setAttribute('fill', 'none')
      g.appendChild(outline)
      return g
    }
    case 'circle': {
      const [x, y] = act.at
      return shapeWithOptionalFill(svgCircle(x, y, act.r), act, 'blue')
    }
    case 'ellipse': {
      const [x, y] = act.at, [w, h] = act.size
      return shapeWithOptionalFill(svgEllipse(x, y, w / 2, h / 2), act, 'blue')
    }
    case 'path': {
      const g = document.createElementNS(SVG_NS, 'g')
      if (act.fill) {
        const fillEl = svgPath(act.d)
        fillEl.setAttribute('fill', paletteColour(act.fill, palette.accent))
        fillEl.setAttribute('opacity', String(fillOpacity(act.fillStyle)))
        fillEl.setAttribute('stroke', 'none')
        g.appendChild(fillEl)
      }
      const line = svgPath(act.d)
      styleStroke(line, paletteColour(act.stroke, palette.stroke), act.strokeWidth ?? 2)
      line.setAttribute('fill', 'none')
      g.appendChild(line)
      return g
    }
    case 'cell': {
      // Cell = filled body + softer inner nucleus. Both precise circles; the paper filter above
      // gives them a hint of pen-on-paper.
      const [x, y] = act.at
      const colour = paletteColour(act.colour, palette.blue)
      const g = document.createElementNS(SVG_NS, 'g')
      const body = svgCircle(x, y, act.r)
      body.setAttribute('fill', colour)
      body.setAttribute('opacity', '0.85')
      styleStroke(body, palette.stroke, 2)
      g.appendChild(body)
      const nucleus = svgCircle(x + act.r * 0.15, y - act.r * 0.1, act.r * 0.55)
      nucleus.setAttribute('fill', darken(colour, 0.22))
      nucleus.setAttribute('opacity', '0.9')
      styleStroke(nucleus, palette.stroke, 1)
      g.appendChild(nucleus)
      return g
    }
    case 'text': {
      const t = document.createElementNS(SVG_NS, 'text')
      const [x, y] = act.at
      t.setAttribute('x', String(x))
      t.setAttribute('y', String(y))
      t.setAttribute('fill', paletteColour(act.colour, palette.text))
      t.setAttribute('font-size', String(act.size ?? 20))
      t.setAttribute('font-weight', String(act.weight ?? 400))
      t.setAttribute('font-family', act.family ?? 'inherit')
      if (act.rotate !== undefined) t.setAttribute('transform', `rotate(${act.rotate} ${x} ${y})`)
      t.textContent = act.value
      return t
    }
  }
  return null
}

function shapeWithOptionalFill(shape: SVGGeometryElement, act: SketchAct & { fill?: string; stroke?: string; strokeWidth?: number; fillStyle?: string }, defaultFillKey: string): SVGElement {
  const g = document.createElementNS(SVG_NS, 'g')
  if (act.fill) {
    const fillEl = shape.cloneNode() as SVGGeometryElement
    const fallback = (palette as Record<string, string>)[defaultFillKey] ?? palette.accent
    fillEl.setAttribute('fill', paletteColour(act.fill, fallback))
    fillEl.setAttribute('opacity', String(fillOpacity(act.fillStyle)))
    fillEl.setAttribute('stroke', 'none')
    g.appendChild(fillEl)
  }
  styleStroke(shape, paletteColour(act.stroke, palette.stroke), act.strokeWidth ?? 2)
  shape.setAttribute('fill', 'none')
  g.appendChild(shape)
  return g
}

function svgRect(x: number, y: number, w: number, h: number): SVGRectElement {
  const r = document.createElementNS(SVG_NS, 'rect')
  r.setAttribute('x', String(x)); r.setAttribute('y', String(y))
  r.setAttribute('width', String(w)); r.setAttribute('height', String(h))
  return r
}
function svgCircle(cx: number, cy: number, r: number): SVGCircleElement {
  const c = document.createElementNS(SVG_NS, 'circle')
  c.setAttribute('cx', String(cx)); c.setAttribute('cy', String(cy)); c.setAttribute('r', String(r))
  return c
}
function svgEllipse(cx: number, cy: number, rx: number, ry: number): SVGEllipseElement {
  const e = document.createElementNS(SVG_NS, 'ellipse')
  e.setAttribute('cx', String(cx)); e.setAttribute('cy', String(cy))
  e.setAttribute('rx', String(rx)); e.setAttribute('ry', String(ry))
  return e
}
function svgPath(d: string): SVGPathElement {
  const p = document.createElementNS(SVG_NS, 'path')
  p.setAttribute('d', d)
  return p
}
function strokeLine(x1: number, y1: number, x2: number, y2: number, colour: string, width: number): SVGLineElement {
  const l = document.createElementNS(SVG_NS, 'line')
  l.setAttribute('x1', String(x1)); l.setAttribute('y1', String(y1))
  l.setAttribute('x2', String(x2)); l.setAttribute('y2', String(y2))
  styleStroke(l, colour, width)
  return l
}
function styleStroke(el: SVGElement, colour: string, width: number): void {
  el.setAttribute('stroke', colour)
  el.setAttribute('stroke-width', String(width))
  el.setAttribute('stroke-linecap', 'round')
  el.setAttribute('stroke-linejoin', 'round')
}

// Filled shapes come out chalky, not flat — mildly translucent so overlaps read as pastel layering
// rather than sharp poster fills. `solid` gets the strongest coverage; the rest are softer.
function fillOpacity(fillStyle: string | undefined): number {
  switch (fillStyle) {
    case 'solid':       return 0.9
    case 'hachure':     return 0.55
    case 'cross-hatch': return 0.5
    case 'zigzag':      return 0.5
    case 'dots':        return 0.4
    default:            return 0.85
  }
}

function geomLength(el: SVGElement): number {
  const g = el as unknown as { getTotalLength?: () => number }
  if (typeof g.getTotalLength !== 'function') return 0
  try { return g.getTotalLength() } catch { return 0 }
}

function arrowhead(_from: Pt, to: Pt, colour: string): SVGPathElement {
  const [x, y] = to
  const tip = document.createElementNS(SVG_NS, 'path')
  tip.setAttribute('d', `M ${x - 10} ${y - 6} L ${x} ${y} L ${x - 10} ${y + 6}`)
  tip.setAttribute('fill', 'none')
  styleStroke(tip, colour, 2)
  return tip
}

function darken(hex: string, amount: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!m) return hex
  const n = parseInt(m[1], 16)
  const r = Math.max(0, Math.round(((n >> 16) & 0xff) * (1 - amount)))
  const gg = Math.max(0, Math.round(((n >> 8) & 0xff) * (1 - amount)))
  const b = Math.max(0, Math.round((n & 0xff) * (1 - amount)))
  return '#' + [r, gg, b].map(x => x.toString(16).padStart(2, '0')).join('')
}
