export type Pt = [x: number, y: number]
export type Sz = [w: number, h: number]

export interface CommonStyle {
  fill?: string
  stroke?: string
  strokeWidth?: number
  roughness?: number
  fillStyle?: 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots'
}

// Optional semantic-importance hint on any timed act — the interpreter multiplies drawMs
// by (fast 0.5×, normal 1×, deliberate 1.7×). Lets sketch authors say "this is background"
// or "this is the point" without picking exact milliseconds.
export type TimingHint = 'fast' | 'normal' | 'deliberate'

export interface Timed {
  delayMs?: number
  drawMs?: number
  timing?: TimingHint
}

export type SketchAct =
  | ({ type: 'line';    from: Pt; to: Pt; colour?: string; strokeWidth?: number; overshoot?: number } & Timed)
  | ({ type: 'arrow';   from: Pt; to: Pt; colour?: string; strokeWidth?: number } & Timed)
  | ({ type: 'rect';    at: Pt; size: Sz } & CommonStyle & Timed)
  | ({ type: 'circle';  at: Pt; r: number } & CommonStyle & Timed)
  | ({ type: 'ellipse'; at: Pt; size: Sz } & CommonStyle & Timed)
  | ({ type: 'path';    d: string } & CommonStyle & Timed)
  | ({ type: 'text';    at: Pt; value: string; size?: number; colour?: string; weight?: number; family?: string; rotate?: number } & Timed)
  | ({ type: 'cell';    at: Pt; r: number; colour?: string } & Timed)
  | { type: 'pause';  ms: number }
  | { type: 'wipe' }

export interface SketchDefinition {
  id: string
  title: string
  width: number
  height: number
  durationSec: number
  background?: string
  acts: SketchAct[]
}
