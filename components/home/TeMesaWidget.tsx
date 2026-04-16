'use client'

/**
 * TeMesaWidget
 * Embeds the TeMesa reservation widget via iframe.
 * Widget URL: https://unique-sfogliatella-a00c01.netlify.app/r/porto-cabral-bc
 *
 * Requirements on the host site's CSP (next.config.mjs):
 *   frame-src: must include https://unique-sfogliatella-a00c01.netlify.app
 */

import { useState } from 'react'

const TEMESA_BASE = 'https://temesa.vercel.app'
const TEMESA_SLUG = 'porto-cabral-bc'
const WIDGET_URL  = `${TEMESA_BASE}/r/${TEMESA_SLUG}`

export function TeMesaWidget() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError]   = useState(false)

  return (
    <div className="w-full max-w-[480px] mx-auto">
      {/* Skeleton enquanto o iframe carrega */}
      {!loaded && !error && (
        <div
          className="w-full rounded-[12px] bg-zinc-900 animate-pulse"
          style={{ height: 700 }}
          aria-hidden="true"
        />
      )}

      {error && (
        <div
          className="w-full rounded-[12px] bg-zinc-900 flex flex-col items-center justify-center gap-3 text-zinc-400"
          style={{ height: 700 }}
        >
          <span className="text-2xl">🍽️</span>
          <p className="text-sm font-medium">Widget temporariamente indisponível</p>
          <a
            href={WIDGET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline hover:text-white transition-colors"
          >
            Abrir reservas em nova aba
          </a>
        </div>
      )}

      <iframe
        src={WIDGET_URL}
        width="100%"
        height={700}
        frameBorder={0}
        scrolling="auto"
        allow="clipboard-write"
        title="Reservas online — Porto Cabral BC"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          border: 'none',
          borderRadius: '12px',
          minHeight: '600px',
          display: loaded && !error ? 'block' : 'none',
        }}
      />
    </div>
  )
}
