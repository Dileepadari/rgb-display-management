import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { renderHeader } from "./characters-header"

// The firmware's sprite header is generated from lib/character-sprites.ts. If
// someone edits a sprite and forgets to regenerate, the panel would animate
// differently from the preview — silently, and only visible on real hardware.
// This turns that into a failing test instead.
describe("characters.h", () => {
  it("is up to date with lib/character-sprites.ts", () => {
    const here = dirname(fileURLToPath(import.meta.url))
    const checkedIn = readFileSync(join(here, "..", "Arduino_code", "include", "characters.h"), "utf8")

    expect(
      checkedIn,
      "characters.h is stale — run: npx vite-node scripts/generate-characters-header.ts",
    ).toBe(renderHeader())
  })
})
