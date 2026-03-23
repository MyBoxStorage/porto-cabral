'use client'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Logo } from '@/components/brand/Logo'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Glints deterministicos — sem Math.random para evitar hydration mismatch
const GLINTS = [
  { x: 12, y: 20, s: 2, d: 0.0  },
  { x: 88, y: 15, s: 3, d: 0.4  },
  { x: 5,  y: 60, s: 2, d: 0.7  },
  { x: 95, y: 55, s: 2, d: 0.2  },
  { x: 22, y: 80, s: 3, d: 0.5  },
  { x: 78, y: 78, s: 2, d: 0.9  },
  { x: 38, y: 12, s: 2, d: 0.3  },
  { x: 62, y: 18, s: 3, d: 0.6  },
  { x: 8,  y: 40, s: 2, d: 0.15 },
  { x: 92, y: 35, s: 2, d: 0.8  },
  { x: 50, y: 8,  s: 3, d: 0.45 },
  { x: 30, y: 90, s: 2, d: 0.1  },
]

// URLs para pré-carregar durante o preloader
const PRELOAD_IMAGES: string[] = []
// Vídeos removidos do preload — são pesados demais para mobile
// e o browser mobile trava tentando baixar os 3 ao mesmo tempo
const PRELOAD_VIDEOS: string[] = []

export function Preloader() {
  const [ready, setReady] = useState(false)
  const [show, setShow]   = useState(false)
  const [phase, setPhase] = useState(0)

  // Decide se exibe — antes do primeiro paint
  useIsomorphicLayoutEffect(() => {
    try {
      if (sessionStorage.getItem('pc_preloader_shown')) {
        // Segunda visita: remove bloqueio imediatamente e não exibe
        document.documentElement.classList.remove('pc-loading')
        setReady(true); setShow(false); return
      }
      sessionStorage.setItem('pc_preloader_shown', '1')
      setShow(true)
    } catch {
      document.documentElement.classList.remove('pc-loading')
      setReady(true); setShow(false); return
    }
    setReady(true)
  }, [])

  // Assim que o preloader está montado e visível, remove o bloqueio CSS —
  // o overlay fixed z-9999 já cobre o site, não precisa mais do visibility:hidden
  useEffect(() => {
    if (show) {
      document.documentElement.classList.remove('pc-loading')
    }
  }, [show])

  // Pré-carrega mídia enquanto o preloader exibe
  useEffect(() => {
    if (!show) return
    PRELOAD_IMAGES.forEach(src => { const img = new Image(); img.src = src })
    PRELOAD_VIDEOS.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'; link.as = 'video'; link.href = url
      document.head.appendChild(link)
    })
  }, [show])

  // Sequência de fases
  // 0 → invisível
  // 1 → horizonte cresce        (180ms)
  // 2 → glints acendem          (650ms)
  // 3 → logo emerge             (1050ms)
  // 4 → subtítulo aparece       (1800ms)
  // 5 → saída fade+rise         (3200ms)
  // 6 → removido do DOM         (4000ms)
  useEffect(() => {
    if (!show) return
    const ts = [
      setTimeout(() => setPhase(1),  180),
      setTimeout(() => setPhase(2),  650),
      setTimeout(() => setPhase(3), 1050),
      setTimeout(() => setPhase(4), 1800),
      setTimeout(() => setPhase(5), 3200),
      setTimeout(() => setPhase(6), 4000),
    ]
    return () => ts.forEach(clearTimeout)
  }, [show])

  if (!ready || !show || phase === 6) return null

  const exiting = phase === 5

  return (
    <>
      <style>{`
        @keyframes pc-glint {
          0%,100% { opacity:0; transform:scale(0.3); }
          50%      { opacity:1; transform:scale(1); }
        }
        @keyframes pc-rise {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pc-horizon {
          from { transform:translateX(-50%) scaleX(0); }
          to   { transform:translateX(-50%) scaleX(1); }
        }
      `}</style>

      {/* ── Palco principal ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'radial-gradient(ellipse at 50% 120%, #0e3d72 0%, #001432 60%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        opacity:   exiting ? 0 : 1,
        transform: exiting ? 'scale(1.04)' : 'scale(1)',
        transition: exiting
          ? 'opacity 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1)'
          : 'none',
        pointerEvents: exiting ? 'none' : 'auto',
      }}>

        {/* Glints — dispersos nas bordas, longe do centro */}
        {phase >= 2 && GLINTS.map((g, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${g.x}%`, top: `${g.y}%`,
            width: `${g.s}px`, height: `${g.s}px`,
            borderRadius: '50%',
            background: '#D4A843',
            animation: `pc-glint ${1.8 + g.d}s ease-in-out ${g.d * 0.4}s infinite`,
            boxShadow: `0 0 ${g.s * 4}px ${g.s + 1}px rgba(212,168,67,0.4)`,
          }} />
        ))}

        {/* Linha do horizonte — cresce antes da logo */}
        <div style={{
          position: 'absolute',
          top: '50%', marginTop: '160px',
          left: '50%',
          width: '320px', height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(212,168,67,0.6) 25%,rgba(212,168,67,0.6) 75%,transparent)',
          transformOrigin: 'center',
          animation: phase >= 1 ? 'pc-horizon 0.9s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
          opacity: phase >= 1 ? 1 : 0,
        }} />

        {/* ── Centro: logo + subtítulo em fluxo normal (sem position absolute) ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          opacity:   phase >= 3 ? 1 : 0,
          animation: phase >= 3 ? 'pc-rise 0.9s cubic-bezier(0.2,0,0,1) forwards' : 'none',
        }}>
          {/* Logo — tagline cortada é efeito intencional */}
          <Logo variant="full" size={300} color="#ffffff" />

          {/* Subtítulo — posicionado ABAIXO da logo no fluxo, não absoluto */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            opacity:   phase >= 4 ? 1 : 0,
            animation: phase >= 4 ? 'pc-rise 0.5s ease forwards' : 'none',
            marginTop: '-8px',
          }}>
            <div style={{ width: 36, height: 1, background: 'rgba(212,168,67,0.45)' }} />
            <span style={{
              fontFamily: '"Josefin Sans", sans-serif',
              fontSize: '0.52rem',
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: 'rgba(212,168,67,0.7)',
              whiteSpace: 'nowrap',
            }}>
              Balneário Camboriú
            </span>
            <div style={{ width: 36, height: 1, background: 'rgba(212,168,67,0.45)' }} />
          </div>
        </div>

      </div>
    </>
  )
}

export default Preloader
