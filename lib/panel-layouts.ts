// Common physical panel arrangements.
//
// A HUB75 wall is built from identical square modules chained together, so a
// resolution is really "how many modules, arranged how". Asking for raw pixel
// dimensions makes people compute 3 × 64 in their head and mistype it; asking
// for the arrangement matches how the wall is actually assembled and keeps the
// scene canvas consistent with what the firmware was built for.

/** Edge length of one module in pixels. 64x64 is what this project uses. */
export const PANEL_UNIT_SIZE = 64

export interface PanelLayout {
  id: string
  /** Modules across. */
  cols: number
  /** Modules down. */
  rows: number
  label: string
}

export const PANEL_LAYOUTS: PanelLayout[] = [
  { id: "1x1", cols: 1, rows: 1, label: "1 panel" },
  { id: "2x1", cols: 2, rows: 1, label: "2 panels — side by side" },
  { id: "1x2", cols: 1, rows: 2, label: "2 panels — stacked" },
  { id: "3x1", cols: 3, rows: 1, label: "3 panels — in a row" },
  { id: "1x3", cols: 1, rows: 3, label: "3 panels — in a column" },
  { id: "2x2", cols: 2, rows: 2, label: "4 panels — 2 x 2 square" },
  { id: "4x1", cols: 4, rows: 1, label: "4 panels — in a row" },
  { id: "3x2", cols: 3, rows: 2, label: "6 panels — 3 wide, 2 tall" },
  { id: "3x3", cols: 3, rows: 3, label: "9 panels — 3 x 3 square" },
  { id: "4x2", cols: 4, rows: 2, label: "8 panels — 4 wide, 2 tall" },
]

export function layoutPixels(layout: Pick<PanelLayout, "cols" | "rows">, unit = PANEL_UNIT_SIZE) {
  return { width: layout.cols * unit, height: layout.rows * unit }
}

/** The layout matching a pixel size, or null when it's a custom size. */
export function layoutForPixels(width: number, height: number, unit = PANEL_UNIT_SIZE): PanelLayout | null {
  if (width % unit !== 0 || height % unit !== 0) return null
  const cols = width / unit
  const rows = height / unit
  return PANEL_LAYOUTS.find((l) => l.cols === cols && l.rows === rows) ?? null
}

/** "3 x 2 panels (192x128px)" — one string for describing a wall in the UI. */
export function describeLayout(width: number, height: number, unit = PANEL_UNIT_SIZE): string {
  const layout = layoutForPixels(width, height, unit)
  if (layout) return `${layout.label} · ${width}x${height}px`
  return `Custom · ${width}x${height}px`
}

export function panelCount(layout: Pick<PanelLayout, "cols" | "rows">): number {
  return layout.cols * layout.rows
}
