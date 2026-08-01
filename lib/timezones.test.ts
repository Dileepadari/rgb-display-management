import { describe, expect, it } from "vitest"
import { DEFAULT_TIMEZONE, TIMEZONES, toPosixTimezone } from "./timezones"

// The firmware applies whatever this returns straight into setenv("TZ"). An
// IANA name reaching the device silently gives the wrong time, so the
// translation boundary is worth pinning down.
describe("toPosixTimezone", () => {
  it("translates IANA names the devices table already holds", () => {
    expect(toPosixTimezone("Asia/Kolkata")).toBe("IST-5:30")
    expect(toPosixTimezone("America/New_York")).toBe("EST5EDT,M3.2.0,M11.1.0")
    expect(toPosixTimezone("UTC")).toBe("UTC0")
  })

  it("passes POSIX strings through untouched", () => {
    expect(toPosixTimezone("IST-5:30")).toBe("IST-5:30")
    expect(toPosixTimezone("GMT0BST,M3.5.0/1,M10.5.0")).toBe("GMT0BST,M3.5.0/1,M10.5.0")
  })

  it("falls back to UTC rather than emitting an unresolvable name", () => {
    expect(toPosixTimezone("Mars/Olympus_Mons")).toBe(DEFAULT_TIMEZONE)
    expect(toPosixTimezone(null)).toBe(DEFAULT_TIMEZONE)
    expect(toPosixTimezone(undefined)).toBe(DEFAULT_TIMEZONE)
    expect(toPosixTimezone("")).toBe(DEFAULT_TIMEZONE)
  })

  it("never offers a picker option the device would reject", () => {
    for (const tz of TIMEZONES) {
      // A slash means an IANA name, which has no tzdata on the ESP32. The one
      // legal exception is a DST rule like "GMT0BST,M3.5.0/1,M10.5.0", where
      // the slash appears after the comma that starts the rule.
      const beforeRule = tz.id.split(",")[0]
      expect(beforeRule, `${tz.id} looks like an IANA name`).not.toContain("/")
    }
  })
})
