// Port of the R Cecelia logo (old-R-shiny-version/im/cciaLogo.png).
//
// Reads left → right: a pink imaging window contains a blue AMOEBOID cell whose migration track
// escapes the window and winds around the letters; two more cells (orange, chartreuse) sit above
// the wordmark, each dragging its own track downward through the letters. The whole mark reads
// as "the software watches immune cells crawl through an imaged region" — cells are amoeboid
// (dendritic/T-cell), NOT the circular blobs the earlier placeholder used.
import type { SketchDefinition } from '../lib/types'

// Amoeboid silhouettes — closed bezier paths, offsets baked in per cell so composition matches
// the original PNG. Approximated by eye from the R version, not pixel-exact.
const BLUE_CELL = 'M 78 138 C 68 118, 88 90, 112 92 C 140 90, 158 110, 152 132 C 165 148, 148 172, 128 170 C 112 178, 88 168, 82 152 C 70 148, 66 140, 78 138 Z'
const ORANGE_CELL = 'M 615 82 C 612 60, 640 48, 660 58 C 685 55, 700 78, 690 96 C 700 110, 685 122, 668 118 C 656 128, 630 122, 625 108 C 608 105, 604 90, 615 82 Z'
const YELLOW_CELL = 'M 860 78 C 855 55, 885 42, 910 55 C 940 52, 955 78, 945 98 C 960 110, 942 128, 922 122 C 908 132, 880 124, 875 108 C 858 108, 852 90, 860 78 Z'

export const logo: SketchDefinition = {
  id: 'logo',
  title: 'Cecelia logo',
  width: 990,
  height: 260,
  durationSec: 4.2,
  acts: [
    // Pink imaging window (the frame) — a thick square, outline only
    { type: 'rect', at: [20, 30], size: [200, 200], stroke: 'accent', strokeWidth: 7, delayMs: 0, drawMs: 800 },

    // Blue amoeboid cell inside the frame
    { type: 'path', d: BLUE_CELL, fill: 'blue', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 3, delayMs: 700, drawMs: 700 },

    // Blue migration track — leaves the frame at bottom-right, dives down and threads under the C
    { type: 'path', d: 'M 140 175 Q 165 205 205 220 Q 245 235 275 215 Q 300 200 315 170', stroke: 'blue', strokeWidth: 4, delayMs: 1200, drawMs: 900 },

    // Cecelia wordmark
    { type: 'text', at: [250, 190], value: 'Cecelia',
      size: 140, weight: 800,
      family: '"Segoe UI", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
      delayMs: 1600, drawMs: 700 },

    // Orange amoeboid cell above the wordmark, plus its wobbly track descending through the middle
    { type: 'path', d: ORANGE_CELL, fill: 'orange', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 3, delayMs: 2200, drawMs: 700 },
    { type: 'path', d: 'M 660 118 Q 655 145 675 170 Q 690 195 670 220 Q 655 235 665 250', stroke: 'orange', strokeWidth: 4, delayMs: 2700, drawMs: 900 },

    // Chartreuse amoeboid cell at top-right, plus its track dropping into "ia"
    { type: 'path', d: YELLOW_CELL, fill: 'yellow', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 3, delayMs: 3000, drawMs: 700 },
    { type: 'path', d: 'M 910 122 Q 918 150 900 175 Q 885 200 908 220', stroke: 'yellow', strokeWidth: 4, delayMs: 3400, drawMs: 800 },
  ],
}
