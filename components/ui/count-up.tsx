"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Counts from the previous value to the current one instead of snapping.
 * Small thing, but a number that animates reads as live data rather than a
 * static tile. Respects prefers-reduced-motion by jumping straight to the end.
 */
export function CountUp({ value, durationMs = 700 }: { value: number; durationMs?: number }) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)

  useEffect(() => {
    const from = fromRef.current
    if (from === value) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      fromRef.current = value
      setDisplay(value)
      return
    }

    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      // Ease-out cubic, so it decelerates into the final number.
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = value
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, durationMs])

  return <>{display}</>
}
