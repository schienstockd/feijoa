// Port of the R Cecelia logo (old-R-shiny-version/im/cciaLogo.png).
// The original: pink rectangular frame with a light-blue cell inside, an orange
// cell floating above and to the right, a chartreuse cell far right, and the
// "Cecelia" wordmark in bold black.
//
// This first cut simplifies: cells are drawn as filled wobbly circles with a
// smaller inner circle (nucleus); trailing curves are TODO for a later pass.
import type { SketchDefinition } from '../lib/types'

export const logo: SketchDefinition = {
  id: 'logo',
  title: 'Cecelia logo',
  width: 940,
  height: 260,
  durationSec: 3.4,
  acts: [
    // Pink imaging window (the frame)
    {
      type: 'rect',
      at: [20, 30],
      size: [200, 200],
      stroke: 'accent',
      strokeWidth: 6,
      roughness: 1.8,
      delayMs: 0,
      drawMs: 900,
    },
    // Blue cell inside the frame
    {
      type: 'cell',
      at: [120, 130],
      r: 48,
      colour: 'blue',
      delayMs: 900,
      drawMs: 700,
    },
    // The wordmark "Cecelia"
    {
      type: 'text',
      at: [250, 175],
      value: 'Cecelia',
      size: 130,
      weight: 800,
      family: '"Segoe UI", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
      delayMs: 1600,
      drawMs: 600,
    },
    // Orange cell floating above the wordmark
    {
      type: 'cell',
      at: [635, 55],
      r: 34,
      colour: 'orange',
      delayMs: 2100,
      drawMs: 600,
    },
    // Chartreuse cell right of the wordmark
    {
      type: 'cell',
      at: [870, 55],
      r: 32,
      colour: 'yellow',
      delayMs: 2600,
      drawMs: 600,
    },
  ],
}
