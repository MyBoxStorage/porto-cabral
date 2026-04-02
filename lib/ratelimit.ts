import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ---------------------------------------------------------------------------
// Helper: extrai IP real de forma resistente a spoofing no ambiente Vercel.
// Na Vercel, x-real-ip é injetado pela infra e não pode ser forjado pelo cliente.
// x-forwarded-for é usado como fallback, mas pegamos o ÚLTIMO valor da lista
// (o mais próximo do proxy confiável), não o primeiro (que é controlável pelo cliente).
// ---------------------------------------------------------------------------
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ??
    'anonymous'
  )
}

// ---------------------------------------------------------------------------
// Redis singleton
// ---------------------------------------------------------------------------
let redis: Redis | null | undefined

function getRedis(): Redis | null {
  if (redis !== undefined) return redis
  const url   = process.env.UPSTASH_REDIS_REST_URL
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

// ---------------------------------------------------------------------------
// Limiters
// ---------------------------------------------------------------------------
let reservationLimiter: Ratelimit | null | undefined
let reviewsLimiter:     Ratelimit | null | undefined
let signupLimiter:      Ratelimit | null | undefined

function getReservationLimiter() {
  if (reservationLimiter !== undefined) return reservationLimiter
  const r = getRedis()
  if (!r) { reservationLimiter = null; return null }
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
  if (!r) { reviewsLimiter = null; return null }
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
  if (!r) { signupLimiter = null; return null }
  signupLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'portocabral:signup',
  })
  return signupLimiter
}

// ---------------------------------------------------------------------------
// FAIL CLOSED: se o Redis não estiver disponível, bloqueamos a requisição.
// Isso evita que uma falha do Upstash desabilite silenciosamente o rate limit.
// ---------------------------------------------------------------------------
const REDIS_DOWN_RESPONSE = {
  success:   false as const,
  limit:     0,
  remaining: 0,
  reset:     Date.now(),
}

export async function rateLimitReservation(identifier: string) {
  const limiter = getReservationLimiter()
  if (!limiter) {
    console.error('[ratelimit] Redis indisponível — bloqueando /api/reserva por segurança')
    return REDIS_DOWN_RESPONSE
  }
  return limiter.limit(identifier)
}

export async function rateLimitReviews(identifier: string) {
  const limiter = getReviewsLimiter()
  if (!limiter) {
    console.error('[ratelimit] Redis indisponível — bloqueando /api/reviews por segurança')
    return REDIS_DOWN_RESPONSE
  }
  return limiter.limit(identifier)
}

export async function rateLimitSignup(identifier: string) {
  const limiter = getSignupLimiter()
  if (!limiter) {
    console.error('[ratelimit] Redis indisponível — bloqueando /api/auth/signup por segurança')
    return REDIS_DOWN_RESPONSE
  }
  return limiter.limit(identifier)
}
