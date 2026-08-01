// ThingSpeak is used purely as a lightweight "something changed" flag per
// device — never as a payload carrier (its fields are far too small for a
// scene). field1 holds the device's current_revision; the firmware polls it
// and, on change, fetches the real content from /api/device-feed/[token].
export async function pushRevision(writeKey: string | null | undefined, revision: number): Promise<boolean> {
  if (!writeKey) return false
  try {
    const url = `https://api.thingspeak.com/update?api_key=${encodeURIComponent(writeKey)}&field1=${revision}`
    const res = await fetch(url)
    const body = await res.text()
    // ThingSpeak returns "0" (as plain text) when the update is rejected (e.g. rate-limited).
    return res.ok && body.trim() !== "0"
  } catch {
    return false
  }
}
