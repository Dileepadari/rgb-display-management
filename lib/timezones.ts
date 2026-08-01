// Timezones, stored as POSIX TZ strings rather than IANA names.
//
// The ESP32 has no tzdata database, so it cannot resolve "Asia/Kolkata". What
// newlib's setenv("TZ", ...) understands is the POSIX form - offset plus, where
// applicable, the DST changeover rule ("GMT0BST,M3.5.0/1,M10.5.0"). Storing
// that form means the firmware applies the value verbatim with no lossy
// mapping step, and DST is handled on-device without a network lookup.
//
// The offsets look inverted because POSIX defines them as "time to add to
// local to get UTC" - so India, at UTC+5:30, is written IST-5:30.

export interface TimezoneOption {
  /** POSIX TZ string, applied verbatim by the firmware. */
  id: string
  label: string
}

export const TIMEZONES: TimezoneOption[] = [
  { id: "UTC0", label: "UTC" },
  { id: "IST-5:30", label: "India (IST, UTC+5:30)" },
  { id: "GMT0BST,M3.5.0/1,M10.5.0", label: "UK (GMT/BST)" },
  { id: "CET-1CEST,M3.5.0,M10.5.0/3", label: "Central Europe (CET/CEST)" },
  { id: "EET-2EEST,M3.5.0/3,M10.5.0/4", label: "Eastern Europe (EET/EEST)" },
  { id: "EST5EDT,M3.2.0,M11.1.0", label: "US Eastern (EST/EDT)" },
  { id: "CST6CDT,M3.2.0,M11.1.0", label: "US Central (CST/CDT)" },
  { id: "MST7MDT,M3.2.0,M11.1.0", label: "US Mountain (MST/MDT)" },
  { id: "PST8PDT,M3.2.0,M11.1.0", label: "US Pacific (PST/PDT)" },
  { id: "JST-9", label: "Japan (JST, UTC+9)" },
  { id: "CST-8", label: "China (CST, UTC+8)" },
  { id: "AEST-10AEDT,M10.1.0,M4.1.0/3", label: "Sydney (AEST/AEDT)" },
  { id: "<-03>3", label: "Brazil (UTC-3)" },
  { id: "SAST-2", label: "South Africa (SAST, UTC+2)" },
  { id: "<+04>-4", label: "Gulf (UTC+4)" },
]

export const DEFAULT_TIMEZONE = "UTC0"

export function timezoneLabel(id: string): string {
  return TIMEZONES.find((t) => t.id === id)?.label ?? id
}

// Rows created before the POSIX-string picker existed hold IANA names (the
// devices table defaulted to "UTC", and hand-set values look like
// "Asia/Kolkata"). The device can't resolve those, so translate the common
// ones at the feed boundary instead of pushing the problem to the firmware.
const IANA_TO_POSIX: Record<string, string> = {
  UTC: "UTC0",
  "Etc/UTC": "UTC0",
  "Asia/Kolkata": "IST-5:30",
  "Asia/Calcutta": "IST-5:30",
  "Europe/London": "GMT0BST,M3.5.0/1,M10.5.0",
  "Europe/Paris": "CET-1CEST,M3.5.0,M10.5.0/3",
  "Europe/Berlin": "CET-1CEST,M3.5.0,M10.5.0/3",
  "Europe/Madrid": "CET-1CEST,M3.5.0,M10.5.0/3",
  "Europe/Athens": "EET-2EEST,M3.5.0/3,M10.5.0/4",
  "America/New_York": "EST5EDT,M3.2.0,M11.1.0",
  "America/Chicago": "CST6CDT,M3.2.0,M11.1.0",
  "America/Denver": "MST7MDT,M3.2.0,M11.1.0",
  "America/Los_Angeles": "PST8PDT,M3.2.0,M11.1.0",
  "Asia/Tokyo": "JST-9",
  "Asia/Shanghai": "CST-8",
  "Australia/Sydney": "AEST-10AEDT,M10.1.0,M4.1.0/3",
  "America/Sao_Paulo": "<-03>3",
  "Africa/Johannesburg": "SAST-2",
  "Asia/Dubai": "<+04>-4",
}

/**
 * Normalises whatever is stored on a device into a POSIX TZ string the
 * firmware can apply verbatim. Unknown IANA names fall back to UTC - a clock
 * an hour out is worse than one that is honestly UTC.
 */
export function toPosixTimezone(stored: string | null | undefined): string {
  if (!stored) return DEFAULT_TIMEZONE
  if (IANA_TO_POSIX[stored]) return IANA_TO_POSIX[stored]

  // Distinguish "Europe/London" from "GMT0BST,M3.5.0/1,M10.5.0". Only the
  // offset part - everything before the first comma - tells them apart: a
  // POSIX DST rule legitimately contains slashes, so testing the whole string
  // would reject every zone that observes daylight saving.
  const offsetPart = stored.split(",")[0]
  if (!offsetPart.includes("/")) return stored
  return DEFAULT_TIMEZONE
}
