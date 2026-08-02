// Per-board setup data for the Hardware guide.
//
// Support levels are taken from the driver this firmware uses
// (ESP32-HUB75-MatrixPanel-I2S-DMA), whose own library.properties reads
// "HUB75 LED Matrix Library for ESP32, ESP32-S2 and ESP32-S3". Anything
// outside that list genuinely cannot run this firmware, and the guide says so
// rather than inventing steps that would waste someone's afternoon.

/** Order matters: this is the physical order of the 16-pin HUB75 header. */
export const HUB75_PINS = [
  { pin: 1, signal: "R1", kind: "red", role: "Red, upper half" },
  { pin: 2, signal: "G1", kind: "green", role: "Green, upper half" },
  { pin: 3, signal: "B1", kind: "blue", role: "Blue, upper half" },
  { pin: 4, signal: "GND", kind: "ground", role: "Ground" },
  { pin: 5, signal: "R2", kind: "red", role: "Red, lower half" },
  { pin: 6, signal: "G2", kind: "green", role: "Green, lower half" },
  { pin: 7, signal: "B2", kind: "blue", role: "Blue, lower half" },
  { pin: 8, signal: "E", kind: "address", role: "Row address bit 4 — GND on 64x32 panels" },
  { pin: 9, signal: "A", kind: "address", role: "Row address bit 0" },
  { pin: 10, signal: "B", kind: "address", role: "Row address bit 1" },
  { pin: 11, signal: "C", kind: "address", role: "Row address bit 2" },
  { pin: 12, signal: "D", kind: "address", role: "Row address bit 3" },
  { pin: 13, signal: "CLK", kind: "control", role: "Pixel clock" },
  { pin: 14, signal: "LAT", kind: "control", role: "Latch / strobe" },
  { pin: 15, signal: "OE", kind: "control", role: "Output enable (active low)" },
  { pin: 16, signal: "GND", kind: "ground", role: "Ground" },
] as const

export type PinKind = (typeof HUB75_PINS)[number]["kind"]

/** GPIO per signal, in the order the firmware's `i2s_pins` struct expects. */
export interface PinMap {
  r1: number; g1: number; b1: number
  r2: number; g2: number; b2: number
  a: number; b: number; c: number; d: number; e: number
  lat: number; oe: number; clk: number
}

export const PIN_ORDER: (keyof PinMap)[] = [
  "r1", "g1", "b1", "r2", "g2", "b2", "a", "b", "c", "d", "e", "lat", "oe", "clk",
]

/** Signal name (as printed on the panel) for each PinMap key. */
export const SIGNAL_OF: Record<keyof PinMap, string> = {
  r1: "R1", g1: "G1", b1: "B1", r2: "R2", g2: "G2", b2: "B2",
  a: "A", b: "B", c: "C", d: "D", e: "E", lat: "LAT", oe: "OE", clk: "CLK",
}

export type Support = "full" | "partial" | "none"

export interface BoardProfile {
  id: string
  label: string
  /** Grouping in the filter. */
  family: string
  support: Support
  /** One line under the board name. */
  summary: string
  /** PlatformIO `board =` value. */
  pioBoard?: string
  pins?: PinMap
  /** Why this map, or what to watch out for. */
  notes: string[]
  /** Only for unsupported boards: what to do instead. */
  alternative?: string
}

// Avoids every ESP32 strapping pin (0/2/5/12/15), both UART pins (1/3), the
// flash pins (6-11) and the input-only pins (34-39). Derived from the chip's
// pin restrictions — see the note on the board profile.
const DEVKIT_SAFE: PinMap = {
  r1: 25, g1: 26, b1: 27,
  r2: 14, g2: 13, b2: 4,
  a: 23, b: 19, c: 18, d: 17, e: 16,
  lat: 21, oe: 22, clk: 33,
}

// What this project is actually wired and flashed with.
const AS_BUILT: PinMap = {
  r1: 27, g1: 26, b1: 14,
  r2: 12, g2: 25, b2: 15,
  a: 32, b: 17, c: 33, d: 16, e: 5,
  lat: 2, oe: 4, clk: 1,
}

// WROVER's PSRAM occupies GPIO 16 and 17, which leaves only 13 unrestricted
// pins for 14 signals — so exactly one strapping pin is unavoidable. GPIO 5 is
// the mildest (it only sets SDIO timing and has an internal pull-up), and it's
// put on E rather than CLK to keep it off the most timing-critical line.
const WROVER: PinMap = {
  r1: 25, g1: 26, b1: 27,
  r2: 14, g2: 13, b2: 4,
  a: 23, b: 19, c: 18, d: 32, e: 5,
  lat: 21, oe: 22, clk: 33,
}

export const BOARDS: BoardProfile[] = [
  {
    id: "esp32-devkit",
    label: "ESP32 DevKit",
    family: "ESP32",
    support: "full",
    summary: "DOIT DevKit V1, ESP32-DevKitC, NodeMCU-32S — the usual 30/38-pin board.",
    pioBoard: "esp32dev",
    pins: DEVKIT_SAFE,
    notes: [
      "This map deliberately avoids all four strapping pins. GPIO 12 in particular will stop the board booting if a panel holds it high at power-on — the symptom is a board that works alone but goes dead the moment the ribbon is plugged in.",
      "It also leaves GPIO 1 free, so the serial monitor stays readable while the panel is running.",
      "Derived from the ESP32's pin restrictions rather than from a tested build — change one thing at a time with the serial monitor open.",
    ],
  },
  {
    id: "esp32-wroom-asbuilt",
    label: "ESP32 WROOM (this project's wiring)",
    family: "ESP32",
    support: "full",
    summary: "The pin map currently in src/main.cpp, matching the hardware this was built on.",
    pioBoard: "upesy_wroom",
    pins: AS_BUILT,
    notes: [
      "Uses GPIO 12, 15, 5 and 2 — all strapping pins — plus GPIO 1, which is the USB serial TX. It works on the board it was built for, but it is not the map to copy onto a fresh DevKit.",
      "Because CLK sits on GPIO 1, serial output is unreliable while the panel is running.",
      "If your wiring already matches this and it boots, leave it alone.",
    ],
  },
  {
    id: "esp32-wrover",
    label: "ESP32 WROVER",
    family: "ESP32",
    support: "full",
    summary: "WROOM with PSRAM. Same chip, but GPIO 16 and 17 are taken.",
    pioBoard: "esp32dev",
    pins: WROVER,
    notes: [
      "GPIO 16 and 17 are wired to the PSRAM and cannot be used for the panel.",
      "That leaves 13 unrestricted pins for 14 signals, so one strapping pin is unavoidable. GPIO 5 is used for E — it only sets SDIO timing and has an internal pull-up, making it the safest of the five.",
      "The extra RAM is genuinely useful here: large images and long playlists are what run this chip out of memory.",
    ],
  },
  {
    id: "esp32-s3",
    label: "ESP32-S3",
    family: "ESP32",
    support: "partial",
    summary: "Supported by the display driver, but this firmware needs configuration changes.",
    pioBoard: "esp32-s3-devkitc-1",
    notes: [
      "The driver supports the S3 — it drives the panel through the LCD peripheral rather than I2S — but this firmware has only been built and run against the original ESP32.",
      "Almost any GPIO can be used on the S3, so there is no single recommended map. Avoid the pins your specific module uses for flash and PSRAM (often 26-32, and 33-37 on octal-PSRAM modules); check your board's datasheet.",
      "Set the pins in the `i2s_pins` struct in src/main.cpp as usual, and expect to adjust clock speed if the panel flickers.",
    ],
  },
  {
    id: "esp32-s2",
    label: "ESP32-S2",
    family: "ESP32",
    support: "partial",
    summary: "Supported by the display driver; single-core, and untested with this firmware.",
    pioBoard: "esp32-s2-saola-1",
    notes: [
      "Listed as supported by the display driver, but the S2 is single-core — WiFi, HTTPS and the render loop all share one core, so expect lower frame rates than the original ESP32.",
      "No recommended pin map: choose free GPIOs on your module and set them in the `i2s_pins` struct.",
    ],
  },
  {
    id: "esp32-c3",
    label: "ESP32-C3",
    family: "ESP32",
    support: "none",
    summary: "Cannot drive a HUB75 panel with this firmware.",
    notes: [
      "The C3 has no parallel I2S or LCD peripheral, which is the mechanism the driver uses to push pixels fast enough. The library's own description covers ESP32, ESP32-S2 and ESP32-S3 only.",
    ],
    alternative: "Use an ESP32 DevKit, WROVER, or an S3.",
  },
  {
    id: "arduino-avr",
    label: "Arduino Uno / Mega / Nano",
    family: "Arduino",
    support: "none",
    summary: "Not enough speed, memory, or networking.",
    notes: [
      "These are 8-bit AVR boards at 16 MHz with 2-8 KB of RAM. A single 64x64 frame alone is more memory than they have, and they cannot refresh a HUB75 panel at a usable rate.",
      "They also have no WiFi, so they could not fetch scenes from the web app at all.",
    ],
    alternative: "Use an ESP32 DevKit — it is comparable in price and is what this firmware targets.",
  },
  {
    id: "arduino-r4-wifi",
    label: "Arduino Uno R4 WiFi",
    family: "Arduino",
    support: "none",
    summary: "Has WiFi, but the display driver does not support its chip.",
    notes: [
      "The R4 WiFi pairs a Renesas RA4M1 with an ESP32-S3 used only as a network co-processor. The display driver runs on Espressif chips as the main processor, which is not how this board is arranged.",
    ],
    alternative: "Use a standalone ESP32 DevKit or ESP32-S3 board.",
  },
  {
    id: "esp8266",
    label: "ESP8266 / NodeMCU",
    family: "Other",
    support: "none",
    summary: "No I2S parallel output for HUB75, and too little RAM.",
    notes: [
      "The ESP8266 can drive small HUB75 panels with a different library (PxMatrix) using bit-banging, but not with this driver, and not at 64x64 with images and playlists cached in RAM.",
    ],
    alternative: "Use an ESP32 DevKit.",
  },
  {
    id: "pico",
    label: "Raspberry Pi Pico / Pico W",
    family: "Other",
    support: "none",
    summary: "Capable hardware, but a different ecosystem entirely.",
    notes: [
      "The Pico's PIO can drive HUB75 very well, but this firmware is Arduino/ESP32 code built around Espressif's WiFi stack and I2S DMA driver. Porting it would mean rewriting the display and networking layers.",
    ],
    alternative: "Use an ESP32 DevKit to run this firmware as-is.",
  },
]

export const DEFAULT_BOARD_ID = "esp32-devkit"

export function boardById(id: string): BoardProfile {
  return BOARDS.find((b) => b.id === id) ?? BOARDS[0]
}

// ── Pin safety, used to annotate the wiring table ──────────────────────────
const STRAPPING = new Set([0, 2, 5, 12, 15])
const UART = new Set([1, 3])
const FLASH = new Set([6, 7, 8, 9, 10, 11])
const INPUT_ONLY = new Set([34, 35, 36, 37, 38, 39])

/** A warning for this GPIO on a classic ESP32, or null when it's unremarkable. */
export function pinCaution(gpio: number): string | null {
  if (FLASH.has(gpio)) return "Wired to the flash chip — must not be used"
  if (INPUT_ONLY.has(gpio)) return "Input-only — cannot drive a panel"
  if (gpio === 12) return "Strapping pin: held high at boot, the board will not start"
  if (STRAPPING.has(gpio)) return "Strapping pin — read by the chip at boot"
  if (UART.has(gpio)) return "USB serial pin — serial output becomes unreliable"
  return null
}
