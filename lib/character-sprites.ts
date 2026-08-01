// Animated pixel characters, composed from layers and flattened to frames.
//
// Authoring 8 characters x 9 emotes as 144 hand-drawn 16x16 grids is not
// maintainable, and hand-copying each one into the firmware header is worse.
// So a character is a *body* plus small *patches* (a face, an arm, a prop),
// and the emote list says which patches to stack per frame. Everything is
// flattened at module load into the same `frames: string[][]` shape the
// renderer and Arduino_code/include/characters.h generator already consume —
// so this file is pure authoring convenience with no change downstream.
//
// The face patches are shared across characters, which is deliberate: the
// expressions then read consistently, and adding a character only means
// drawing one body.
//
// A grid cell is a legend code; "." is transparent. In a patch, "." means
// "leave whatever is underneath", which is what makes layering work.

export const CHARACTER_GRID_SIZE = 16

export interface CharacterEmote {
  label: string
  /** Frames per second the frame list cycles at. */
  fps: number
  frames: string[][]
}

export interface CharacterDef {
  label: string
  legend: Record<string, string>
  emotes: Record<string, CharacterEmote>
}

interface Patch {
  row: number
  col: number
  grid: string[]
}

// ── Shared faces ──────────────────────────────────────────────────────────
// 12 wide x 5 tall, sitting at row 4 col 2 on a standard body. Eyes are 3x3
// with a solid pupil so they stay legible at scale 1, where a 1px eye
// disappears entirely.
const FACE_ORIGIN = { row: 4, col: 2 }

const FACES: Record<string, string[]> = {
  open: [
    ".eee....eee.",
    ".epe....epe.",
    ".eee....eee.",
    ".....nn.....",
    "....llll....",
  ],
  blink: [
    "............",
    ".ooo....ooo.",
    "............",
    ".....nn.....",
    "....llll....",
  ],
  happy: [
    "..o.o..o.o..",
    ".o...o.o...o",
    "............",
    ".....nn.....",
    "...oooooo...",
  ],
  sad: [
    ".oo......oo.",
    "..ee....ee..",
    "..ep....pe..",
    ".....nn.....",
    "....oooo....",
  ],
  angry: [
    ".o........o.",
    "..oo....oo..",
    "..ee....ee..",
    ".....nn.....",
    "...oooooo...",
  ],
  love: [
    ".h.h....h.h.",
    ".hhh....hhh.",
    "..h......h..",
    ".....nn.....",
    "...oooooo...",
  ],
  sleep: [
    "............",
    ".ooo....ooo.",
    "............",
    ".....nn.....",
    ".....oo.....",
  ],
  think: [
    ".eee....ooo.",
    ".epe........",
    ".eee........",
    ".....nn.....",
    "......ooo...",
  ],
  dance: [
    "..o.o..o.o..",
    ".o...o.o...o",
    "............",
    ".....nn.....",
    "....oooo....",
  ],
  wink: [
    ".eee........",
    ".epe....ooo.",
    ".eee........",
    ".....nn.....",
    "...oooooo...",
  ],
}

// ── Shared props ──────────────────────────────────────────────────────────
// Arms/limbs are drawn in body colour so they read as part of the character;
// accents (tear, sleep z's, hearts, thought dots) use the 'w'/'h' codes every
// character declares.
const PROPS: Record<string, Patch> = {
  // Arms attach at the torso (rows 11-14 on every body) and reach up past the
  // head when raised, so the gesture reads as an arm rather than a stray nub.
  // A raised arm is capped with a 2px "hand" — at 16px that blob is what makes
  // a wave legible at all.
  armLeftUp: { row: 8, col: 1, grid: ["bbo", "bbo", "ob.", "ob.", "ob.", "ob."] },
  armLeftDown: { row: 11, col: 1, grid: ["ob.", "ob.", "bbo", "bbo"] },
  armRightUp: { row: 8, col: 12, grid: ["obb", "obb", ".bo", ".bo", ".bo", ".bo"] },
  armRightDown: { row: 11, col: 12, grid: [".bo", ".bo", "obb", "obb"] },
  tear: { row: 8, col: 3, grid: ["w", "w"] },
  tearLow: { row: 10, col: 3, grid: ["w", "w"] },
  zzzHigh: { row: 0, col: 12, grid: ["..ww", ".w..", "ww.."] },
  zzzLow: { row: 3, col: 12, grid: ["..ww", ".w..", "ww.."] },
  heartLeft: { row: 1, col: 0, grid: ["h.h", "hhh", ".h."] },
  heartRight: { row: 0, col: 13, grid: ["h.h", "hhh", ".h."] },
  thinkDots: { row: 1, col: 12, grid: ["...w", "..ww", ".www"] },
  thinkDotsBig: { row: 0, col: 12, grid: ["..ww", ".www", "wwww"] },
}

function applyPatch(frame: string[], patch: Patch): string[] {
  const out = frame.map((r) => r.split(""))
  patch.grid.forEach((patchRow, dy) => {
    const y = patch.row + dy
    if (y < 0 || y >= CHARACTER_GRID_SIZE) return
    for (let dx = 0; dx < patchRow.length; dx++) {
      const x = patch.col + dx
      if (x < 0 || x >= CHARACTER_GRID_SIZE) continue
      const code = patchRow[dx]
      if (code === ".") continue // transparent in a patch = keep what's below
      out[y][x] = code
    }
  })
  return out.map((r) => r.join(""))
}

function shiftDown(frame: string[], by: number): string[] {
  if (by === 0) return frame
  const blank = ".".repeat(CHARACTER_GRID_SIZE)
  if (by > 0) return [...Array(by).fill(blank), ...frame].slice(0, CHARACTER_GRID_SIZE)
  return [...frame.slice(-by), ...Array(-by).fill(blank)]
}

interface FrameSpec {
  face: string
  props?: string[]
  /** Whole-sprite vertical offset, for bob/hop animation. */
  shiftY?: number
}

interface EmoteSpec {
  label: string
  fps: number
  frames: FrameSpec[]
}

interface CharacterSource {
  label: string
  legend: Record<string, string>
  body: string[]
  /** Some bodies (robot visor, ghost) need the face somewhere other than the default. */
  faceOrigin?: { row: number; col: number }
  /** Per-character replacements for a shared face, when the body demands it. */
  faceOverrides?: Record<string, string[]>
}

// The nine emotes every character plays. Frame lists here are what create the
// motion: alternating faces, moving arms, drifting props, or a 1px body bob.
const EMOTE_SPECS: Record<string, EmoteSpec> = {
  idle: {
    label: "Idle",
    fps: 2,
    frames: [{ face: "open" }, { face: "open" }, { face: "open" }, { face: "open" }, { face: "open" }, { face: "blink" }],
  },
  happy: {
    label: "Happy",
    fps: 4,
    frames: [{ face: "happy" }, { face: "happy", shiftY: -1 }],
  },
  sad: {
    label: "Sad",
    fps: 2,
    frames: [{ face: "sad", props: ["tear"] }, { face: "sad", props: ["tearLow"] }],
  },
  wave: {
    label: "Waving",
    fps: 3,
    frames: [
      { face: "happy", props: ["armRightUp"] },
      { face: "happy", props: ["armRightDown"] },
    ],
  },
  sleep: {
    label: "Sleeping",
    fps: 1,
    frames: [
      { face: "sleep", props: ["zzzLow"] },
      { face: "sleep", props: ["zzzHigh"] },
    ],
  },
  love: {
    label: "In love",
    fps: 3,
    frames: [
      { face: "love", props: ["heartLeft"] },
      { face: "love", props: ["heartRight"] },
    ],
  },
  angry: {
    label: "Angry",
    fps: 6,
    frames: [
      { face: "angry", props: ["armLeftUp", "armRightUp"] },
      { face: "angry", props: ["armLeftDown", "armRightDown"] },
    ],
  },
  dance: {
    label: "Dancing",
    fps: 5,
    frames: [
      { face: "dance", props: ["armLeftUp", "armRightDown"], shiftY: -1 },
      { face: "wink", props: ["armLeftDown", "armRightUp"], shiftY: 1 },
    ],
  },
  think: {
    label: "Thinking",
    fps: 2,
    frames: [
      { face: "think", props: ["thinkDots"] },
      { face: "think", props: ["thinkDotsBig"] },
    ],
  },
}

function buildEmotes(src: CharacterSource): Record<string, CharacterEmote> {
  const origin = src.faceOrigin ?? FACE_ORIGIN
  const out: Record<string, CharacterEmote> = {}

  for (const [emoteId, spec] of Object.entries(EMOTE_SPECS)) {
    out[emoteId] = {
      label: spec.label,
      fps: spec.fps,
      frames: spec.frames.map((frameSpec) => {
        const faceGrid = src.faceOverrides?.[frameSpec.face] ?? FACES[frameSpec.face]
        let frame = applyPatch(src.body, { ...origin, grid: faceGrid })
        for (const propId of frameSpec.props ?? []) {
          frame = applyPatch(frame, PROPS[propId])
        }
        return shiftDown(frame, frameSpec.shiftY ?? 0)
      }),
    }
  }
  return out
}

// ── Bodies ────────────────────────────────────────────────────────────────
// Rows 4-8 are left as flat body colour: that is the face window every shared
// face patch draws into. Bodies keep a 1px outline so the 16px grid spends its
// pixels on silhouette rather than on a thick border.

const CAT_BODY = [
  "..o........o....",
  "..oo......oo....",
  ".obbo....obbo...",
  ".obbboooobbbo...",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  "..obbbbbbbbbo...",
  "...ooooooooo....",
  "....obbbbbo.....",
  "...obbbbbbbo....",
  "...obbbbbbbo....",
  "...obbbbbbbo....",
  "...oo.....oo....",
]

const DOG_BODY = [
  "...ooooooooo....",
  "..obbbbbbbbbo...",
  "obbobbbbbbbobbo.",
  "obbobbbbbbbobbo.",
  "obbobbbbbbbobbo.",
  "obbobbbbbbbobbo.",
  "obbobbbbbbbobbo.",
  "obbobbbbbbbobbo.",
  ".oobbbbbbbbboo..",
  "..obbbbbbbbbo...",
  "...ooooooooo....",
  "....obbbbbo.....",
  "...obbbbbbbo....",
  "...obbbbbbbo....",
  "...obbbbbbbo....",
  "...oo.....oo....",
]

const BUNNY_BODY = [
  "...oo...oo......",
  "..obbo.obbo.....",
  "..obbo.obbo.....",
  "..obbooobbo.....",
  ".obbbbbbbbbo....",
  ".obbbbbbbbbbo...",
  ".obbbbbbbbbbo...",
  ".obbbbbbbbbbo...",
  ".obbbbbbbbbbo...",
  "..obbbbbbbbo....",
  "...ooooooooo....",
  "....obbbbbo.....",
  "...obbbbbbbo....",
  "...obbbbbbbo....",
  "...obbbbbbbo....",
  "...oo.....oo....",
]

const PERSON_BODY = [
  "...ohhhhhho.....",
  "..ohhhhhhhho....",
  "..ohhhhhhhho....",
  "..obbbbbbbbo....",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "...obbbbbbbo....",
  "....ooooooo.....",
  "....ollllo......",
  "...ollllllo.....",
  "...ollllllo.....",
  "...ollllllo.....",
  "...oo....oo.....",
]

const ROBOT_BODY = [
  ".......oo.......",
  "......obbo......",
  "...ooooooooo....",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "...obbbbbbbo....",
  "...ooooooooo....",
  "....obbbbbo.....",
  "..oobbbbbbboo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "...oo.....oo....",
]

const BIRD_BODY = [
  "......ooo.......",
  ".....obbbo......",
  "....obbbbbo.....",
  "...obbbbbbbo....",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  "...obbbbbbbo....",
  "...obbbbbbbo....",
  "...obbbbbbbo....",
  "....obbbbbo.....",
  ".....ooooo......",
  "....oo...oo.....",
  "...oo.....oo....",
]

const GHOST_BODY = [
  ".....ooooo......",
  "...oobbbbboo....",
  "..obbbbbbbbbo...",
  "..obbbbbbbbbo...",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbobbbobbbbo..",
  ".obo.obo.obbbo..",
  "..o...o...ooo...",
]

const ALIEN_BODY = [
  "..o.........o...",
  "...o.......o....",
  "....ooooooo.....",
  "...obbbbbbbo....",
  "..obbbbbbbbbo...",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  "..obbbbbbbbbo...",
  "...obbbbbbbo....",
  "....ooooooo.....",
  "....obbbbbo.....",
  "...obbbbbbbo....",
  "...obbbbbbbo....",
  "...obbbbbbbo....",
  "...oo.....oo....",
]

// Robot and ghost read better with mechanical/hollow eyes than with the
// organic shared set, so they override the faces that would look wrong.
const ROBOT_FACES: Record<string, string[]> = {
  open: [".eeee..eeee.", ".eppe..eppe.", ".eeee..eeee.", "............", "...llllll..."],
  blink: ["............", ".llll..llll.", "............", "............", "...llllll..."],
  sleep: ["............", ".llll..llll.", "............", "............", "....llll...."],
}

const GHOST_FACES: Record<string, string[]> = {
  open: [".ooo....ooo.", ".ooo....ooo.", ".ooo....ooo.", "............", "....oooo...."],
  blink: ["............", ".ooo....ooo.", "............", "............", "....oooo...."],
}

const SOURCES: Record<string, CharacterSource> = {
  cat: {
    label: "Cat",
    legend: { o: "#241a12", b: "#f0a03c", l: "#ffe0b0", e: "#ffffff", p: "#241a12", n: "#ff7a9c", w: "#8ad4ff", h: "#ff5f8f" },
    body: CAT_BODY,
  },
  dog: {
    label: "Dog",
    legend: { o: "#2a1c10", b: "#c8823c", l: "#f6ddb8", e: "#ffffff", p: "#2a1c10", n: "#3a2a1e", w: "#8ad4ff", h: "#ff5f8f" },
    body: DOG_BODY,
  },
  bunny: {
    label: "Bunny",
    legend: { o: "#3a3340", b: "#e8e2ee", l: "#ffd6e2", e: "#ffffff", p: "#3a3340", n: "#ff7a9c", w: "#8ad4ff", h: "#ff5f8f" },
    body: BUNNY_BODY,
  },
  person: {
    label: "Person",
    legend: { o: "#241a12", b: "#f2c08a", l: "#e0574f", e: "#ffffff", p: "#241a12", n: "#b8705a", w: "#8ad4ff", h: "#ff5f8f" },
    body: PERSON_BODY,
  },
  robot: {
    label: "Robot",
    legend: { o: "#101822", b: "#9fb4c9", l: "#5f7488", e: "#5ff5ff", p: "#0b2b33", n: "#ff5f7a", w: "#8ad4ff", h: "#ff5f8f" },
    body: ROBOT_BODY,
    faceOverrides: ROBOT_FACES,
  },
  bird: {
    label: "Bird",
    legend: { o: "#1c2a3a", b: "#4fc3f7", l: "#ffc857", e: "#ffffff", p: "#1c2a3a", n: "#ffc857", w: "#8ad4ff", h: "#ff5f8f" },
    body: BIRD_BODY,
  },
  ghost: {
    label: "Ghost",
    legend: { o: "#2b2440", b: "#d8d4f0", l: "#a9a2d6", e: "#ffffff", p: "#2b2440", n: "#a9a2d6", w: "#8ad4ff", h: "#ff5f8f" },
    body: GHOST_BODY,
    faceOverrides: GHOST_FACES,
  },
  alien: {
    label: "Alien",
    legend: { o: "#123322", b: "#7ee081", l: "#c8f7c5", e: "#0b1a12", p: "#7ee081", n: "#123322", w: "#8ad4ff", h: "#ff5f8f" },
    body: ALIEN_BODY,
  },
}

export const CHARACTERS: Record<string, CharacterDef> = Object.fromEntries(
  Object.entries(SOURCES).map(([id, src]) => [
    id,
    { label: src.label, legend: src.legend, emotes: buildEmotes(src) },
  ]),
)

export const CHARACTER_MANIFEST = Object.entries(CHARACTERS).map(([id, def]) => ({
  id,
  label: def.label,
  emotes: Object.entries(def.emotes).map(([emoteId, emote]) => ({ id: emoteId, label: emote.label })),
}))

export const CHARACTER_IDS = Object.keys(SOURCES)
export const EMOTE_IDS = Object.keys(EMOTE_SPECS)

export type CharacterId = keyof typeof CHARACTERS

/** Which frame of `emote` is showing at `elapsedMs`. Mirrors characters.h. */
export function characterFrameIndex(fps: number, frameCount: number, elapsedMs: number): number {
  if (frameCount <= 1) return 0
  return Math.floor((elapsedMs / 1000) * fps) % frameCount
}

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  characterId: string,
  emoteId: string,
  x: number,
  y: number,
  scale: number,
  elapsedMs: number,
) {
  const def = CHARACTERS[characterId]
  if (!def) return
  const emote = def.emotes[emoteId] ?? def.emotes.idle
  if (!emote) return
  const frame = emote.frames[characterFrameIndex(emote.fps, emote.frames.length, elapsedMs)]
  if (!frame) return

  for (let row = 0; row < CHARACTER_GRID_SIZE; row++) {
    const line = frame[row]
    if (!line) continue
    for (let col = 0; col < CHARACTER_GRID_SIZE; col++) {
      const colour = def.legend[line[col]]
      if (!colour) continue // "." and unknown codes are transparent
      ctx.fillStyle = colour
      ctx.fillRect(x + col * scale, y + row * scale, scale, scale)
    }
  }
}
