// Interprets a SketchDefinition by drawing Rough.js primitives into an SVG,
// then animating each element's opacity + stroke-dashoffset with animejs.
//
// The trick for "someone is drawing this": every drawn path gets its total length
// measured, stroke-dasharray set to that length, and stroke-dashoffset animated
// from length → 0 over `drawMs`. Filled shapes fade in alongside.
import rough from 'roughjs'
import type { RoughSVG } from 'roughjs/bin/svg'
import anime from 'animejs'
import type { SketchDefinition, SketchAct, Pt } from './types'
import { palette, paletteColour } from './palette'

const SVG_NS = 'http://www.w3.org/2000/svg'

export interface PlayHandle {
  play: () => void
  pause: () => void
  reset: () => void
  destroy: () => void
}

export function render(svg: SVGSVGElement, def: SketchDefinition, opts: { reducedMotion?: boolean } = {}): PlayHandle {
  // clear
  while (svg.firstChild) svg.removeChild(svg.firstChild)
  svg.setAttribute('viewBox', `0 0 ${def.width} ${def.height}`)
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

  // background
  const bg = document.createElementNS(SVG_NS, 'rect')
  bg.setAttribute('x', '0')
  bg.setAttribute('y', '0')
  bg.setAttribute('width', String(def.width))
  bg.setAttribute('height', String(def.height))
  bg.setAttribute('fill', def.background ?? palette.background)
  svg.appendChild(bg)

  const rc = rough.svg(svg)

  // Group for content so we can add / clear on wipe.
  const gStage = document.createElementNS(SVG_NS, 'g')
  gStage.setAttribute('class', 'stage')
  svg.appendChild(gStage)

  const timeline: { node: SVGElement; delayMs: number; drawMs: number; kind: 'draw' | 'fade' | 'wipe' }[] = []
  let cursor = 0 // "playhead" in ms while we lay out acts

  const push = (node: SVGElement, delayMs: number, drawMs: number, kind: 'draw' | 'fade' | 'wipe') => {
    gStage.appendChild(node)
    timeline.push({ node, delayMs, drawMs, kind })
  }

  for (const act of def.acts) {
    if (act.type === 'pause') { cursor += act.ms; continue }
    if (act.type === 'wipe')  {
      // schedule a wipe: fade out everything currently in the stage before more acts
      const marker = document.createElementNS(SVG_NS, 'g')
      marker.setAttribute('data-wipe', '1')
      push(marker, cursor, 400, 'wipe')
      cursor += 400
      continue
    }
    const delayMs = (act as any).delayMs ?? cursor
    const drawMs  = (act as any).drawMs ?? 600
    const node = drawAct(rc, act)
    if (node) {
      const kind: 'draw' | 'fade' = act.type === 'text' ? 'fade' : 'draw'
      push(node, delayMs, drawMs, kind)
    }
    cursor = delayMs + drawMs
  }

  // Prepare: make everything invisible / dash-offset to length
  for (const t of timeline) {
    if (t.kind === 'wipe') { t.node.setAttribute('opacity', '0'); continue }
    if (t.kind === 'fade') { t.node.setAttribute('opacity', '0'); continue }
    // 'draw'
    t.node.setAttribute('opacity', '0')
    for (const p of Array.from(t.node.querySelectorAll('path'))) {
      const path = p as SVGPathElement
      const len = pathLength(path)
      path.setAttribute('stroke-dasharray', String(len))
      path.setAttribute('stroke-dashoffset', String(len))
    }
  }

  let timelineObj: anime.AnimeTimelineInstance | null = null

  const build = (reduced: boolean) => {
    // If reduced motion — snap to final frame.
    if (reduced) {
      for (const t of timeline) {
        if (t.kind === 'wipe') continue
        t.node.setAttribute('opacity', '1')
        for (const p of Array.from(t.node.querySelectorAll('path'))) {
          const path = p as SVGPathElement
          path.setAttribute('stroke-dashoffset', '0')
        }
      }
      return null
    }
    const tl = anime.timeline({ autoplay: false, easing: 'easeOutQuad' })
    for (const t of timeline) {
      if (t.kind === 'wipe') {
        // Fade the entire stage out, then remove — cheap "wipe" for early sketches.
        tl.add({
          targets: gStage,
          opacity: [1, 0],
          duration: t.drawMs,
          complete: () => {
            // clear everything already-drawn from the stage
            for (const t2 of timeline) {
              if (t2 === t) break
              if (t2.node.parentNode === gStage) gStage.removeChild(t2.node)
            }
            gStage.setAttribute('opacity', '1')
          }
        }, t.delayMs)
        continue
      }
      if (t.kind === 'fade') {
        tl.add({
          targets: t.node,
          opacity: [0, 1],
          duration: t.drawMs,
        }, t.delayMs)
        continue
      }
      // 'draw'
      const paths = Array.from(t.node.querySelectorAll('path')) as SVGPathElement[]
      tl.add({
        targets: t.node,
        opacity: [0, 1],
        duration: Math.min(200, t.drawMs / 3),
      }, t.delayMs)
      if (paths.length) {
        tl.add({
          targets: paths,
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: t.drawMs,
        }, t.delayMs)
      }
    }
    return tl
  }

  timelineObj = build(!!opts.reducedMotion)

  return {
    play:  () => { if (timelineObj) timelineObj.play(); },
    pause: () => { if (timelineObj) timelineObj.pause(); },
    reset: () => {
      if (timelineObj) { timelineObj.pause(); timelineObj.seek(0) }
    },
    destroy: () => {
      if (timelineObj) timelineObj.pause()
      while (svg.firstChild) svg.removeChild(svg.firstChild)
    }
  }
}

function drawAct(rc: RoughSVG, act: SketchAct): SVGElement | null {
  switch (act.type) {
    case 'line':
    case 'arrow': {
      const [x1, y1] = act.from
      const [x2, y2] = act.to
      const g = rc.line(x1, y1, x2, y2, {
        stroke: paletteColour(act.colour, palette.stroke),
        strokeWidth: 2,
        roughness: 1.4,
      })
      if (act.type === 'arrow') addArrowhead(g, act.from, act.to, paletteColour(act.colour, palette.stroke))
      return g
    }
    case 'rect': {
      const [x, y] = act.at
      const [w, h] = act.size
      return rc.rectangle(x, y, w, h, {
        stroke: paletteColour(act.stroke, palette.accent),
        strokeWidth: act.strokeWidth ?? 3,
        fill: act.fill ? paletteColour(act.fill, palette.accent) : undefined,
        fillStyle: act.fillStyle ?? 'hachure',
        roughness: act.roughness ?? 1.6,
      })
    }
    case 'circle': {
      const [x, y] = act.at
      return rc.circle(x, y, act.r * 2, styleOpts(act, 'blue'))
    }
    case 'ellipse': {
      const [x, y] = act.at
      const [w, h] = act.size
      return rc.ellipse(x, y, w, h, styleOpts(act, 'blue'))
    }
    case 'path': {
      return rc.path(act.d, styleOpts(act, 'stroke'))
    }
    case 'cell': {
      // A cell = a filled wobbly circle + a small darker interior (nucleus).
      const [x, y] = act.at
      const g = document.createElementNS(SVG_NS, 'g')
      const colour = paletteColour(act.colour, palette.blue)
      g.appendChild(rc.circle(x, y, act.r * 2, {
        fill: colour,
        fillStyle: 'solid',
        stroke: palette.stroke,
        strokeWidth: 2,
        roughness: 1.6,
      }))
      g.appendChild(rc.circle(x + act.r * 0.15, y - act.r * 0.1, act.r * 0.55, {
        fill: darken(colour, 0.18),
        fillStyle: 'solid',
        stroke: palette.stroke,
        strokeWidth: 1,
        roughness: 1.2,
      }))
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
      t.textContent = act.value
      return t
    }
  }
  return null
}

function styleOpts(act: any, defaultFillKey: string) {
  return {
    stroke: paletteColour(act.stroke, palette.stroke),
    strokeWidth: act.strokeWidth ?? 2,
    fill: act.fill ? paletteColour(act.fill, (palette as any)[defaultFillKey]) : undefined,
    fillStyle: act.fillStyle ?? 'solid',
    roughness: act.roughness ?? 1.4,
  }
}

function pathLength(p: SVGPathElement): number {
  try { return p.getTotalLength() } catch { return 0 }
}

function addArrowhead(g: SVGGElement, _from: Pt, to: Pt, colour: string) {
  // simple V-shape tip; iterate later
  const [x, y] = to
  const tip = document.createElementNS(SVG_NS, 'path')
  tip.setAttribute('d', `M ${x - 8} ${y - 5} L ${x} ${y} L ${x - 8} ${y + 5}`)
  tip.setAttribute('fill', 'none')
  tip.setAttribute('stroke', colour)
  tip.setAttribute('stroke-width', '2')
  g.appendChild(tip)
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
