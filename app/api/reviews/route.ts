import { and, eq, gt } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { getDb } from '@/lib/db'
import { googleReviewsCache } from '@/lib/db/schema'
import { getClientIp, rateLimitReviews } from '@/lib/ratelimit'

export const dynamic = 'force-dynamic'

type PlaceReview = { rating?: number; text?: string; author_name?: string }

export async function GET(req: Request) {
  const ip = getClientIp(req.headers)

  const rl = await rateLimitReviews(ip)
  if (!rl.success) {
    return NextResponse.json({ error: 'Limite excedido.' }, { status: 429 })
  }

  const placeId = process.env.GOOGLE_PLACE_ID
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!placeId || !apiKey) {
    return NextResponse.json(
      { error: 'Reviews não configuradas (GOOGLE_PLACE_ID / GOOGLE_PLACES_API_KEY).' },
      { status: 503 },
    )
  }

  const now = new Date()

  try {
    const db = getDb()
    const cached = await db
      .select()
      .from(googleReviewsCache)
      .where(
        and(eq(googleReviewsCache.place_id, placeId), gt(googleReviewsCache.expires_at, now)),
      )
      .limit(1)

    if (cached[0]) {
      const list = normalizeReviews(cached[0].reviews)
      return NextResponse.json({
        rating: cached[0].rating,
        total_reviews: cached[0].total_reviews,
        reviews: list,
        cached: true,
      })
    }

    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
    url.searchParams.set('place_id', placeId)
    url.searchParams.set('fields', 'reviews,rating,user_ratings_total')
    url.searchParams.set('key', apiKey)
    url.searchParams.set('language', 'pt-BR')

    const res = await fetch(url.toString(), { next: { revalidate: 0 } })
    const data = (await res.json()) as {
      status: string
      result?: {
        reviews?: PlaceReview[]
        rating?: number
        user_ratings_total?: number
      }
    }

    if (data.status !== 'OK' || !data.result) {
      return NextResponse.json(
        { error: 'Falha ao buscar avaliações no Google.' },
        { status: 502 },
      )
    }

    const reviewsRaw = data.result.reviews ?? []
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    await db
      .insert(googleReviewsCache)
      .values({
        place_id: placeId,
        reviews: reviewsRaw as unknown[],
        rating:
          data.result.rating !== undefined ? String(data.result.rating) : undefined,
        total_reviews: data.result.user_ratings_total,
        expires_at: expiresAt,
      })
      .onConflictDoUpdate({
        target: googleReviewsCache.place_id,
        set: {
          reviews: reviewsRaw as unknown[],
          rating:
            data.result.rating !== undefined ? String(data.result.rating) : null,
          total_reviews: data.result.user_ratings_total ?? null,
          cached_at: now,
          expires_at: expiresAt,
        },
      })

    const list = normalizeReviews(reviewsRaw as unknown)

    return NextResponse.json({
      rating: data.result.rating,
      total_reviews: data.result.user_ratings_total,
      reviews: list,
      cached: false,
    })
  } catch (e) {
    console.error('[reviews]', e)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

function normalizeReviews(raw: unknown) {
  const arr = Array.isArray(raw) ? (raw as PlaceReview[]) : []
  return [...arr]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5)
}
