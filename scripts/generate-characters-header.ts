// Writes Arduino_code/include/characters.h from lib/character-sprites.ts.
//
// The sprites have to exist in two places - the browser preview draws them
// from TypeScript, the panel draws them from C - and a preview that disagrees
// with the panel defeats the point of previewing. So the TypeScript file is
// the single source and the header is generated. Run after any sprite edit:
//
//   npx vite-node scripts/generate-characters-header.ts
//
// scripts/characters-header.test.ts fails if the checked-in header is stale.
import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { renderHeader } from "./characters-header"

const here = dirname(fileURLToPath(import.meta.url))
const target = join(here, "..", "Arduino_code", "include", "characters.h")
writeFileSync(target, renderHeader())
console.log(`wrote ${target}`)
