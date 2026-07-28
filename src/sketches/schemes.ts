// Colour schemes for the sketch library — the single source of truth for cell/track colour.
//
// Lives in its own module (not logo_cascade_variants.ts, where it used to sit) because both the
// logo factory AND leaf marks like feijoa_mark.ts need it; importing it from the logo factory
// created a cycle (logo_cascade_variants -> feijoa_mark -> logo_cascade_variants) that left
// SCHEMES undefined at module-init time and silently dropped the mark from the logo.

// Colour schemes — each slot (cell1/cell2/cell3, corresponding to the blue/orange/yellow
// positions on canvas left-to-right) has its own solid, mid-tone, dark nucleus, and track
// colour. The "soft" fill is now a mid-tone (30% pastel + 70% saturated blend) — sitting
// between fully saturated and pastel — per Dominik's ask.
export type ColourSchemeKey = 'classic' | 'cool' | 'warm' | 'vibrant' | 'muted' | 'mono_pink'

export interface CellColours { solid: string; soft: string; nuc: string; track: string }
export interface ColourScheme { cell1: CellColours; cell2: CellColours; cell3: CellColours }

export const SCHEMES: Record<ColourSchemeKey, ColourScheme> = {
  classic: {
    cell1: { solid: '#6fb8db', soft: '#90c7e2', nuc: '#3d7ea0', track: '#6fb8db' },
    cell2: { solid: '#f4a26a', soft: '#f6b78a', nuc: '#c07a4a', track: '#f4a26a' },
    cell3: { solid: '#d4de4a', soft: '#dce372', nuc: '#a5ad35', track: '#d4de4a' },
  },
  cool: {
    cell1: { solid: '#4fb3a5', soft: '#74c3b7', nuc: '#2e6b62', track: '#4fb3a5' },
    cell2: { solid: '#5590c8', soft: '#78a7d4', nuc: '#2e5a86', track: '#5590c8' },
    cell3: { solid: '#8968b8', soft: '#a387c8', nuc: '#523d75', track: '#8968b8' },
  },
  warm: {
    cell1: { solid: '#e05a4f', soft: '#e67d73', nuc: '#8f3229', track: '#e05a4f' },
    cell2: { solid: '#f0894a', soft: '#f3a371', nuc: '#985028', track: '#f0894a' },
    cell3: { solid: '#e8c94a', soft: '#edd46f', nuc: '#8f7a20', track: '#e8c94a' },
  },
  vibrant: {
    // Cell1 (inside window) = cyan; cell2 (middle) = lime; cell3 (right) = magenta.
    cell1: { solid: '#3fc3d6', soft: '#66cedd', nuc: '#1f7684', track: '#3fc3d6' },
    cell2: { solid: '#b8d63f', soft: '#c5de66', nuc: '#6f841f', track: '#b8d63f' },
    cell3: { solid: '#e63d8f', soft: '#ea65a5', nuc: '#8a1c56', track: '#e63d8f' },
  },
  muted: {
    cell1: { solid: '#7d9db0', soft: '#99b2c0', nuc: '#3f5866', track: '#7d9db0' },
    cell2: { solid: '#c68a6b', soft: '#d1a287', nuc: '#7a4a30', track: '#c68a6b' },
    cell3: { solid: '#a89f6c', soft: '#b8b187', nuc: '#5f5738', track: '#a89f6c' },
  },
  mono_pink: {
    cell1: { solid: '#e05a86', soft: '#e67c9e', nuc: '#8a2e50', track: '#e05a86' },
    cell2: { solid: '#e88ab0', soft: '#eda2bf', nuc: '#9d4e6f', track: '#e88ab0' },
    cell3: { solid: '#f0b8ce', soft: '#f3c7d8', nuc: '#a86f8b', track: '#f0b8ce' },
  },
}
