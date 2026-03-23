'use client'
import { useEffect, useState } from 'react'

export type LogoVariant = 'full' | 'compact' | 'symbol' | 'horizontal' | 'wordmark'

interface LogoProps {
  variant?: LogoVariant
  size?: number
  color?: string
  className?: string
}

// Cada variante recorta uma região do canvas 1024x850
// Analisando os paths: logo ocupa ~x:265-755, y:110-740
const VIEWBOXES: Record<LogoVariant, string> = {
  full:       '220 108 580 590',  // veleiro + PORTO + CABRAL (sem tagline)
  compact:    '265 108 490 560',  // idem
  symbol:     '340 108 340 360',  // só veleiro
  horizontal: '265 108 490 590',  // igual full
  wordmark:   '265 480 490 220',  // só PORTO + CABRAL
}

const ASPECT: Record<LogoVariant, number> = {
  full:       580 / 590,
  compact:    490 / 560,
  symbol:     340 / 360,
  horizontal: 490 / 590,
  wordmark:   490 / 220,
}

export function Logo({
  variant = 'full',
  size = 200,
  color = 'white',
  className = '',
}: LogoProps) {
  const [pathData, setPathData] = useState<string>('')

  useEffect(() => {
    fetch('/brand/logo-master.svg')
      .then(r => r.text())
      .then(text => {
        // Pega o path mais longo (o da logo, não IDs ou atributos curtos)
        const matches = [...text.matchAll(/\bd="([^"]{100,})"/g)]
        if (matches.length > 0) {
          // Pega o maior path encontrado
          const longest = matches.reduce((a, b) => a[1].length > b[1].length ? a : b)
          setPathData(longest[1])
        }
      })
  }, [])

  const fill = color === 'navy' || color === '#1a5fa8'
    ? '#1a5fa8'
    : color === 'gold' || color === '#D4A843'
    ? '#D4A843'
    : '#ffffff'

  const vb   = VIEWBOXES[variant]
  const h    = size
  const w    = Math.round(h * ASPECT[variant])

  if (!pathData) {
    return <span style={{ display: 'inline-block', width: w, height: h }} className={className} />
  }

  return (
    <svg
      viewBox={vb}
      width={w}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Porto Cabral BC"
      className={className}
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      <path fill={fill} d={pathData} />
    </svg>
  )
}

export default Logo
