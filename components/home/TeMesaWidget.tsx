'use client'

/**
 * TeMesaWidget
 * Embeds the TeMesa reservation widget via iframe.
 * The widget lives at: https://unique-sfogliatella-a00c01.netlify.app/r/porto-cabral-bc
 *
 * To update the slug, change TEMESA_SLUG below.
 * The TeMesa admin panel is at: https://unique-sfogliatella-a00c01.netlify.app/dashboard/reservas
 */

const TEMESA_BASE = 'https://unique-sfogliatella-a00c01.netlify.app'
const TEMESA_SLUG = 'porto-cabral-bc'

export function TeMesaWidget() {
  return (
    <div className="w-full max-w-[480px] mx-auto">
      <iframe
        src={`${TEMESA_BASE}/r/${TEMESA_SLUG}`}
        width="100%"
        height={700}
        frameBorder={0}
        scrolling="auto"
        allow="clipboard-write"
        title="Reservas online — Porto Cabral BC"
        style={{
          border: 'none',
          borderRadius: '12px',
          minHeight: '600px',
          display: 'block',
        }}
      />
    </div>
  )
}
