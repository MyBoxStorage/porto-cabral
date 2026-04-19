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
    const mem = memCache[key]
    if (mem && !('error' in mem) && Date.now() - mem.ts < MEM_TTL) {
      return mem.value as T
    }
    const ls = lsGet(key)
    if (ls) return ls.value as T
    return fallback
  })

  useEffect(() => {
    function doFetch() {
      const now = Date.now()
      const mem = memCache[key]
      const memValid = mem && !('error' in mem) && now - mem.ts < MEM_TTL

      // Melhor updated_at disponível: memCache > localStorage > undefined
      const cachedUpdatedAt = mem && !('error' in mem)
        ? (mem as MemEntry).updated_at
        : lsGet(key)?.updated_at

      if (mem && 'error' in mem && now - mem.ts < ERROR_TTL) return
      if (!memValid) memCache[key] = { error: true, ts: now }

      fetch(`/api/site-content?key=${key}`)
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
        .then(d => {
          if (d?.value === undefined || d?.value === null) return
          const val = typeof d.value === 'string' ? JSON.parse(d.value) : d.value
          const serverUpdatedAt: string | undefined = d.updated_at

          // Só atualiza se o servidor tem dado mais novo que qualquer cache local.
          // Evita que resposta CDN stale sobrescreva um cache local mais recente.
          const shouldUpdate = !serverUpdatedAt || !cachedUpdatedAt
            || new Date(serverUpdatedAt) >= new Date(cachedUpdatedAt)

          if (shouldUpdate) {
            memCache[key] = { value: val, ts: Date.now(), updated_at: serverUpdatedAt }
            lsSet(key, val, serverUpdatedAt)
            setData(val as T)
          } else if (!memValid) {
            // Servidor tem dado antigo mas memCache expirou — restaura sem trocar UI
            const ls = lsGet(key)
            memCache[key] = { value: ls?.value ?? val, ts: Date.now(), updated_at: cachedUpdatedAt }
          }
        })
        .catch(() => { memCache[key] = { error: true, ts: Date.now() } })
    }

    doFetch()

    // Re-verifica ao voltar para a aba (mobile: usuário salva no painel e volta ao cardápio)
    function onVisible() {
      if (document.visibilityState !== 'visible') return
      const mem = memCache[key]
      const age = mem && !('error' in mem) ? Date.now() - (mem as MemEntry).ts : Infinity
      if (age > 30_000) { delete memCache[key]; doFetch() }
    }

    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [key])

  return data
}
