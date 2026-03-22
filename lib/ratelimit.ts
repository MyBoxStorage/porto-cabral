import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let redis: Redis | null | undefined

function getRedis(): Redis | null {
  if (redis !== undefined) return redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    redis = null
    return null
  }
  try {
    redis = new Redis({ url, token })
    return redis
  } catch {
    redis = null
    return null
  }
}

let reservationLimiter: Ratelimit | null | undefined
let reviewsLimiter: Ratelimit | null | undefined
let signupLimiter: Ratelimit | null | undefined

function getReservationLimiter() {
  if (reservationLimiter !== undefined) return reservationLimiter
  const r = getRedis()
  if (!r) {
    reservationLimiter = null
    return null
  }
  reservationLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'portocabral:reserva',
  })
  return reservationLimiter
}

function getReviewsLimiter() {
  if (reviewsLimiter !== undefined) return reviewsLimiter
  const r = getRedis()
  if (!r) {
    reviewsLimiter = null
    return null
  }
  reviewsLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(60, '1 h'),
    prefix: 'portocabral:reviews',
  })
  return reviewsLimiter
}

function getSignupLimiter() {
  if (signupLimiter !== undefined) return signupLimiter
  const r = getRedis()
  if (!r) {
    signupLimiter = null
    return null
  }
  signupLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'portocabral:signup',
  })
  return signupLimiter
}

export async function rateLimitReservation(identifier: string) {
  const limiter = getReservationLimiter()
  if (!limiter) return { success: true as const }
  return limiter.limit(identifier)
}

export async function rateLimitReviews(identifier: string) {
  const limiter = getReviewsLimiter()
  if (!limiter) return { success: true as const }
  return limiter.limit(identifier)
}

export async function rateLimitSignup(identifier: string) {
  const limiter = getSignupLimiter()
  if (!limiter) return { success: true as const }
  return limiter.limit(identifier)
}
