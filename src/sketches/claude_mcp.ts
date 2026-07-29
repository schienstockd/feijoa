// Claude Code + the cecelia-observer MCP — an outside Claude Code session reads the running
// project through the MCP server: state, QC, cohort numbers, lineage, populations, behaviour.
// Read-only apart from two additive writes (a lab-log note, a Pluto notebook), and only when
// asked. It cannot change a parameter or run a task — it suggests, the user decides.
// See mcp/README.md + docs/ai-assist/OBSERVER.md.
//
// Sketch: project pane on the left, terminal on the right, and the MCP channel between them —
// a dark "reads" arrow out and a pink "writes" arrow back, so the asymmetry is the picture.
//
// The transcript carries GUTTER SPEAKER TAGS (you / claude), because without them a dark
// terminal line reads as "the user typed this" — and the parameter suggestion is Claude's line,
// not the user's. Its wording follows the observer prompt's own rule (app/src/ai/observer_prompt.jl):
// cite the current value + the cohort number + the valid bound, and leave the decision with the user.
import type { SketchDefinition } from '../lib/types'
import { imagingWindow, immuneCell } from './primitives'

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

// Two panes of equal height, the MCP channel between them
const L_X = 40,  L_W = 160
const R_X = 415, R_W = 275
const PANE_Y = 80, PANE_H = 230
const HEAD_H = 26
// Transcript columns — speaker tag in the gutter, message text indented past it
const GUT = R_X + 12, MSG = R_X + 58

export const claudeMcp: SketchDefinition = {
  id: 'claude_mcp',
  title: 'Claude Code + cecelia MCP',
  width: 720,
  height: 360,
  durationSec: 4.9,
  acts: [
    // ── Left pane — the running project
    { type: 'text', at: [L_X, 66], value: 'your project', size: 12, colour: 'textDim', delayMs: 800, drawMs: 300 },
    { type: 'rect', at: [L_X, PANE_Y], size: [L_W, PANE_H], fill: 'background', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 2, delayMs: 300, drawMs: 500 },
    imagingWindow(65, 110, { size: [110, 100], delayMs: 850, drawMs: 400 }),
    // Tilted so the cell-in-window doesn't read as a symmetric "eye"
    ...immuneCell(120, 160, { slot: 'cell1', scale: 0.8, rotate: -18, cellDelayMs: 1250 }),
    // QC readout — what the observer actually latches onto
    { type: 'text', at: [65, 265], value: '2 of 7 flagged', size: 11, colour: 'accent', delayMs: 1700, drawMs: 300 },

    // ── Right pane — Claude Code in a terminal
    { type: 'text', at: [R_X, 66], value: 'your terminal', size: 12, colour: 'textDim', delayMs: 1500, drawMs: 300 },
    { type: 'rect', at: [R_X, PANE_Y], size: [R_W, PANE_H], fill: 'background', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 2, delayMs: 1500, drawMs: 450 },
    { type: 'rect', at: [R_X, PANE_Y], size: [R_W, HEAD_H], fill: '#efefec', fillStyle: 'solid', stroke: 'stroke', strokeWidth: 1, delayMs: 1950, drawMs: 300 },
    { type: 'circle', at: [R_X + 16, PANE_Y + 13], r: 3.5, fill: 'textDim', fillStyle: 'solid', delayMs: 2050, drawMs: 150 },
    { type: 'circle', at: [R_X + 29, PANE_Y + 13], r: 3.5, fill: 'textDim', fillStyle: 'solid', delayMs: 2080, drawMs: 150 },
    { type: 'circle', at: [R_X + 42, PANE_Y + 13], r: 3.5, fill: 'textDim', fillStyle: 'solid', delayMs: 2110, drawMs: 150 },
    { type: 'text', at: [R_X + 58, PANE_Y + 17], value: 'claude code', size: 11, colour: 'textDim', family: MONO, delayMs: 2150, drawMs: 300 },

    // ── The transcript — Claude opens with what stands out (the starter prompt has it call
    // get_session_briefing first), names the knob, and the USER is the one who changes it. Who
    // says what carries the boundary, so no negative disclaimer is needed.
    { type: 'text', at: [GUT, 132], value: 'claude', size: 10, colour: 'textDim', family: MONO, delayMs: 2900, drawMs: 250 },
    { type: 'text', at: [MSG, 132], value: '2 images look off —',      size: 11, colour: 'text', family: MONO, delayMs: 2950, drawMs: 300 },
    { type: 'text', at: [MSG, 150], value: '9 tracks vs median 23',    size: 11, colour: 'text', family: MONO, delayMs: 3050, drawMs: 300 },
    { type: 'text', at: [MSG, 174], value: 'maxSearchRadius was 20',   size: 11, colour: 'text', family: MONO, delayMs: 3150, drawMs: 300 },
    { type: 'text', at: [MSG, 192], value: '(range 1–200) — try 8–10', size: 11, colour: 'text', family: MONO, delayMs: 3250, drawMs: 300 },

    { type: 'text', at: [GUT, 228], value: 'you',    size: 10, colour: 'textDim', family: MONO, delayMs: 3450, drawMs: 250 },
    { type: 'text', at: [MSG, 228], value: "nice — I'll try that", size: 12, colour: 'text', family: MONO, delayMs: 3500, drawMs: 400 },

    { type: 'text', at: [GUT, 268], value: 'claude', size: 10, colour: 'textDim', family: MONO, delayMs: 4000, drawMs: 250 },
    { type: 'text', at: [MSG, 268], value: '+ noted in lab log', size: 11, colour: 'accent', family: MONO, delayMs: 4050, drawMs: 350 },

    // ── The channel — reads out (dark), writes back (pink). The asymmetry is the point.
    { type: 'arrow', from: [212, 142], to: [400, 142], colour: 'stroke', strokeWidth: 2, delayMs: 2300, drawMs: 450 },
    { type: 'text', at: [214, 132], value: 'reads', size: 12, weight: 700, colour: 'text', delayMs: 2500, drawMs: 300 },
    { type: 'text', at: [214, 162], value: 'images · QC · pops · params', size: 11, colour: 'textDim', delayMs: 2650, drawMs: 350 },

    // Server name, centred between the two directions — one link, not two
    { type: 'text', at: [216, 196], value: 'MCP · cecelia-observer', size: 11, colour: 'textDim', family: MONO, delayMs: 2800, drawMs: 350 },

    { type: 'arrow', from: [400, 232], to: [212, 232], colour: 'accent', strokeWidth: 2, delayMs: 3700, drawMs: 400 },
    { type: 'text', at: [214, 222], value: 'writes', size: 12, weight: 700, colour: 'accent', delayMs: 3850, drawMs: 300 },
    { type: 'text', at: [214, 252], value: 'lab log · notebook — if you ask', size: 11, colour: 'textDim', delayMs: 3950, drawMs: 350 },
  ],
}
