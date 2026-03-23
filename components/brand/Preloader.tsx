'use client'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Logo } from '@/components/brand/Logo'

// useIsomorphicLayoutEffect — evita warning no SSR
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function Preloader() {
  const [ready, setReady] = useState(false)   // true após hidratação
  const [show, setShow]   = useState(false)   // true = renderiza o preloader
  const [phase, setPhase] = useState(0)

  // Roda ANTES do paint — define se vai mostrar
  useIsomorphicLayoutEffect(() => {
    try {
      const already = sessionStorage.getItem('pc_preloader_shown')
      if (already) {
        setReady(true)
        setShow(false)
        return
      }
      sessionStorage.setItem('pc_preloader_shown', '1')
      setShow(true)
    } catch {
      setReady(true)
      setShow(false)
      return
    }
    setReady(true)
  }, [])

  // Sequência de fases
  useEffect(() => {
    if (!show) return

    const t1 = setTimeout(() => setPhase(1), 150)
    const t2 = setTimeout(() => setPhase(2), 800)
    const t3 = setTimeout(() => setPhase(3), 2100)
    const t4 = setTimeout(() => setPhase(4), 3100)   // sinking
    const t5 = setTimeout(() => setPhase(5), 3950)   // gone

    return () => {
      clearTimeout(t1); clearTimeout(t2)
      clearTimeout(t3); clearTimeout(t4); clearTimeout(t5)
    }
  }, [show])

  if (!ready || !show || phase === 5) return null

  const sinking = phase === 4

  return (
    <>
      <style>{`
        @keyframes pc-ripple {
          0%   { transform:translate(-50%,-50%) scale(0.4); opacity:0.45; }
          100% { transform:translate(-50%,-50%) scale(2.8); opacity:0; }
        }
      `}</style>

      <div style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'#1a5fa8',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        overflow:'hidden',
        transform: sinking ? 'scale(0.88) translateY(5%)' : 'scale(1)',
        opacity:   sinking ? 0 : 1,
        transition: sinking
          ? 'transform 0.85s cubic-bezier(0.4,0,0.2,1),opacity 0.85s ease'
          : 'none',
        pointerEvents: sinking ? 'none' : 'auto',
      }}>

        {/* Grade blueprint */}
        <svg style={{
          position:'absolute',inset:0,width:'100%',height:'100%',
          opacity: phase >= 1 ? 0.1 : 0,
          transition:'opacity 0.9s ease',
          pointerEvents:'none',
        }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          {Array.from({length:17},(_,i)=>(
            <line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="600" stroke="#fff" strokeWidth="0.5"/>
          ))}
          {Array.from({length:13},(_,i)=>(
            <line key={`h${i}`} x1="0" y1={i*50} x2="800" y2={i*50} stroke="#fff" strokeWidth="0.5"/>
          ))}
          <circle cx="400" cy="300" r="160" stroke="#fff" strokeWidth="0.5" fill="none" strokeDasharray="4 4"/>
          <circle cx="400" cy="300" r="80"  stroke="#fff" strokeWidth="0.5" fill="none" strokeDasharray="2 6"/>
          <line x1="400" y1="140" x2="400" y2="460" stroke="#fff" strokeWidth="0.4"/>
          <line x1="240" y1="300" x2="560" y2="300" stroke="#fff" strokeWidth="0.4"/>
          {([[40,40],[760,40],[40,560],[760,560]] as [number,number][]).map(([x,y],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r="3" stroke="#D4A843" strokeWidth="0.8" fill="none" opacity="0.5"/>
              <line x1={x-8} y1={y} x2={x+8} y2={y} stroke="#D4A843" strokeWidth="0.5" opacity="0.4"/>
              <line x1={x} y1={y-8} x2={x} y2={y+8} stroke="#D4A843" strokeWidth="0.5" opacity="0.4"/>
            </g>
          ))}
        </svg>

        {/* Ripple no sink */}
        {sinking && [0,0.15,0.3].map((delay,i)=>(
          <div key={i} style={{
            position:'absolute',left:'50%',top:'50%',
            width:`${(i+1)*160}px`,height:`${(i+1)*160}px`,
            borderRadius:'50%',
            border:'1px solid rgba(255,255,255,0.2)',
            animation:`pc-ripple 0.85s ease-out ${delay}s forwards`,
          }}/>
        ))}

        {/* Logo completa — veleiro + PORTO + CABRAL + tagline */}
        <div style={{
          position:'relative',zIndex:1,
          opacity:   phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(18px)',
          transition:'opacity 0.7s ease,transform 0.7s ease',
        }}>
          <Logo variant="full" size={380} color="#ffffff"/>
        </div>

      </div>
    </>
  )
}

export default Preloader
