// lib/useSiteContent.ts — hook client-side com cache em memória
'use client'
import { useState, useEffect } from 'react'

type CacheEntry = { value: unknown; ts: number } | { error: true; ts: number }
const cache: Record<string, CacheEntry> = {}
const TTL       = 60_000   // 60s para dados válidos
const ERROR_TTL = 300_000  // 5min para não tentar novamente após erro

export function useSiteContent<T>(key: string, fallback: T): T {
  // Inicializa já com o valor do cache se existir — evita flash de fallback
  const [data, setData] = useState<T>(() => {
    const cached = cache[key]
    if (cached && !('error' in cached) && Date.now() - cached.ts < TTL) {
      return cached.value as T
    }
    return fallback
  })

  useEffect(() => {
    const now = Date.now()
    const cached = cache[key]

    // Cache válido: atualiza o state (pode já estar igual — sem problema)
    if (cached && !('error' in cached) && now - cached.ts < TTL) {
      setData(cached.value as T)
      return
    }

    // Falhou recentemente: não tenta de novo
    if (cached && 'error' in cached && now - cached.ts < ERROR_TTL) {
      return
    }

    // Marca como tentando para evitar chamadas duplicadas em paralelo
    cache[key] = { error: true, ts: now }

    fetch(`/api/site-content?key=${key}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(d => {
        if (d?.value !== undefined && d?.value !== null) {
          const val = typeof d.value === 'string' ? JSON.parse(d.value) : d.value
          cache[key] = { value: val, ts: Date.now() }
          setData(val as T)
        }
      })
      .catch(() => {
        cache[key] = { error: true, ts: Date.now() }
      })
  }, [key])

  return data
}
