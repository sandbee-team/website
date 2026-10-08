/*
 * Per-key sliding-window rate limit (ADR-0007 §8: honeypot + server-side rate limit
 * first; no puzzle CAPTCHAs). On Vercel this is a per-instance guard only, not a
 * distributed limit. The receiving contact API must enforce its own shared limit.
 * Exported as a pure factory so tests own their clock and instance.
 */

export interface RateLimiter {
  /** True if the key is allowed another hit at `now`; records the hit when allowed. */
  allow(key: string, now?: number): boolean
}

export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number
  windowMs: number
}): RateLimiter {
  const hits = new Map<string, number[]>()
  return {
    allow(key, now = Date.now()) {
      const windowStart = now - windowMs
      const recent = (hits.get(key) ?? []).filter((t) => t > windowStart)
      if (recent.length >= limit) {
        hits.set(key, recent)
        return false
      }
      recent.push(now)
      hits.set(key, recent)
      // Opportunistic cleanup so the map cannot grow unbounded.
      if (hits.size > 10_000) {
        for (const [k, times] of hits) {
          if (times.every((t) => t <= windowStart)) hits.delete(k)
        }
      }
      return true
    },
  }
}

/** Shared limiter for the contact action: 5 submissions per 10 minutes per IP. */
export const contactRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000,
})
