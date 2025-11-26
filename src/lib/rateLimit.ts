// src/lib/rateLimit.ts

type RateLimitResult = {
  success: boolean
  retryAfter?: number
}

// In-memory store (works for single-instance Next.js)
const store = new Map<string, { count: number; expires: number }>()

export function rateLimit(
  key: string,
  {
    windowMs,
    max,
  }: {
    windowMs: number
    max: number
  },
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry) {
    // First request → create limiter entry
    store.set(key, { count: 1, expires: now + windowMs })
    return { success: true }
  }

  if (now > entry.expires) {
    // Window expired → reset
    store.set(key, { count: 1, expires: now + windowMs })
    return { success: true }
  }

  if (entry.count >= max) {
    // Too many attempts
    return {
      success: false,
      retryAfter: Math.ceil((entry.expires - now) / 1000), // seconds
    }
  }

  // Increment usage
  entry.count++
  store.set(key, entry)

  return { success: true }
}
