const rateMap = new Map()

export function checkRateLimit(req, limit = 20, windowMs = 60000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             req.headers.get("x-real-ip") ||
             "anonymous"

  const now = Date.now()
  if (!rateMap.has(ip)) {
    rateMap.set(ip, [])
  }

  const timestamps = rateMap.get(ip).filter(t => now - t < windowMs)

  if (timestamps.length >= limit) {
    const oldest = timestamps[0]
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000)
    return { allowed: false, retryAfter }
  }

  timestamps.push(now)
  rateMap.set(ip, timestamps)
  return { allowed: true }
}
