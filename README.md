# RGB Display Manager

Design what your LED matrix wall shows from a browser, and let the panel run it
on its own.

Point it at an ESP32 driving a chain of HUB75 panels and you get a scene editor,
playlists, and animated characters - authored on the web, rendered on the
hardware. Once content is pushed, the website can be closed: the panel keeps the
time, fetches its own weather, animates locally, and rotates playlists on its
own timers.

## What it does

**Scenes.** A scene is a stack of elements on a pixel canvas - text, scrolling
text, images, a clock, live weather, icons, and animated pixel characters. Drag
to position, click on the canvas to edit, drag to restack (list order is
z-order). Every element can carry an animation: scroll, blink, pulse, rainbow or
bounce.

**Playlists.** Rotate several scenes, each for a duration you choose, with loop
and shuffle. The whole playlist is cached on the device, so the rotation is
local - nothing depends on the network staying up.

**Moods.** A mood is a *reaction*: a character walks onto the panel, performs an
emote over whatever is already playing, then stays or leaves. Eight characters
(cat, dog, bunny, person, robot, bird, ghost, alien) × nine emotes, with a
choice of entrance, corner, hold time and colour tint. Your content keeps
running underneath.

**Any wall shape.** Panels are 64×64 modules chained together. Pick an
arrangement - 1 panel, 2 side by side, 2×2, 3×3, up to 8 - and the editor,
previews and thumbnails all follow that shape.

**Devices.** Register each ESP32, set brightness and timezone from the web (no
reflash), watch online/offline status, and push a test pattern to work out which
physical panel is which.

## How the pieces fit

```
Browser  ──authors──>  Supabase (Postgres + Storage)
   │                        │
   │ assign/push            │ /api/device-feed/<token>
   ▼                        ▼
ThingSpeak  ──"something changed"──>  ESP32  ──renders──>  HUB75 wall
 (a revision number, nothing else)
```

ThingSpeak carries **only a revision counter**. When it changes, the ESP32
fetches the full scene or playlist from the web app in one request and caches
it. That split is deliberate: ThingSpeak's field size can't hold a scene, and
animation driven over a ~10s poll would look like a slideshow. So the website
authors and previews; the panel renders and animates.

The preview in the browser and the firmware run the *same* formulas - scroll
offsets, animation phases, mood entrance timing - implemented once as a written
spec and twice in code, with tests that fail if the two drift. What you design
is what plays.

## Repository layout

| Path | What's in it |
| --- | --- |
| `app/` | Next.js App Router - pages and the API routes the browser and the device call |
| `components/` | UI. The `*-complete.tsx` files are the live pages |
| `lib/` | Shared logic: scene schema, compositor, sprites, mood lifecycle, panel layouts |
| `Arduino_code/` | ESP32 firmware (PlatformIO). See `Arduino_code/SETUP.md` for wiring and flashing |
| `scripts/` | SQL migrations, the sprite-header generator, and parity tests |

## Getting started

See **[DEVDOC.md](DEVDOC.md)** for requirements, setup, how to run it, and how
the code is organised.

For wiring the panels and flashing the ESP32, see
**[Arduino_code/SETUP.md](Arduino_code/SETUP.md)**.
