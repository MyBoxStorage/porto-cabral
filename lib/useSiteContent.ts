// lib/useSiteContent.ts — hook client-side com cache em memória
'use client'
import { useState, useEffect } from 'react'

const cache: Record<string, { value: unknown; ts: number }> = {}
const TTL = 30_000 // 30s em dev, pode subir em prod

export function useSiteContent<T>(key: string, fallback: T): T {
  const [data, setData] = useState<T>(fallback)

  useEffect(() => {
    const now = Date.now()
    if (cache[key] && now - cache[key].ts < TTL) {
      setData(cache[key].value as T)
      return
    }
    fetch(`/api/site-content?key=${key}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.value) {
          cache[key] = { value: d.value, ts: Date.now() }
          setData(d.value as T)
        }
      })
      .catch(() => {/* usa fallback */})
  }, [key])

  return data
}
