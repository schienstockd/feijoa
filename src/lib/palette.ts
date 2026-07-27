// Feijoa palette — the R logo's colours are the anchor.
// Every colour in a SketchAct that isn't specified falls back to one of these.
export const palette = {
  background: '#fafaf7',
  stroke:     '#2a2a2a',
  text:       '#2a2a2a',
  textDim:    '#6b6b66',
  accent:     '#d94a86',   // logo pink (frame)
  blue:       '#6fb8db',   // logo blue (cell inside)
  orange:     '#f4a26a',   // logo orange (cell above)
  yellow:     '#d4de4a',   // logo chartreuse (cell right)
  soft1:      '#f7d0e0',
  soft2:      '#dbeaf3',
  soft3:      '#fbe7d4',
  soft4:      '#efeecf',
}

export type PaletteKey = keyof typeof palette

export function paletteColour(key: PaletteKey | string | undefined, fallback: string): string {
  if (!key) return fallback
  if (key in palette) return (palette as Record<string, string>)[key]
  return key
}
