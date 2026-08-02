# Firmware setup

This firmware drives one or more daisy-chained 64×64 HUB75 RGB LED panels from
a single ESP32, using [ESP32-HUB75-MatrixPanel-I2S-DMA](https://github.com/mrfaptastic/ESP32-HUB75-MatrixPanel-I2S-DMA)
(installed automatically via `platformio.ini`). It polls a ThingSpeak channel
for a "something changed" flag, then fetches the actual scene/playlist content
from the web app and renders + animates it locally. See the repo root's
`shimmering-yawning-frog.md` plan for the full architecture; this doc is just
the practical "how do I flash this" reference.

## 1. Install PlatformIO

If you don't already have it:

```bash
pipx install platformio   # or: pip install --user platformio
```

VS Code users can instead install the "PlatformIO IDE" extension, which gives
you the same thing with a GUI.

## 2. Wiring

The panel-to-ESP32 connection - the 16-pin HUB75 connector, the GPIO map, power
and chaining - is in **[README.md](README.md)**. Do that first; nothing below
will show anything on a panel that isn't wired.

Short version: the ESP32 goes to the panel's **IN** connector, the two must
share a ground, and the panel needs its own 5V supply (roughly 4 A per 64×64
module - USB cannot do it).

## 3. Declare your panel arrangement - `include/panel_config.h`

This is the file you edit and reflash whenever you physically add, remove, or
rearrange panels. It does **not** need to change when you change what's being
displayed - that's all fetched over the network at runtime.

```c
#define PANEL_RES_X 64        // pixels per panel, width
#define PANEL_RES_Y 64        // pixels per panel, height
#define PANEL_GRID_ROWS 3     // how many panels tall
#define PANEL_GRID_COLS 3     // how many panels wide
#define PANEL_CHAIN_TYPE CHAIN_TOP_LEFT_DOWN
```

**Worked example - your 9 panels today:**
- All 9 in a single 3×3 square: `PANEL_GRID_ROWS=3`, `PANEL_GRID_COLS=3`.
- All 9 in one long strip: `PANEL_GRID_ROWS=1`, `PANEL_GRID_COLS=9`.
- A 2×4 block (8 panels) with 1 spare: `PANEL_GRID_ROWS=2`, `PANEL_GRID_COLS=4`.

Total resolution is computed automatically (`PANEL_RES_X * PANEL_GRID_COLS`
by `PANEL_RES_Y * PANEL_GRID_ROWS`) - a 3×3 arrangement is 192×192.

**`PANEL_CHAIN_TYPE`** describes *how the daisy-chain snakes across that grid*
as you physically wired it - this is about wiring order, not the visual
"shape". If your chain starts at the top-left panel and serpentines downward
column by column (the most common way to hand-wire a grid), leave this as
`CHAIN_TOP_LEFT_DOWN`. If you wired it differently, the full list of options
is in `.pio/libdeps/upesy_wroom/ESP32 HUB75 LED MATRIX PANEL DMA Display/src/ESP32-HUB75-VirtualMatrixPanel_T.hpp`
(search `enum PANEL_CHAIN_TYPE`) - `CHAIN_TOP_RIGHT_DOWN`, `CHAIN_BOTTOM_LEFT_UP`,
etc., plus `_ZZ` zigzag variants. If the rendered image looks scrambled/mirrored
after flashing, this is almost always the setting to change - try the options
one at a time.

## 4. Credentials - `include/secrets.h`

Gitignored, never committed. Copy `include/secrets.example.h` to
`include/secrets.h` and fill in:

- `WIFI_SSID` / `WIFI_PASSWORD` - your network. Leave `WIFI_USERNAME` empty
  for a normal home/personal WiFi network; fill it in only for
  WPA2-Enterprise networks (university/office) that require a username.
- `THINGSPEAK_READ_API_KEY` / `THINGSPEAK_WRITE_API_KEY` / `THINGSPEAK_CHANNEL_ID`
  - this device's dedicated ThingSpeak channel (see Part 1.4/1.5 of the plan
  - every device gets its own channel once you have more than one).
- `BACKEND_BASE_URL` - where the web app is reachable from the ESP32's
  network. A deployed URL (`https://your-app.vercel.app`) for production, or
  `http://<your-computer's-LAN-IP>:3000` for local development (the ESP32 and
  your dev machine need to be on the same network for that to work).
- `DEVICE_API_TOKEN` - generated when you create the device row in the web
  app's Devices page; copy it in from there.

## 5. Build and flash

```bash
cd Arduino_code
pio run                      # compile only, verify it builds
pio run --target upload      # compile + flash over USB
pio device monitor            # watch serial output (115200 baud)
```

On boot you should see, on the panel itself: "Booting..." (yellow) →
"WiFi OK" (green) or "WiFi FAIL" (red) → blank, then whatever scene/playlist
is assigned to this device within ~10s of it appearing in the web app.

## 6. "I rearranged my panels" checklist

1. Physically rewire the chain (unplug/replug HUB75 cables as needed).
2. Update `PANEL_GRID_ROWS` / `PANEL_GRID_COLS` (and `PANEL_CHAIN_TYPE` if the
   wiring order changed) in `include/panel_config.h`.
3. Reflash: `pio run --target upload`.
4. In the web app's Devices page, update this device's panel columns/rows to
   match (informational - used for preview sizing and image-upload cropping,
   but keeping it in sync avoids confusing mismatches). Use the **Identify**
   button there to push a test pattern and confirm the new arrangement renders
   correctly before assigning a real scene.

## 7. What the panel does on its own

Everything below runs on the ESP32 with no help from the website. The site is
for authoring; once content is fetched, unplugging your computer changes
nothing.

| Feature | Where it comes from |
| --- | --- |
| Text, scrolling text, images, icons, characters | Scene elements in the feed |
| Clock | The chip's own NTP-synced time |
| Weather | The device fetches Open-Meteo directly, ~every 15 min |
| Animations (scroll/blink/pulse/rainbow/bounce) | Ticked locally each frame |
| Playlist rotation, loop, shuffle | Local timers; the whole playlist is cached |
| Mood reactions (enter → emote → stay/leave) | Cached with the content, timed locally |
| Brightness, timezone | Sent with the feed - **no reflash needed to change these** |

Brightness and timezone are edited on the web app's Devices page and travel
with the content. Panel *arrangement* is the exception: it is a compile-time
constant (step 3) because the display driver needs it before any network
traffic happens.

### Timezone format

The web app stores **POSIX TZ strings**, not IANA names, because the ESP32 has
no tzdata to resolve `Asia/Kolkata` with. `IST-5:30` and
`GMT0BST,M3.5.0/1,M10.5.0` are the sort of thing it expects - the offset sign
is inverted by the POSIX spec, and the trailing rule is what gives you
automatic daylight saving. Picking a zone in the Devices dialog sets this for
you; the list lives in `lib/timezones.ts`. If an IANA name reaches the device
it logs a warning and falls back to the compile-time offset rather than
silently showing the wrong time.

## Troubleshooting

- **Nothing lights up at all**: check 5V power to the panels (a fully-lit
  64×64 panel can draw several amps - the ESP32's own USB power is *not*
  enough, panels need their own 5V supply), and that `OE`/`LAT`/`CLK` pins
  aren't shared with anything else on the board.
- **Wrong colors / half the panel dark**: usually a chain-type or scan-type
  mismatch - see the `PANEL_CHAIN_TYPE` note above.
- **Flickering**: try lowering `mxconfig.i2sspeed` in `setupMatrix()` (in
  `src/main.cpp`) from the default down to `HZ_8M`.
- **Crashes/reboots on large arrangements**: a plain ESP32 WROOM has ~320KB
  RAM shared between WiFi/TLS buffers, the playlist cache, and any in-flight
  image pixel buffers. If you build a very large arrangement (e.g. a 3×3 of
  192×192 with several big images in a long playlist) and see instability,
  reduce `MAX_ELEMENTS` / `MAX_PLAYLIST_ITEMS` in `include/elements.h`, or
  consider an ESP32 module with PSRAM.
- **Serial monitor shows `[main] device-feed fetch failed`**: double check
  `BACKEND_BASE_URL` is reachable from the ESP32's network and
  `DEVICE_API_TOKEN` matches what's in the web app for this device.
- **Clock shows nothing**: the panel needs NTP before it can draw a time. It
  reconfigures time on every WiFi (re)connect, so this usually means WiFi
  never came up - check the serial log for `WiFi up, (re)configuring time`.
- **Clock is off by hours**: the timezone is a POSIX TZ string, not an IANA
  name (see step 7). A warning in the serial log names the offending value.
- **Panel is too bright / too dim**: brightness comes from the web app now.
  Change it on the Devices page and push any scene - no reflash.
- **Playlist plays fewer scenes than the editor shows**: the firmware caches
  the whole playlist in RAM, so it is capped at `MAX_PLAYLIST_ITEMS` (12). The
  web editor enforces the same cap, so this should no longer be reachable - if
  you see it, the two have drifted and `scripts/firmware-parity.test.ts` will
  say so.

## Keeping the firmware and website in step

Two implementations of the same feature set drift silently, and a drift only
shows up on real hardware. Two guards exist:

- `scripts/characters-header.test.ts` fails if `include/characters.h` is stale
  relative to `lib/character-sprites.ts`. Regenerate with
  `npx vite-node scripts/generate-characters-header.ts`.
- `scripts/firmware-parity.test.ts` reads the firmware sources and fails if the
  website can produce something the panel cannot render - a new element type,
  animation, character, emote, mood entrance, or a capacity mismatch.

Run both with `npx vitest run` from the repo root before flashing.
