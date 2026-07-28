# Sketch character — parked plan

The revised prompt lives at
`cecelia-pineapple/docs/prompts/feijoa-improve-prompt.md`. This plan is
its build sequence + locked decisions.

## Locked decisions

- **Kill the paper filter.** `feTurbulence` + `feDisplacementMap` in
  `interpret.ts` is removed. Character comes from font/stroke/timing, not
  post-processing. If a future variant needs texture, we reintroduce it
  scoped to one variant — not the renderer.
- **Fonts via Google Fonts `<link>`** in `index.html`. Cheap, no self-host
  step. Loaded: Caveat, Patrick Hand, Kalam.
- **`timing` is opt-in.** Adding it as a required field would break the
  13 existing sketches and cecelia's `/sketchbook` consumer. Optional
  per-act; interpreter multiplies `drawMs` when set.
- **In-app side-by-side view is the deliverable**, not screenshots. No
  headless capture tooling is added — feijoa's dev site is enough.
- **4 variants**, not 5. Named `logo_gesture`, `logo_deliberate`,
  `logo_confident`, `logo_editorial`. Each varies on ≥2 axes so the pick
  is obvious at a glance.
- **Additive types only.** `SketchAct` gains optional fields; nothing
  existing changes shape.

## The 4 variants

| Name | Font | Stroke hierarchy | Timing profile | Endpoints | Fills |
|---|---|---|---|---|---|
| `logo_gesture` | Caveat | uniform thin (2px) | 1.2s, all fast | snap | none |
| `logo_deliberate` | Patrick Hand | frame 6px / cells 3px / tracks 4px | 2.2s w/ pauses | snap | pastel cells |
| `logo_confident` | Kalam | frame 8px / cells 3px / tracks 5px | 1.8s staggered | 2-3px overshoot on frame | solid cells |
| `logo_editorial` | Caveat | frame 4px / cells 2px / tracks 3px | 2.0s, semantic timing | snap | soft fills all round |

Each variant is one file under `src/sketches/`. Top-of-file comment states
the one aesthetic decision the variant is testing.

## Build sequence

1. **Prompt revised** — done (fixed the broken filter line, dropped
   screenshot deliverable, made `timing` explicitly optional, scoped to 4).
2. **Renderer** — remove the paper filter and the defs it needs. The
   `filterCounter`/`buildDefs` machinery goes with it; `gArt` no longer
   needs its own group. Simplify to a single stage group + text group.
3. **Fonts** — one `<link>` line in `index.html` for the three families.
4. **`timing` hint** — extend `Timed` in `types.ts`; multiply `drawMs` in
   `interpret.ts` where the cursor advances and where the anime timeline
   is built.
5. **Optional `overshoot`** on `line` acts — needed for `logo_confident`.
   Extend the line by `overshoot` pixels along its own direction before
   drawing. Optional, default 0. Skip if we decide it's not worth the
   type surface; `logo_confident` can approximate by hand-shifting
   endpoint coordinates.
6. **4 variants** — one file each; register them in
   `src/sketches/index.ts`. Order in `sketchList`: keep the original
   `logo` first, then the 4 variants after it (grouped visually).
7. **Variants view** — new tab in `App.vue` (or a mode toggle) that
   renders all four variants in a 2×2 grid with names + one-line
   rationale below each. A "replay all" button seeks every canvas to 0
   and plays. Keep the existing single-sketch view intact.
8. **Typecheck** — `npm run typecheck`. Must pass.

## Risk register

- **Fonts fail to load** (offline dev, corp proxy). Fallback stack in the
  `family:` string ensures a graceful degrade to the current sans-serif.
- **`getTotalLength` on `<text>`** is not what draws the letter — text
  fades in, doesn't stroke-animate. Handwriting fonts don't change that.
  If we want text to draw stroke-by-stroke that's a much bigger job
  (per-glyph paths); explicitly out of scope.
- **Cecelia `/sketchbook`** — nothing in the surface changes name; the
  `file:` dep picks up the new variants automatically on next
  `npm install` from cecelia's side. That's a cecelia-side operation, not
  ours. The variants themselves don't break existing imports.

## Out of scope

- Per-glyph handwriting stroke animation.
- Screenshot / recording automation.
- Restyling the other 12 sketches — they keep their current look until
  a variant is picked, then that direction gets applied.
- Adding a `roughness` primitive or reintroducing Rough.js.
