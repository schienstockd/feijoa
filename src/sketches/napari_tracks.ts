// In-app track stats + tracks in napari — the pairing that motivates most of cecelia's tracking
// module. Behaviour stats (state proportions, speed dist per state) sit on the module summary
// plots; the tracks themselves are best viewed as coloured polylines over the raw image in
// napari. Sketch splits: left = a mini state-proportion bar chart; right = a dark napari
// canvas with three tracks over a soft fluorescence background.
import type { SketchDefinition } from '../lib/types'

export const napariTracks: SketchDefinition = {
  id: 'napari_tracks',
  title: 'Track stats + napari tracks',
  width: 640,
  height: 340,
  durationSec: 4.2,
  acts: [

    // ── Left panel: in-app track-behaviour stats (mini stacked bar per group)
    { type: 'text', at: [40, 100], value: 'behaviour stats', size: 12, colour: 'textDim', delayMs: 500, drawMs: 300 },
    { type: 'line', from: [50, 300], to: [270, 300], colour: 'stroke', delayMs: 700, drawMs: 400 },
    { type: 'line', from: [50, 300], to: [50, 120], colour: 'stroke', delayMs: 700, drawMs: 400 },

    // Stacked bar — group A (blue = arrested, orange = directed, yellow = meandering)
    { type: 'rect', at: [80, 220], size: [40, 80], fill: 'blue',   fillStyle: 'solid', delayMs: 1100, drawMs: 400 },
    { type: 'rect', at: [80, 170], size: [40, 50], fill: 'orange', fillStyle: 'solid', delayMs: 1200, drawMs: 400 },
    { type: 'rect', at: [80, 140], size: [40, 30], fill: 'yellow', fillStyle: 'solid', delayMs: 1300, drawMs: 400 },
    { type: 'text', at: [93, 315], value: 'A', size: 12, weight: 600, delayMs: 1450, drawMs: 300 },

    // Group B — different mix
    { type: 'rect', at: [150, 260], size: [40, 40], fill: 'blue',   fillStyle: 'solid', delayMs: 1200, drawMs: 400 },
    { type: 'rect', at: [150, 200], size: [40, 60], fill: 'orange', fillStyle: 'solid', delayMs: 1300, drawMs: 400 },
    { type: 'rect', at: [150, 140], size: [40, 60], fill: 'yellow', fillStyle: 'solid', delayMs: 1400, drawMs: 400 },
    { type: 'text', at: [163, 315], value: 'B', size: 12, weight: 600, delayMs: 1550, drawMs: 300 },

    // Group C — heavy directed
    { type: 'rect', at: [220, 285], size: [40, 15], fill: 'blue',   fillStyle: 'solid', delayMs: 1300, drawMs: 400 },
    { type: 'rect', at: [220, 165], size: [40, 120], fill: 'orange', fillStyle: 'solid', delayMs: 1400, drawMs: 400 },
    { type: 'rect', at: [220, 130], size: [40, 35], fill: 'yellow', fillStyle: 'solid', delayMs: 1500, drawMs: 400 },
    { type: 'text', at: [233, 315], value: 'C', size: 12, weight: 600, delayMs: 1650, drawMs: 300 },

    // ── Right panel: napari view — dark image with tracks
    { type: 'text', at: [345, 100], value: 'napari', size: 12, colour: 'textDim', delayMs: 1900, drawMs: 300 },
    { type: 'rect', at: [320, 115], size: [280, 200], fill: 'stroke', fillStyle: 'solid', stroke: 'stroke', delayMs: 2000, drawMs: 500 },

    // Foggy fluorescence blobs
    { type: 'ellipse', at: [380, 175], size: [45, 40], fill: 'blue',   delayMs: 2200, drawMs: 400 },
    { type: 'ellipse', at: [460, 195], size: [42, 42], fill: 'orange', delayMs: 2250, drawMs: 400 },
    { type: 'ellipse', at: [540, 175], size: [40, 40], fill: 'yellow', delayMs: 2300, drawMs: 400 },

    // Three tracks — polylines from a starting centroid, coloured by state
    { type: 'path', d: 'M 380 175 L 400 190 L 405 220 L 400 250 L 405 275', stroke: 'blue',   strokeWidth: 3, delayMs: 2700, drawMs: 900 },
    { type: 'path', d: 'M 460 195 L 490 190 L 520 195 L 555 190 L 585 195', stroke: 'orange', strokeWidth: 3, delayMs: 2800, drawMs: 900 },
    { type: 'path', d: 'M 540 175 L 555 200 L 530 220 L 555 245 L 535 270', stroke: 'yellow', strokeWidth: 3, delayMs: 2900, drawMs: 900 },

    // Endpoint markers
    { type: 'circle', at: [405, 275], r: 4, fill: 'blue',   fillStyle: 'solid', delayMs: 3700, drawMs: 300 },
    { type: 'circle', at: [585, 195], r: 4, fill: 'orange', fillStyle: 'solid', delayMs: 3800, drawMs: 300 },
    { type: 'circle', at: [535, 270], r: 4, fill: 'yellow', fillStyle: 'solid', delayMs: 3900, drawMs: 300 },
  ],
}
