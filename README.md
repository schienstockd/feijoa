# feijoa

Loose hand-drawn sketches that explain how [cecelia](https://github.com/schienstockd/cecelia)
features work. Wobbly cells, animated tracks, a whiteboard feel. Not a product — a sketchbook.

Uses [Rough.js](https://roughjs.com/) for the hand-drawn primitives and
[animejs](https://animejs.com/) for tween sequencing.

## Play

```bash
npm install
npm run dev            # http://localhost:5174 — the sketchbook site
```

Each sketch is one file under `src/sketches/`. They're `SketchDefinition` JSON — a list of
`SketchAct`s (draw a shape, draw a line, place text, pause, wipe). Edit a file, the page reloads.

## Used by cecelia

Feijoa exports `SketchCanvas` (the renderer) + the `sketches` catalogue as a library. Cecelia's
frontend imports it via a local `file:` dep and hosts the sketches on its `/sketchbook` route.

```ts
import { SketchCanvas, sketches } from 'feijoa'
```

## Sketches

- `logo` — the Cecelia logo in sketch form (port of the R version's `im/cciaLogo.png`)
- `hmm` — HMM behaviour states (arrested / directed / meandering), placeholder
- `gating` — gate polygon drawn over a scatter, placeholder
- `tracking` — a cell track appearing frame by frame, placeholder

## SketchDefinition — the format

```ts
interface SketchDefinition {
  id: string
  title: string
  width: number
  height: number
  durationSec: number
  acts: SketchAct[]
}

type SketchAct =
  | { type: 'line',   from: Pt, to: Pt, colour?: string, delayMs?: number, drawMs?: number }
  | { type: 'arrow',  from: Pt, to: Pt, colour?: string, delayMs?: number, drawMs?: number }
  | { type: 'rect',   at: Pt, size: Sz, fill?: string, stroke?: string, delayMs?: number, drawMs?: number }
  | { type: 'circle', at: Pt, r: number, fill?: string, stroke?: string, delayMs?: number, drawMs?: number }
  | { type: 'ellipse',at: Pt, size: Sz, fill?: string, stroke?: string, delayMs?: number, drawMs?: number }
  | { type: 'path',   d: string,        fill?: string, stroke?: string, delayMs?: number, drawMs?: number }
  | { type: 'text',   at: Pt, value: string, size?: number, colour?: string, weight?: number, delayMs?: number }
  | { type: 'cell',   at: Pt, r: number, colour?: string, delayMs?: number, drawMs?: number }
  | { type: 'pause',  ms: number }
  | { type: 'wipe' }
```

Coordinates are canvas-relative pixels. `delayMs` is offset from the start of the sketch; `drawMs`
is how long the "draw-in" animation takes. Colours default to the palette.

## License

GPL-3.0-or-later, matching cecelia.
