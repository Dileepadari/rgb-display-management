import type { SceneElement } from "@/lib/scene-schema"

export interface SceneTemplate {
  id: string
  name: string
  description: string
  elements: (panelWidth: number, panelHeight: number) => SceneElement[]
}

const white: [number, number, number] = [255, 255, 255]

export const SCENE_TEMPLATES: SceneTemplate[] = [
  {
    id: "blank",
    name: "Blank canvas",
    description: "Start from nothing and add your own elements.",
    elements: () => [],
  },
  {
    id: "clock-weather",
    name: "Clock + weather",
    description: "Time on top, current temperature underneath.",
    elements: (w, h) => [
      {
        type: "clock",
        x: 2,
        y: Math.round(h * 0.15),
        size: Math.max(1, Math.floor(w / 64)),
        format: "HH:mm",
        color: white,
        visible: true,
        animation: { type: "none", speed: 0 },
      },
      {
        type: "weather",
        x: 2,
        y: Math.round(h * 0.55),
        size: 1,
        lat: 0,
        lon: 0,
        color: [120, 220, 255],
        visible: true,
        animation: { type: "none", speed: 0 },
      },
    ],
  },
  {
    id: "ticker",
    name: "Scrolling ticker",
    description: "A single line of text scrolling right to left.",
    elements: (_w, h) => [
      {
        type: "scrollText",
        x: 0,
        y: Math.round(h / 2 - 4),
        size: 1,
        text: "Your message here",
        color: white,
        visible: true,
        animation: { type: "scroll", speed: 20 },
      },
    ],
  },
  {
    id: "rainbow-text",
    name: "Rainbow text",
    description: "Static text cycling through the colour wheel.",
    elements: (_w, h) => [
      {
        type: "text",
        x: 2,
        y: Math.round(h / 2 - 4),
        size: 1,
        text: "HELLO",
        color: white,
        visible: true,
        animation: { type: "rainbow", speed: 90 },
      },
    ],
  },
  {
    id: "icon-status",
    name: "Icon + status",
    description: "A pulsing icon beside a short status label.",
    elements: (_w, h) => [
      {
        type: "icon",
        x: 2,
        y: Math.round(h / 2 - 8),
        id: "dot",
        scale: 1,
        color: [80, 240, 140],
        visible: true,
        animation: { type: "pulse", speed: 1 },
      },
      {
        type: "text",
        x: 22,
        y: Math.round(h / 2 - 4),
        size: 1,
        text: "ONLINE",
        color: white,
        visible: true,
        animation: { type: "none", speed: 0 },
      },
    ],
  },
]
