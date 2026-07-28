// Shared geometry for the Cecelia logo — cell paths, migration tracks, nucleus positions,
// frame and wordmark placement. Used by `logo.ts` (the canonical variant) and the four
// aesthetic variants (`logo_gesture`, `logo_deliberate`, `logo_confident`, `logo_editorial`).
//
// Each variant varies ONLY: font, stroke widths, fills, and timing. The underlying immune-cell
// geometry stays fixed — that's what makes them comparable.

// Immune cell outlines — the same "migrating" amoeboid shape used by the pipeline sketches
// (see primitives.ts cellPathD): a sharp leading nose, tapered uropod tail, two uneven
// pseudopod bumps. Baked to a literal path string via `cellPath(cx, cy, 0.8, flip)` at each
// cell's nucleus centre — can't import primitives.ts here (it imports NUC_FILL from this
// file, so importing back would be circular); re-run cellPath with these same args and paste
// the result here if the shared shape ever changes.
// Blue's uropod is on the RIGHT (track exits right, toward the "C"). Orange/Yellow uropods
// are on the LEFT (past tracks extend left through the letters).
export const BLUE_CELL   = 'M 73 145 C 76.2 137, 89 121, 93.8 125.8 C 101.8 124.2, 111.4 127.4, 117.8 132.2 C 125.8 130.6, 137 141.8, 138.6 148.2 C 137 153, 119.4 161, 109.8 161 C 101.8 162.6, 95.4 162.6, 90.6 159.4 C 82.6 154.6, 74.6 151.4, 73 145 Z'
export const ORANGE_CELL = 'M 417 100 C 413.8 92, 401 76, 396.2 80.8 C 388.2 79.2, 378.6 82.4, 372.2 87.2 C 364.2 85.6, 353 96.8, 351.4 103.2 C 353 108, 370.6 116, 380.2 116 C 388.2 117.6, 394.6 117.6, 399.4 114.4 C 407.4 109.6, 415.4 106.4, 417 100 Z'
export const YELLOW_CELL = 'M 707 100 C 703.8 92, 691 76, 686.2 80.8 C 678.2 79.2, 668.6 82.4, 662.2 87.2 C 654.2 85.6, 643 96.8, 641.4 103.2 C 643 108, 660.6 116, 670.2 116 C 678.2 117.6, 684.6 117.6, 689.4 114.4 C 697.4 109.6, 705.4 106.4, 707 100 Z'

// Wavy multi-turn migration tracks. Origin at cell centre (covered by cell body + nucleus).
export const BLUE_TRACK   = 'M 105 145 C 130 143, 150 163, 165 163 C 180 165, 190 148, 205 155 C 220 165, 230 170, 240 158 C 248 145, 248 138, 240 128'
export const ORANGE_TRACK = 'M 385 100 C 360 115, 335 105, 325 122 C 315 135, 290 118, 275 132 C 260 145, 240 118, 220 128 C 200 138, 180 124, 165 132'
export const YELLOW_TRACK = 'M 675 100 C 650 115, 625 108, 615 124 C 605 138, 580 115, 570 130 C 560 145, 535 115, 515 125 C 495 135, 475 122, 458 132'

// Nucleus positions (at cell centres).
export const BLUE_NUC   = { at: [105, 145] as [number, number], r: 15, colour: '#3d7ea0' }
export const ORANGE_NUC = { at: [385, 100] as [number, number], r: 15, colour: '#c07a4a' }
export const YELLOW_NUC = { at: [675, 100] as [number, number], r: 15, colour: '#a5ad35' }

// Pale nucleus fill — the ghostly disc visible through the coloured cytoplasm.
export const NUC_FILL = '#f0f0ee'

// Imaging window — 100×100, aligned to the capital "C" (top at cap height, bottom at baseline).
export const FRAME_AT: [number, number] = [55, 95]
export const FRAME_SIZE: [number, number] = [100, 100]

// Frame corner coordinates for variants that draw the frame as four lines (e.g. for
// per-corner overshoot).
export const FRAME_TL: [number, number] = [55, 95]
export const FRAME_TR: [number, number] = [155, 95]
export const FRAME_BR: [number, number] = [155, 195]
export const FRAME_BL: [number, number] = [55, 195]

// Wordmark baseline anchor.
export const WORDMARK_AT: [number, number] = [180, 195]

export const LOGO_W = 990
export const LOGO_H = 260
