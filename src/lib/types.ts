export type Pt = [x: number, y: number]
export type Sz = [w: number, h: number]

export interface CommonStyle {
  fill?: string
  stroke?: string
  strokeWidth?: number
  roughness?: number
  fillStyle?: 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots'
}

export interface Timed {
  delayMs?: number
  drawMs?: number
}

export type SketchAct =
  | ({ type: 'line';    from: Pt; to: Pt; colour?: string } & Timed)
  | ({ type: 'arrow';   from: Pt; to: Pt; colour?: string } & Timed)
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
