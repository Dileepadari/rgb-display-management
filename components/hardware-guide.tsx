"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { WiringDiagram } from "@/components/wiring-diagram"
import {
  BOARDS,
  DEFAULT_BOARD_ID,
  HUB75_PINS,
  PIN_ORDER,
  SIGNAL_OF,
  boardById,
  pinCaution,
  type BoardProfile,
  type PinMap,
} from "@/lib/board-profiles"
import { cn } from "@/lib/utils"
import { AlertTriangle, Ban, Cable, ChevronDown, CircleCheck, Cpu, Plug, Terminal, Zap } from "lucide-react"

const SUPPORT_BADGE = {
  full: { label: "Supported", className: "border-success/30 bg-success/10 text-success" },
  partial: { label: "Needs changes", className: "border-warning/30 bg-warning/10 text-warning" },
  none: { label: "Not supported", className: "border-destructive/30 bg-destructive/10 text-destructive" },
} as const

function gpioFor(signal: string, pins: PinMap): number | null {
  const key = PIN_ORDER.find((k) => SIGNAL_OF[k] === signal)
  return key ? pins[key] : null
}

function Step({
  n,
  title,
  icon: Icon,
  children,
}: {
  n: number
  title: string
  icon: typeof Cable
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base">
          <span className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold">
            {n}
          </span>
          <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">{children}</CardContent>
    </Card>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-muted text-foreground overflow-x-auto rounded-lg border border-border p-3 font-mono text-xs leading-relaxed">
      {children}
    </pre>
  )
}

/** Shown instead of the steps when the selected board simply can't run this. */
function Unsupported({ board }: { board: BoardProfile }) {
  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Ban className="text-destructive h-4 w-4 shrink-0" />
          <span>{board.label} can&apos;t run this firmware</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        {board.notes.map((note, i) => (
          <p key={i} className="text-muted-foreground">
            {note}
          </p>
        ))}
        {board.alternative && (
          <p className="border-l-2 border-primary bg-muted/50 rounded-r px-4 py-3">
            <strong>What to use instead:</strong> {board.alternative}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function HardwareGuide() {
  const [boardId, setBoardId] = useState(DEFAULT_BOARD_ID)
  const board = boardById(boardId)
  const badge = SUPPORT_BADGE[board.support]

  const families = Array.from(new Set(BOARDS.map((b) => b.family)))

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-8 lg:px-10">
      <PageHeader
        title="Hardware"
        purpose="Wire a panel to a board, flash it, and get it showing your scenes - start to finish."
        howTo={
          <ul>
            <li>Pick your board at the top; the wiring and steps below change to match it.</li>
            <li>Do the wiring before the software - nothing on screen helps a panel that isn&apos;t connected.</li>
            <li>Everything here is also in the repo, under <code>Arduino_code/</code>.</li>
          </ul>
        }
      />

      {/* Board picker */}
      <Card className="border-primary/30">
        <CardContent className="flex flex-wrap items-end gap-4 pt-6">
          <div className="min-w-64 flex-1 space-y-1">
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
              <Cpu className="h-3.5 w-3.5" />
              Which board are you using?
            </label>
            <Select value={boardId} onValueChange={setBoardId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {families.map((family) => (
                  <SelectGroup key={family}>
                    <SelectLabel>{family}</SelectLabel>
                    {BOARDS.filter((b) => b.family === family).map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 pb-1">
            <Badge variant="outline" className={badge.className}>
              {board.support === "full" ? (
                <CircleCheck className="h-3 w-3" />
              ) : board.support === "partial" ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <Ban className="h-3 w-3" />
              )}
              {badge.label}
            </Badge>
          </div>
          <p className="text-muted-foreground w-full text-sm">{board.summary}</p>
        </CardContent>
      </Card>

      {board.support === "none" ? (
        <Unsupported board={board} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr] xl:items-start">
          <div className="space-y-6">
            <Step n={1} title="What you'll need" icon={Plug}>
              <ul className="text-muted-foreground list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="text-foreground">{board.label}</strong>
                </li>
                <li>One or more <strong className="text-foreground">64&times;64 HUB75 panels</strong> - all the same size</li>
                <li>
                  A <strong className="text-foreground">5V power supply</strong>, roughly 4&nbsp;A per panel
                </li>
                <li>The 16-pin IDC ribbon that came with the panel, and jumper wires</li>
              </ul>
              <p className="border-l-2 border-warning bg-warning/5 rounded-r px-4 py-3">
                <strong>USB cannot power a panel.</strong> One fully-lit 64&times;64 panel draws around 4&nbsp;A;
                USB gives you 0.5&nbsp;A. Trying it browns out the board - it&apos;s the most common reason
                &ldquo;it doesn&apos;t work&rdquo;.
              </p>
            </Step>

            <Step n={2} title="Wire the panel" icon={Cable}>
              <p className="text-muted-foreground">
                Panels have two 16-pin headers: <strong className="text-foreground">IN</strong> and{" "}
                <strong className="text-foreground">OUT</strong>. Connect to <strong className="text-foreground">IN</strong> -
                the silkscreened arrow points away from it. Pin 1 is marked with a triangle or a square solder pad.
              </p>

              {board.pins ? (
                <>
                  <WiringDiagram pins={board.pins} />
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-muted-foreground border-b border-border">
                        <tr>
                          <th className="py-2 pr-3 font-medium">Pin</th>
                          <th className="py-2 pr-3 font-medium">Signal</th>
                          <th className="py-2 pr-3 font-medium">GPIO</th>
                          <th className="py-2 font-medium">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {HUB75_PINS.map(({ pin, signal, role }) => {
                          const gpio = gpioFor(signal, board.pins!)
                          const caution = gpio === null ? null : pinCaution(gpio)
                          return (
                            <tr key={pin}>
                              <td className="py-1.5 pr-3 font-mono tabular-nums">{pin}</td>
                              <td className="py-1.5 pr-3 font-mono font-semibold">{signal}</td>
                              <td className="py-1.5 pr-3 font-mono font-semibold">
                                {gpio === null ? "GND" : gpio}
                              </td>
                              <td className={cn("py-1.5", caution ? "text-warning" : "text-muted-foreground")}>
                                {caution ?? role}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p className="border-l-2 border-warning bg-warning/5 rounded-r px-4 py-3">
                  There&apos;s no recommended pin map for this board - see the board notes below. Pick free GPIOs
                  and set them in the <code>i2s_pins</code> struct in <code>src/main.cpp</code>.
                </p>
              )}

              {board.notes.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="text-muted-foreground hover:text-foreground group flex items-center gap-1.5 text-xs font-medium transition-colors">
                    Why these pins, and what to watch for
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="text-muted-foreground mt-2 space-y-2 rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed">
                    {board.notes.map((note, i) => (
                      <p key={i}>{note}</p>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </Step>

            <Step n={3} title="Power it" icon={Zap}>
              <Code>{`5V PSU ──┬── panel 5V   (screw terminals on the panel)
         └── board 5V/VIN   (optional, if not on USB)

PSU GND ─┬── panel GND
         └── board GND      ← REQUIRED`}</Code>
              <p className="text-muted-foreground">
                <strong className="text-foreground">The board and the panel must share a ground.</strong> Without
                it the data lines have no common reference, and you get flicker, wrong colours, or nothing - even
                though the wiring looks right.
              </p>
              <p className="text-muted-foreground">
                For a multi-panel wall, run 5V to <em>every</em> panel from the supply. The ribbon cannot carry
                tens of amps.
              </p>
            </Step>

            <Step n={4} title="Chain more panels (optional)" icon={Cable}>
              <Code>{`board ──▶ [IN] Panel 1 [OUT] ──▶ [IN] Panel 2 [OUT] ──▶ ...`}</Code>
              <p className="text-muted-foreground">
                Data chaining needs no extra GPIO wiring - only the first panel connects to the board. Then
                declare the shape in <code>Arduino_code/include/panel_config.h</code>:
              </p>
              <Code>{`#define PANEL_GRID_ROWS 3   // panels tall
#define PANEL_GRID_COLS 3   // panels wide
#define PANEL_CHAIN_TYPE CHAIN_TOP_LEFT_DOWN`}</Code>
              <p className="text-muted-foreground">
                This is a compile-time constant - the driver needs it before any network traffic - so rearranging
                panels means reflashing. Changing what&apos;s <em>displayed</em> never does.
              </p>
            </Step>

            <Step n={5} title="Flash the firmware" icon={Terminal}>
              <p className="text-muted-foreground">
                Install PlatformIO, then set your board in <code>Arduino_code/platformio.ini</code>:
              </p>
              <Code>{`board = ${board.pioBoard ?? "esp32dev"}`}</Code>
              <p className="text-muted-foreground">
                Copy <code>include/secrets.example.h</code> to <code>include/secrets.h</code> and fill in WiFi, the
                backend URL, this device&apos;s API token, and its ThingSpeak keys. Then:
              </p>
              <Code>{`cd Arduino_code
pio run --target upload
pio device monitor        # 115200 baud`}</Code>
            </Step>

            <Step n={6} title="Connect it to this app" icon={Cpu}>
              <ol className="text-muted-foreground list-decimal space-y-1.5 pl-5">
                <li>
                  Add the device on the <strong className="text-foreground">Devices</strong> page, using the same
                  device ID you flashed.
                </li>
                <li>Set the wall shape, brightness and timezone there - those need no reflash.</li>
                <li>
                  Press <strong className="text-foreground">Identify</strong> to push a test pattern and confirm
                  orientation and chain order.
                </li>
                <li>
                  Build a scene, then <strong className="text-foreground">Push</strong> it. The panel picks it up
                  within about ten seconds.
                </li>
              </ol>
            </Step>
          </div>

          {/* Troubleshooting rail */}
          <Card className="xl:sticky xl:top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="text-muted-foreground h-4 w-4" />
                If it doesn&apos;t work
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border p-0">
              {[
                ["Nothing lights up at all", "No 5V at the panel, or no shared ground with the board."],
                ["Flickering or random pixels", "Undersized supply, or a missing common ground."],
                ["Red and blue swapped", "R and B lines crossed - check pins 1/3 and 5/7."],
                ["Top half fine, bottom half dark", "R2/G2/B2 (pins 5-7) not connected."],
                ["Image doubled or squashed", "Wrong scan rate - check pin 8 (E) and PANEL_RES_Y."],
                ["Board dies when the ribbon is plugged in", "A strapping pin is being held high at boot - GPIO 12 is the usual culprit."],
                ["Panels in the wrong order", "PANEL_CHAIN_TYPE doesn't match how you wired the chain."],
                ["Serial monitor unreadable", "CLK is on a UART pin - move it to a free GPIO."],
                ["Device never shows as online", "The heartbeat needs an external scheduler; see DEVDOC.md."],
              ].map(([symptom, cause]) => (
                <div key={symptom} className="px-6 py-3">
                  <p className="text-sm font-medium">{symptom}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{cause}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
