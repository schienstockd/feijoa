// Port of the R Cecelia logo (old-R-shiny-version/im/cciaLogo.png).
//
// The mark reads left → right: a pink imaging window contains a blue amoeboid cell whose
// migration track escapes the window and winds around the letters; two more cells (orange,
// chartreuse) sit above the wordmark, each dragging its own track downward through the letters.
// Cells are amoeboid (dendritic/T-cell), NOT circular.
import type { SketchDefinition } from '../lib/types'

// Amoeboid silhouettes — closed cubic-bezier paths with a lobe extending in the direction of the
// migration track. Approximated by eye from the R version; the paper filter softens any errors.
const BLUE_CELL = 'M 130 82 C 165 82, 180 112, 172 132 C 200 148, 185 178, 165 172 C 155 185, 128 182, 122 172 C 92 188, 72 160, 85 132 C 68 108, 100 78, 130 82 Z'
const ORANGE_CELL = 'M 660 40 C 690 42, 705 68, 695 82 C 715 92, 705 118, 685 115 C 680 128, 655 128, 650 118 C 625 128, 610 108, 622 92 C 608 78, 632 50, 660 40 Z'
const YELLOW_CELL = 'M 895 40 C 925 42, 945 68, 935 82 C 955 92, 942 118, 918 118 C 912 132, 880 130, 878 118 C 855 128, 842 105, 855 90 C 848 72, 872 42, 895 40 Z'

export const logo: SketchDefinition = {
  id: 'logo',
  title: 'Cecelia logo',
  width: 990,
  height: 260,
  durationSec: 4.4,
  acts: [
    // Pink imaging window (the frame) — a crisp thick square, no fill so the paper shows through.
    { type: 'rect', at: [30, 30], size: [200, 200], stroke: 'accent', strokeWidth: 9, delayMs: 0, drawMs: 900 },

    // Blue amoeboid cell inside the frame + darker nucleus
    { type: 'path',   d: BLUE_CELL, fill: 'blue', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 3, delayMs: 700, drawMs: 700 },
    { type: 'circle', at: [130, 128], r: 10, fill: '#3d7ea0', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 900, drawMs: 400 },

    // Blue migration track — leaves the frame from the cell's SE lobe, sweeps down and right so it
    // clearly EXITS the imaging window, then dives under the wordmark's baseline.
    { type: 'path', d: 'M 175 168 Q 205 200 245 215 Q 290 225 320 200 Q 345 175 335 145', stroke: 'blue', strokeWidth: 5, delayMs: 1300, drawMs: 900 },

    // Cecelia wordmark — bold black, letters cover any track segment that passes behind them.
    { type: 'text', at: [260, 195], value: 'Cecelia',
      size: 140, weight: 800,
      family: '"Segoe UI", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
      delayMs: 1700, drawMs: 700 },

    // Orange amoeboid + nucleus above the wordmark, plus wobbly track descending through the middle
    { type: 'path',   d: ORANGE_CELL, fill: 'orange', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 3, delayMs: 2300, drawMs: 700 },
    { type: 'circle', at: [665, 82], r: 10, fill: '#c07a4a', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 2500, drawMs: 400 },
    { type: 'path', d: 'M 660 128 Q 654 155 675 178 Q 693 202 668 220 Q 655 234 665 245', stroke: 'orange', strokeWidth: 5, delayMs: 2800, drawMs: 900 },

    // Chartreuse amoeboid + nucleus at top-right, plus track dropping into "ia"
    { type: 'path',   d: YELLOW_CELL, fill: 'yellow', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 3, delayMs: 3100, drawMs: 700 },
    { type: 'circle', at: [900, 82], r: 10, fill: '#a5ad35', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 3300, drawMs: 400 },
    { type: 'path', d: 'M 905 128 Q 915 158 895 180 Q 878 200 908 218', stroke: 'yellow', strokeWidth: 5, delayMs: 3500, drawMs: 800 },
  ],
}
