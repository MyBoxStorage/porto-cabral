// lib/useSiteContent.ts — cache em memória + localStorage persistente
'use client'
import { useState, useEffect } from 'react'

/* ── Cache em memória (limpo por navegação) ── */
type CacheEntry = { value: unknown; ts: number } | { error: true; ts: number }
const memCache: Record<string, CacheEntry> = {}

const TTL       = 5 * 60_000   // 5 min — tempo que o dado em memória é válido
const LS_TTL    = 60 * 60_000  // 1h   — tempo que o dado no localStorage é válido
const ERROR_TTL = 5 * 60_000   // 5 min — cooldown após erro

const LS_PREFIX = 'pc_sc_'     // prefixo das chaves no localStorage

/* ── Helpers localStorage ── */
function lsGet(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key)
    if (!raw) return null
    const { value, ts } = JSON.parse(raw) as { value: unknown; ts: number }
    if (Date.now() - ts > LS_TTL) { localStorage.removeItem(LS_PREFIX + key); return null }
    return value
  } catch { return null }
}

function lsSet(key: string, value: unknown) {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify({ value, ts: Date.now() }))
  } catch { /* localStorage cheio — ignora silenciosamente */ }
}

/* ── Hook ── */
export function useSiteContent<T>(key: string, fallback: T): T {
  // Inicializa com: 1º memCache, 2º localStorage, 3º fallback
  const [data, setData] = useState<T>(() => {
    const mem = memCache[key]
    if (mem && !('error' in mem) && Date.now() - mem.ts < TTL) {
      return mem.value as T
    }
    const ls = lsGet(key)
    if (ls !== null) return ls as T
    return fallback
  })

  useEffect(() => {
    const now = Date.now()
    const mem = memCache[key]

    // Cache em memória ainda válido — não precisa buscar
    if (mem && !('error' in mem) && now - mem.ts < TTL) {
      setData(mem.value as T)
      return
    }

    // Erro recente — aguarda cooldown
    if (mem && 'error' in mem && now - mem.ts < ERROR_TTL) return

    // Marca como tentando (evita chamadas paralelas)
    memCache[key] = { error: true, ts: now }

    fetch(`/api/site-content?key=${key}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => {
        if (d?.value !== undefined && d?.value !== null) {
          const val = typeof d.value === 'string' ? JSON.parse(d.value) : d.value
          // Salva em memória e no localStorage
          memCache[key] = { value: val, ts: Date.now() }
          lsSet(key, val)
          setData(val as T)
        }
      })
      .catch(() => { memCache[key] = { error: true, ts: Date.now() } })
  }, [key])

  return data
}
