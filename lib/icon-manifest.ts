// Must stay in sync with Arduino_code/include/icons.h's ICONS[] — the web
// editor must never let someone pick an icon id the firmware can't draw.
export const ICON_MANIFEST = [
  { id: "dot", label: "Dot" },
  { id: "ring", label: "Ring" },
  { id: "cross", label: "Cross" },
  { id: "triangle", label: "Triangle" },
  { id: "square", label: "Square" },
] as const

export type IconId = (typeof ICON_MANIFEST)[number]["id"]
