import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Porto Cabral BC — Restaurante Flutuante Premium'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #001432 0%, #002451 50%, #0a1a35 100%)',
          position: 'relative',
        }}
      >
        {/* Linha dourada superior */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent, #D4A843, transparent)',
          }}
        />

        {/* Linha dourada inferior */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent, #D4A843, transparent)',
          }}
        />

        {/* Conteúdo central */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            padding: '0 80px',
            textAlign: 'center',
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontSize: 18,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: 'rgba(212, 168, 67, 0.8)',
              margin: 0,
              fontFamily: 'sans-serif',
            }}
          >
            BALNEÁRIO CAMBORIÚ
          </p>

          {/* Título principal */}
          <h1
            style={{
              fontSize: 80,
              fontWeight: 400,
              color: '#D4A843',
              margin: 0,
              lineHeight: 1,
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
            }}
          >
            Porto Cabral BC
          </h1>

          {/* Separador dourado */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              width: 400,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.7))',
              }}
            />
            <span style={{ color: 'rgba(212,168,67,0.8)', fontSize: 20 }}>✦</span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: 'linear-gradient(90deg, rgba(212,168,67,0.7), transparent)',
              }}
            />
          </div>

          {/* Subtítulo */}
          <p
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.75)',
              margin: 0,
              fontFamily: 'sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            Restaurante Flutuante Premium
          </p>
        </div>
      </div>
    ),
    { ...size },
  )
}
