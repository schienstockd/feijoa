// The Cecelia logo — the final cascade with the picks locked in from the knob review.
//
// Settings (see logo_cascade_variants.ts):
//   frameStroke: 11        — baseline pink 11px frame
//   frameStyle:  'rect'    — clean rectangle
//   frameColour: 'accent'  — pink
//   cellStroke:  3         — bold cell outline
//   cellFill:    'soft'    — soft pastel fills
//   nucStyle:    'pale'    — pale nucleus disc
//   trackStroke: 8         — loud migration tracks
//   wordmarkSize:   140    — baseline
//   wordmarkWeight: 800    — baseline (bold)
//   duration:    1.8       — punchy
//   order:       'sync'    — all three cells reveal together
//   colourScheme: 'vibrant' — cyan (inside window) · lime (middle) · magenta (right)
//
// Structure (cascade waterfall timing, DOM: track → cell → nucleus per colour so cells occlude
// track origins) is defined in the factory `makeCascade` in `logo_cascade_variants.ts`.
import { makeCascade } from './logo_cascade_variants'

export const logo = makeCascade('logo', 'Cecelia logo', {
  frameStroke: 11,
  frameStyle: 'rect',
  frameColour: 'accent',
  cellStroke: 3,
  cellFill: 'soft',
  nucStyle: 'pale',
  trackStroke: 8,
  wordmarkSize: 140,
  wordmarkWeight: 800,
  duration: 1.8,
  order: 'sync',
  colourScheme: 'vibrant',
})
