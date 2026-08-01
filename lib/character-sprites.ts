// Animated pixel characters. Mirrors Arduino_code/include/characters.h
// frame-for-frame - the editor must never offer a character/emote pair the
// firmware can't draw identically.
//
// A frame is 16 rows of 16 characters. Each character indexes into that
// character's `legend`; "." is transparent (the panel shows whatever is
// underneath). Storing the art as ASCII rather than packed bits is deliberate:
// the grid stays legible and diffable in both this file and the firmware
// header, which is the only practical way to keep two hand-maintained copies
// of the same sprite honest.

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

// ── Cat ───────────────────────────────────────────────────────────────────
const CAT_LEGEND = {
  o: "#241a12", // outline
  b: "#f0a03c", // fur
  l: "#ffe0b0", // muzzle / belly highlight
  e: "#ffffff", // eye white
  n: "#ff7a9c", // nose
  w: "#8ad4ff", // sleep "z" / tear
}

const CAT_IDLE_OPEN = [
  "...o........o...",
  "..obo......obo..",
  ".obbbo....obbbo.",
  ".obbbboooobbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obbeebbbbeebbo.",
  ".obbeobbbbeobbo.",
  ".obbbbbnnbbbbbo.",
  ".obbbbollobbbbo.",
  "..obbbbbbbbbbo..",
  "...oooooooooo...",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const CAT_IDLE_BLINK = [
  "...o........o...",
  "..obo......obo..",
  ".obbbo....obbbo.",
  ".obbbboooobbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obboobbbboobbo.",
  ".obbbbbnnbbbbbo.",
  ".obbbbollobbbbo.",
  "..obbbbbbbbbbo..",
  "...oooooooooo...",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const CAT_HAPPY_A = [
  "...o........o...",
  "..obo......obo..",
  ".obbbo....obbbo.",
  ".obbbboooobbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obbobbbbbbobbo.",
  ".obobobbbbobobo.",
  ".obbbbbnnbbbbbo.",
  ".obbboloolobbbo.",
  "..obbboooobbbo..",
  "...oooooooooo...",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const CAT_HAPPY_B = [
  "................",
  "...o........o...",
  "..obo......obo..",
  ".obbbo....obbbo.",
  ".obbbboooobbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obbobbbbbbobbo.",
  ".obobobbbbobobo.",
  ".obbbbbnnbbbbbo.",
  ".obbboloolobbbo.",
  "..obbboooobbbo..",
  "...oooooooooo...",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const CAT_SAD_A = [
  "...o........o...",
  "..obo......obo..",
  ".obbbo....obbbo.",
  ".obbbboooobbbbo.",
  ".obbobbbbbbobbo.",
  ".obbbeobbobeobo.",
  ".obbbeebbeebbbo.",
  ".obbbbbnnbbbbbo.",
  ".obbbboooobbbbo.",
  "..obbbobbobbbo..",
  "...oooooooooo...",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const CAT_SAD_B = [
  "...o........o...",
  "..obo......obo..",
  ".obbbo....obbbo.",
  ".obbbboooobbbbo.",
  ".obbobbbbbbobbo.",
  ".obbbeobbobeobo.",
  ".obbbeebbeebbbo.",
  ".obbwbbnnbbbbbo.",
  ".obbwboooobbbbo.",
  "..obbbobbobbbo..",
  "...oooooooooo...",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const CAT_WAVE_UP = [
  "...o........o...",
  "..obo......obo..",
  ".obbbo....obbbo.",
  ".obbbboooobbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obbeebbbbeebbo.",
  ".obbeobbbbeobbo.",
  ".obbbbbnnbbbbbo.",
  ".obbboloolbbbbo.",
  "..obbbbbbbbbbo..",
  "obooooooooooo...",
  "obo..obbbbo.....",
  "obooobbbbbboo...",
  "..obbbbbbbbbbo..",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const CAT_WAVE_DOWN = [
  "...o........o...",
  "..obo......obo..",
  ".obbbo....obbbo.",
  ".obbbboooobbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obbeebbbbeebbo.",
  ".obbeobbbbeobbo.",
  ".obbbbbnnbbbbbo.",
  ".obbboloolbbbbo.",
  "..obbbbbbbbbbo..",
  "...oooooooooo...",
  ".....obbbbo.....",
  "obooobbbbbboo...",
  "obobbbbbbbbbbo..",
  "obobbbbbbbbbbo..",
  "...oo......oo...",
]

const CAT_SLEEP_A = [
  "...o........o...",
  "..obo......obo..",
  ".obbbo....obbbo.",
  ".obbbboooobbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obboobbbboobbo.",
  ".obbbbbnnbbbbbo.",
  ".obbbbollobbbbo.",
  "..obbbbbbbbbbo..",
  "...oooooooooo...",
  ".....obbbbo...ww",
  "...oobbbbbboo.w.",
  "..obbbbbbbbbboww",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const CAT_SLEEP_B = [
  "..............ww",
  "...o........o.w.",
  "..obo......obeww",
  ".obbbo....obbbo.",
  ".obbbboooobbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obbbbbbbbbbbbo.",
  ".obboobbbboobbo.",
  ".obbbbbnnbbbbbo.",
  ".obbbbollobbbbo.",
  "..obbbbbbbbbbo..",
  "...oooooooooo...",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

// ── Dog ───────────────────────────────────────────────────────────────────
const DOG_LEGEND = {
  o: "#2a1c10", // outline
  b: "#c8823c", // coat
  l: "#f6ddb8", // muzzle
  e: "#ffffff",
  n: "#3a2a1e", // nose
  w: "#8ad4ff",
}

const DOG_IDLE_OPEN = [
  "................",
  "...oooooooooo...",
  ".oobbbbbbbbbboo.",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbobbo",
  "obbobbeebbeebbbo",
  "obbobbeobbeobbbo",
  "obbobbbbbbbbobbo",
  ".oobbblllllbbboo",
  "...obbbnnnbbbo..",
  "...obblllllbbo..",
  "....oooooooooo..",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const DOG_IDLE_BLINK = [
  "................",
  "...oooooooooo...",
  ".oobbbbbbbbbboo.",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbbbbo",
  "obbobboobboobbbo",
  "obbobbbbbbbbobbo",
  ".oobbblllllbbboo",
  "...obbbnnnbbbo..",
  "...obblllllbbo..",
  "....oooooooooo..",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const DOG_HAPPY_A = [
  "................",
  "...oooooooooo...",
  ".oobbbbbbbbbboo.",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbobbo",
  "obbobbobbbbobbbo",
  "obbobobobbobobbo",
  "obbobbbbbbbbobbo",
  ".oobbblllllbbboo",
  "...obbbnnnbbbo..",
  "...obbloolbbbo..",
  "....oooooooooo..",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const DOG_HAPPY_B = [
  "...oooooooooo...",
  ".oobbbbbbbbbboo.",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbobbo",
  "obbobbobbbbobbbo",
  "obbobobobbobobbo",
  "obbobbbbbbbbobbo",
  ".oobbblllllbbboo",
  "...obbbnnnbbbo..",
  "...obbloolbbbo..",
  "....oooooooooo..",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const DOG_SAD_A = [
  "................",
  "...oooooooooo...",
  ".oobbbbbbbbbboo.",
  "obbobbbbbbbbobbo",
  "obbobbobbbbobbbo",
  "obbobbbeobeobbbo",
  "obbobbbeebeebbbo",
  "obbobbbbbbbbobbo",
  ".oobbblllllbbboo",
  "...obbbnnnbbbo..",
  "...obbloolbbbo..",
  "....oooooooooo..",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const DOG_SAD_B = [
  "................",
  "...oooooooooo...",
  ".oobbbbbbbbbboo.",
  "obbobbbbbbbbobbo",
  "obbobbobbbbobbbo",
  "obbobbbeobeobbbo",
  "obbwbbbeebeebbbo",
  "obbwbbbbbbbbobbo",
  ".oobbblllllbbboo",
  "...obbbnnnbbbo..",
  "...obbloolbbbo..",
  "....oooooooooo..",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const DOG_WAVE_UP = [
  "................",
  "...oooooooooo...",
  ".oobbbbbbbbbboo.",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbobbo",
  "obbobbeebbeebbbo",
  "obbobbeobbeobbbo",
  "obbobbbbbbbbobbo",
  ".oobbblllllbbboo",
  "...obbbnnnbbbo..",
  "obbobblllllbbo..",
  "obboooooooooooo.",
  "obbo.obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

const DOG_WAVE_DOWN = [
  "................",
  "...oooooooooo...",
  ".oobbbbbbbbbboo.",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbobbo",
  "obbobbeebbeebbbo",
  "obbobbeobbeobbbo",
  "obbobbbbbbbbobbo",
  ".oobbblllllbbboo",
  "...obbbnnnbbbo..",
  "...obblllllbbo..",
  "....oooooooooo..",
  "obbo.obbbbo.....",
  "obboobbbbbboo...",
  "obbbbbbbbbbbbo..",
  "...oo......oo...",
]

const DOG_SLEEP_A = [
  "................",
  "...oooooooooo...",
  ".oobbbbbbbbbboo.",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbbbbo",
  "obbobboobboobbbo",
  "obbobbbbbbbbobbo",
  ".oobbblllllbbboo",
  "...obbbnnnbbbo..",
  "...obblllllbbo..",
  "....oooooooooo..",
  ".....obbbbo...ww",
  "...oobbbbbboo.w.",
  "..obbbbbbbbbboww",
  "...oo......oo...",
]

const DOG_SLEEP_B = [
  "..............ww",
  "...oooooooooo.w.",
  ".oobbbbbbbbbboww",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbobbo",
  "obbobbbbbbbbbbbo",
  "obbobboobboobbbo",
  "obbobbbbbbbbobbo",
  ".oobbblllllbbboo",
  "...obbbnnnbbbo..",
  "...obblllllbbo..",
  "....oooooooooo..",
  ".....obbbbo.....",
  "...oobbbbbboo...",
  "..obbbbbbbbbbo..",
  "...oo......oo...",
]

// ── Person ────────────────────────────────────────────────────────────────
const PERSON_LEGEND = {
  o: "#241a12",
  b: "#f2c08a", // skin
  h: "#3b2415", // hair
  e: "#ffffff",
  l: "#e0574f", // shirt
  n: "#b8705a", // mouth
  w: "#8ad4ff",
}

const PERSON_IDLE_OPEN = [
  "....oooooooo....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..obbbbbbbbbbo..",
  "..obbeebbeebbo..",
  "..obbeobbeobbo..",
  "..obbbbbbbbbbo..",
  "..obbbbnnbbbbo..",
  "..obbbboobbbbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "....ollllllo....",
  "..oollllllllooo.",
  "..ollllllllllo..",
  "...oo......oo...",
]

const PERSON_IDLE_BLINK = [
  "....oooooooo....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..obbbbbbbbbbo..",
  "..obbbbbbbbbbo..",
  "..obboobboobbo..",
  "..obbbbbbbbbbo..",
  "..obbbbnnbbbbo..",
  "..obbbboobbbbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "....ollllllo....",
  "..oollllllllooo.",
  "..ollllllllllo..",
  "...oo......oo...",
]

const PERSON_HAPPY_A = [
  "....oooooooo....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..obbbbbbbbbbo..",
  "..obbobbbbobbo..",
  "..obobobbobobo..",
  "..obbbbbbbbbbo..",
  "..obbonnnnobbo..",
  "..obbboooobbbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "....ollllllo....",
  "..oollllllllooo.",
  "..ollllllllllo..",
  "...oo......oo...",
]

const PERSON_HAPPY_B = [
  "................",
  "....oooooooo....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..obbbbbbbbbbo..",
  "..obbobbbbobbo..",
  "..obobobbobobo..",
  "..obbbbbbbbbbo..",
  "..obbonnnnobbo..",
  "..obbboooobbbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "....ollllllo....",
  "..oollllllllooo.",
  "..ollllllllllo..",
]

const PERSON_SAD_A = [
  "....oooooooo....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..obbobbbbobbo..",
  "..obbbeobeobbo..",
  "..obbbeebeebbo..",
  "..obbbbbbbbbbo..",
  "..obbbboobbbbo..",
  "..obbbonnobbbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "....ollllllo....",
  "..oollllllllooo.",
  "..ollllllllllo..",
  "...oo......oo...",
]

const PERSON_SAD_B = [
  "....oooooooo....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..obbobbbbobbo..",
  "..obbbeobeobbo..",
  "..obwbeebeebbo..",
  "..obwbbbbbbbbo..",
  "..obbbboobbbbo..",
  "..obbbonnobbbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "....ollllllo....",
  "..oollllllllooo.",
  "..ollllllllllo..",
  "...oo......oo...",
]

const PERSON_WAVE_UP = [
  "..bo.oooooooo...",
  "..bo.hhhhhhhho..",
  "..booohhhhhhhho.",
  "...obhhhhhhhhho.",
  "...obbbbbbbbbbo.",
  "...obbeebbeebbo.",
  "...obbeobbeobbo.",
  "...obbbbbbbbbbo.",
  "...obbbonnobbbo.",
  "...obbbboobbbbo.",
  "....obbbbbbbbo..",
  ".....oooooooo...",
  ".....ollllllo...",
  "...oollllllllo..",
  "...ollllllllllo.",
  "....oo......oo..",
]

const PERSON_WAVE_DOWN = [
  "....oooooooo....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..obbbbbbbbbbo..",
  "..obbeebbeebbo..",
  "..obbeobbeobbo..",
  "..obbbbbbbbbbo..",
  "..obbbonnobbbo..",
  "..obbbboobbbbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "obo.ollllllo....",
  "obooollllllllooo",
  "obbollllllllllo.",
  "....oo......oo..",
]

const PERSON_SLEEP_A = [
  "....oooooooo....",
  "...ohhhhhhhho...",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..obbbbbbbbbbo..",
  "..obbbbbbbbbbo..",
  "..obboobboobbo..",
  "..obbbbbbbbbbo..",
  "..obbbbnnbbbbo..",
  "..obbbboobbbbo..",
  "...obbbbbbbbo...",
  "....oooooooo..ww",
  "....ollllllo.w..",
  "..oollllllllooww",
  "..ollllllllllo..",
  "...oo......oo...",
]

const PERSON_SLEEP_B = [
  "..............ww",
  "....oooooooo.w..",
  "...ohhhhhhhhoww.",
  "..ohhhhhhhhhho..",
  "..ohhhhhhhhhho..",
  "..obbbbbbbbbbo..",
  "..obbbbbbbbbbo..",
  "..obboobboobbo..",
  "..obbbbbbbbbbo..",
  "..obbbbnnbbbbo..",
  "..obbbboobbbbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "....ollllllo....",
  "..oollllllllooo.",
  "..ollllllllllo..",
]

// ── Robot ─────────────────────────────────────────────────────────────────
const ROBOT_LEGEND = {
  o: "#101822", // outline
  b: "#9fb4c9", // chassis
  l: "#5f7488", // chassis shadow / dimmed visor
  e: "#5ff5ff", // visor glow
  n: "#ff5f7a", // chest light
  w: "#8ad4ff",
}

const ROBOT_IDLE_OPEN = [
  ".......oo.......",
  ".......oo.......",
  "....oooooooo....",
  "...obbbbbbbbo...",
  "..obbbbbbbbbbo..",
  "..obeeeeeeeebo..",
  "..obeoeeeeoebo..",
  "..obeeeeeeeebo..",
  "..obbbbbbbbbbo..",
  "..obbollllobbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "...obbbnnbbbo...",
  ".oobbbbbbbbbboo.",
  ".obbbbbbbbbbbbo.",
  "...oo......oo...",
]

const ROBOT_IDLE_BLINK = [
  ".......oo.......",
  ".......oo.......",
  "....oooooooo....",
  "...obbbbbbbbo...",
  "..obbbbbbbbbbo..",
  "..obllllllllbo..",
  "..obloollooolbo.",
  "..obllllllllbo..",
  "..obbbbbbbbbbo..",
  "..obbollllobbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "...obbbnnbbbo...",
  ".oobbbbbbbbbboo.",
  ".obbbbbbbbbbbbo.",
  "...oo......oo...",
]

const ROBOT_HAPPY_A = [
  ".......oo.......",
  ".......oo.......",
  "....oooooooo....",
  "...obbbbbbbbo...",
  "..obbbbbbbbbbo..",
  "..obeeeeeeeebo..",
  "..obeoeeeeoebo..",
  "..obeeeeeeeebo..",
  "..obbbbbbbbbbo..",
  "..oboeeeeeeobo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "...obbbnnbbbo...",
  ".oobbbbbbbbbboo.",
  ".obbbbbbbbbbbbo.",
  "...oo......oo...",
]

const ROBOT_HAPPY_B = [
  "................",
  ".......oo.......",
  ".......oo.......",
  "....oooooooo....",
  "...obbbbbbbbo...",
  "..obbbbbbbbbbo..",
  "..obeeeeeeeebo..",
  "..obeoeeeeoebo..",
  "..obeeeeeeeebo..",
  "..obbbbbbbbbbo..",
  "..oboeeeeeeobo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "...obbbnnbbbo...",
  ".oobbbbbbbbbboo.",
  ".obbbbbbbbbbbbo.",
]

const ROBOT_SAD_A = [
  ".......oo.......",
  ".......oo.......",
  "....oooooooo....",
  "...obbbbbbbbo...",
  "..obbbbbbbbbbo..",
  "..obllllllllbo..",
  "..oblleelleelbo.",
  "..obllllllllbo..",
  "..obbbbbbbbbbo..",
  "..obboeeeeobbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "...obbbnnbbbo...",
  ".oobbbbbbbbbboo.",
  ".obbbbbbbbbbbbo.",
  "...oo......oo...",
]

const ROBOT_SAD_B = [
  ".......oo.......",
  ".......oo.......",
  "....oooooooo....",
  "...obbbbbbbbo...",
  "..obbbbbbbbbbo..",
  "..obllllllllbo..",
  "..oblleelleelbo.",
  "..wbllllllllbo..",
  "..wbbbbbbbbbbo..",
  "..obboeeeeobbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "...obbbnnbbbo...",
  ".oobbbbbbbbbboo.",
  ".obbbbbbbbbbbbo.",
  "...oo......oo...",
]

const ROBOT_WAVE_UP = [
  "ob.....oo.......",
  "ob.....oo.......",
  "ob..oooooooo....",
  "obooobbbbbbbo...",
  "obbbbbbbbbbbbo..",
  "..obeeeeeeeebo..",
  "..obeoeeeeoebo..",
  "..obeeeeeeeebo..",
  "..obbbbbbbbbbo..",
  "..obbollllobbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "...obbbnnbbbo...",
  ".oobbbbbbbbbboo.",
  ".obbbbbbbbbbbbo.",
  "...oo......oo...",
]

const ROBOT_WAVE_DOWN = [
  ".......oo.......",
  ".......oo.......",
  "....oooooooo....",
  "...obbbbbbbbo...",
  "..obbbbbbbbbbo..",
  "..obeeeeeeeebo..",
  "..obeoeeeeoebo..",
  "..obeeeeeeeebo..",
  "..obbbbbbbbbbo..",
  "..obbollllobbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "ob.obbbnnbbbo...",
  "oboobbbbbbbbboo.",
  "obbbbbbbbbbbbbo.",
  "...oo......oo...",
]

const ROBOT_SLEEP_A = [
  ".......oo.......",
  ".......oo.......",
  "....oooooooo....",
  "...obbbbbbbbo...",
  "..obbbbbbbbbbo..",
  "..obllllllllbo..",
  "..obloollooolbo.",
  "..obllllllllbo..",
  "..obbbbbbbbbbo..",
  "..obbollllobbo..",
  "...obbbbbbbbo.ww",
  "....oooooooo.w..",
  "...obbbnnbbboww.",
  ".oobbbbbbbbbboo.",
  ".obbbbbbbbbbbbo.",
  "...oo......oo...",
]

const ROBOT_SLEEP_B = [
  "..............ww",
  ".......oo....w..",
  ".......oo...ww..",
  "....oooooooo....",
  "...obbbbbbbbo...",
  "..obbbbbbbbbbo..",
  "..obllllllllbo..",
  "..obloollooolbo.",
  "..obllllllllbo..",
  "..obbbbbbbbbbo..",
  "..obbollllobbo..",
  "...obbbbbbbbo...",
  "....oooooooo....",
  "...obbbnnbbbo...",
  ".oobbbbbbbbbboo.",
  ".obbbbbbbbbbbbo.",
]

function emotes(
  idle: string[][],
  happy: string[][],
  sad: string[][],
  wave: string[][],
  sleep: string[][],
): Record<string, CharacterEmote> {
  return {
    idle: { label: "Idle", fps: 1, frames: idle },
    happy: { label: "Happy", fps: 4, frames: happy },
    sad: { label: "Sad", fps: 1, frames: sad },
    wave: { label: "Waving", fps: 3, frames: wave },
    sleep: { label: "Sleeping", fps: 1, frames: sleep },
  }
}

export const CHARACTERS: Record<string, CharacterDef> = {
  cat: {
    label: "Cat",
    legend: CAT_LEGEND,
    emotes: emotes(
      [CAT_IDLE_OPEN, CAT_IDLE_OPEN, CAT_IDLE_OPEN, CAT_IDLE_BLINK],
      [CAT_HAPPY_A, CAT_HAPPY_B],
      [CAT_SAD_A, CAT_SAD_B],
      [CAT_WAVE_UP, CAT_WAVE_DOWN],
      [CAT_SLEEP_A, CAT_SLEEP_B],
    ),
  },
  dog: {
    label: "Dog",
    legend: DOG_LEGEND,
    emotes: emotes(
      [DOG_IDLE_OPEN, DOG_IDLE_OPEN, DOG_IDLE_OPEN, DOG_IDLE_BLINK],
      [DOG_HAPPY_A, DOG_HAPPY_B],
      [DOG_SAD_A, DOG_SAD_B],
      [DOG_WAVE_UP, DOG_WAVE_DOWN],
      [DOG_SLEEP_A, DOG_SLEEP_B],
    ),
  },
  person: {
    label: "Person",
    legend: PERSON_LEGEND,
    emotes: emotes(
      [PERSON_IDLE_OPEN, PERSON_IDLE_OPEN, PERSON_IDLE_OPEN, PERSON_IDLE_BLINK],
      [PERSON_HAPPY_A, PERSON_HAPPY_B],
      [PERSON_SAD_A, PERSON_SAD_B],
      [PERSON_WAVE_UP, PERSON_WAVE_DOWN],
      [PERSON_SLEEP_A, PERSON_SLEEP_B],
    ),
  },
  robot: {
    label: "Robot",
    legend: ROBOT_LEGEND,
    emotes: emotes(
      [ROBOT_IDLE_OPEN, ROBOT_IDLE_OPEN, ROBOT_IDLE_OPEN, ROBOT_IDLE_BLINK],
      [ROBOT_HAPPY_A, ROBOT_HAPPY_B],
      [ROBOT_SAD_A, ROBOT_SAD_B],
      [ROBOT_WAVE_UP, ROBOT_WAVE_DOWN],
      [ROBOT_SLEEP_A, ROBOT_SLEEP_B],
    ),
  },
}

export const CHARACTER_MANIFEST = Object.entries(CHARACTERS).map(([id, def]) => ({
  id,
  label: def.label,
  emotes: Object.entries(def.emotes).map(([emoteId, emote]) => ({ id: emoteId, label: emote.label })),
}))

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
