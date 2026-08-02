"use client"

import { HUB75_PINS, SIGNAL_OF, type PinKind, type PinMap } from "@/lib/board-profiles"

// The same ladder as Arduino_code/docs/wiring.svg, but built from the selected
// board's pin map rather than baked in — so switching board in the guide
// redraws the wiring instead of showing a diagram that quietly disagrees with
// the table underneath it.

const WIRE: Record<PinKind, string> = {
  red: "#e05252",
  green: "#3fb95a",
  blue: "#5b8def",
  address: "#e0973f",
  control: "#a879ea",
  ground: "#8a8594",
}

const ROW_H = 26
const TOP = 58
const ESP_RIGHT = 232
const HUB_LEFT = 470
const WIDTH = 700

/** GPIO for a HUB75 signal name, or null for the ground pins. */
function gpioFor(signal: string, pins: PinMap): number | null {
  const key = (Object.keys(SIGNAL_OF) as (keyof PinMap)[]).find((k) => SIGNAL_OF[k] === signal)
  return key ? pins[key] : null
}

export function WiringDiagram({ pins }: { pins: PinMap }) {
  const height = TOP + HUB75_PINS.length * ROW_H + 34
  const boxTop = TOP - 34
  const boxBottom = TOP + (HUB75_PINS.length - 1) * ROW_H + 18

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="min-w-[620px] w-full"
        role="img"
        aria-label="HUB75 connector to ESP32 GPIO wiring"
      >
        {/* Boards */}
        <rect x={64} y={boxTop} width={168} height={boxBottom - boxTop} rx={8}
              className="fill-card stroke-border" strokeWidth={1.5} />
        <text x={148} y={boxTop + 22} textAnchor="middle" className="fill-foreground" fontSize={12} fontWeight={700}>
          Your board
        </text>
        <rect x={HUB_LEFT} y={boxTop} width={172} height={boxBottom - boxTop} rx={8}
              className="fill-card stroke-border" strokeWidth={1.5} />
        <text x={HUB_LEFT + 86} y={boxTop + 22} textAnchor="middle" className="fill-foreground" fontSize={12} fontWeight={700}>
          HUB75 IN
        </text>

        {HUB75_PINS.map(({ pin, signal, kind }, i) => {
          const y = TOP + i * ROW_H
          const colour = WIRE[kind]
          const gpio = gpioFor(signal, pins)
          const label = gpio === null ? "GND" : `GPIO ${gpio}`
          return (
            <g key={pin}>
              <line
                x1={ESP_RIGHT} y1={y} x2={HUB_LEFT} y2={y}
                stroke={colour} strokeWidth={2.2}
                strokeDasharray={kind === "ground" ? "5 4" : undefined}
              />
              <circle cx={ESP_RIGHT} cy={y} r={3.2} fill={colour} />
              <circle cx={HUB_LEFT} cy={y} r={3.2} fill={colour} />
              <text x={ESP_RIGHT - 12} y={y + 4} textAnchor="end"
                    className="fill-foreground font-mono" fontSize={11.5} fontWeight={600}>
                {label}
              </text>
              <rect x={HUB_LEFT + 10} y={y - 8} width={24} height={16} rx={3} fill={colour} opacity={0.16} />
              <text x={HUB_LEFT + 22} y={y + 4} textAnchor="middle" fill={colour}
                    className="font-mono" fontSize={10} fontWeight={700}>
                {pin}
              </text>
              <text x={HUB_LEFT + 42} y={y + 4} className="fill-foreground font-mono" fontSize={11.5} fontWeight={600}>
                {signal}
              </text>
            </g>
          )
        })}

        <text x={HUB_LEFT + 86} y={boxBottom + 22} textAnchor="middle"
              className="fill-muted-foreground" fontSize={10}>
          pin 8 is E on 64x64, GND on 64x32
        </text>
        <text x={148} y={boxBottom + 22} textAnchor="middle" className="fill-muted-foreground" fontSize={10}>
          connect at least one GND
        </text>
      </svg>
    </div>
  )
}
