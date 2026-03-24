// lib/useSiteContent.ts — cache em memória + localStorage com invalidação por updated_at
'use client'
import { useState, useEffect } from 'react'

type MemEntry  = { value: unknown; ts: number; updated_at?: string }
type ErrorEntry = { error: true; ts: number }
type CacheEntry = MemEntry | ErrorEntry

const memCache: Record<string, CacheEntry> = {}

const MEM_TTL    = 5 * 60_000   // 5 min em memória
const LS_TTL     = 60 * 60_000  // 1h no localStorage
const ERROR_TTL  = 5 * 60_000   // 5 min cooldown após erro
const LS_PREFIX  = 'pc_sc_'
const LS_VERSION = 'v3'         // incrementar aqui invalida todo o cache do browser

/* ── Limpa cache antigo na inicialização ── */
if (typeof window !== 'undefined') {
  const currentVersion = localStorage.getItem('pc_sc_version')
  if (currentVersion !== LS_VERSION) {
    Object.keys(localStorage)
      .filter(k => k.startsWith(LS_PREFIX))
      .forEach(k => localStorage.removeItem(k))
    localStorage.setItem('pc_sc_version', LS_VERSION)
  }
}

/* ── localStorage helpers ── */
function lsGet(key: string): { value: unknown; updated_at?: string } | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { value: unknown; ts: number; updated_at?: string }
    if (Date.now() - parsed.ts > LS_TTL) {
      localStorage.removeItem(LS_PREFIX + key)
      return null
    }
    return { value: parsed.value, updated_at: parsed.updated_at }
  } catch { return null }
}

function lsSet(key: string, value: unknown, updated_at?: string) {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify({ value, ts: Date.now(), updated_at }))
  } catch { /* storage cheio */ }
}

/* ── Hook ── */
export function useSiteContent<T>(key: string, fallback: T): T {
  const [data, setData] = useState<T>(() => {
    // Inicializa com memCache ou localStorage se disponível
    const mem = memCache[key]
    if (mem && !('error' in mem) && Date.now() - mem.ts < MEM_TTL) {
      return mem.value as T
    }
    const ls = lsGet(key)
    if (ls) return ls.value as T
    return fallback
  })

  useEffect(() => {
    const now = Date.now()
    const mem = memCache[key]

    // memCache válido — busca em background para checar updated_at
    const cachedUpdatedAt = mem && !('error' in mem) ? (mem as MemEntry).updated_at : undefined
    const memValid = mem && !('error' in mem) && now - mem.ts < MEM_TTL

    // Cooldown de erro
    if (mem && 'error' in mem && now - mem.ts < ERROR_TTL) return

    // Marca tentativa
    if (!memValid) memCache[key] = { error: true, ts: now }

    fetch(`/api/site-content?key=${key}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => {
        if (d?.value === undefined || d?.value === null) return
        const val = typeof d.value === 'string' ? JSON.parse(d.value) : d.value
        const serverUpdatedAt: string | undefined = d.updated_at

        // Se o servidor tem dados mais novos que o cache → atualiza tudo
        const cacheIsStale = !cachedUpdatedAt || !serverUpdatedAt || serverUpdatedAt !== cachedUpdatedAt
        if (cacheIsStale) {
          memCache[key] = { value: val, ts: Date.now(), updated_at: serverUpdatedAt }
          lsSet(key, val, serverUpdatedAt)
          setData(val as T)
        } else if (!memValid) {
          // Cache localStorage estava válido mas memCache expirou — restaura
          memCache[key] = { value: val, ts: Date.now(), updated_at: serverUpdatedAt }
        }
      })
      .catch(() => { memCache[key] = { error: true, ts: Date.now() } })
  }, [key])

  return data
}
