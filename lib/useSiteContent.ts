// lib/useSiteContent.ts — hook client-side com cache em memória
'use client'
import { useState, useEffect } from 'react'

type CacheEntry = { value: unknown; ts: number } | { error: true; ts: number }
const cache: Record<string, CacheEntry> = {}
const TTL       = 60_000  // 60s para dados válidos
const ERROR_TTL = 300_000 // 5min para não tentar novamente após erro

export function useSiteContent<T>(key: string, fallback: T): T {
  const [data, setData] = useState<T>(fallback)

  useEffect(() => {
    const now = Date.now()
    const cached = cache[key]

    // Se tem cache válido (sucesso), usa ele
    if (cached && !('error' in cached) && now - cached.ts < TTL) {
      setData(cached.value as T)
      return
    }

    // Se falhou recentemente, não tenta de novo (evita loop)
    if (cached && 'error' in cached && now - cached.ts < ERROR_TTL) {
      return
    }

    // Marca que está tentando para evitar chamadas duplicadas
    cache[key] = { error: true, ts: now }

    fetch(`/api/site-content?key=${key}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(d => {
        if (d?.value !== undefined && d?.value !== null) {
          // Garante parse caso a API retorne value como string
          const val = typeof d.value === 'string' ? JSON.parse(d.value) : d.value
          cache[key] = { value: val, ts: Date.now() }
          setData(val as T)
        }
      })
      .catch(() => {
        // Mantém o cache de erro com timestamp atual para não tentar de novo tão cedo
        cache[key] = { error: true, ts: Date.now() }
        // Usa o fallback silenciosamente
      })
  }, [key])

  return data
}
