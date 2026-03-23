'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useSiteContent } from '@/lib/useSiteContent'

/* ── tipos ── */
type VideoItem = { url: string; label_pt?: string }
type VideosData = {
  eyebrow_pt: string; eyebrow_en: string; eyebrow_es: string
  title_pt: string;   title_en: string;   title_es: string
  items: VideoItem[]
}

const FALLBACK: VideosData = {
  eyebrow_pt: 'Porto Cabral BC', eyebrow_en: 'Porto Cabral BC', eyebrow_es: 'Porto Cabral BC',
  title_pt: 'Viva a Experiência', title_en: 'Live the Experience', title_es: 'Vive la Experiencia',
  items: [],
}

const CARD_W  = 320
const CARD_H  = 480
const GAP     = 20
const STEP    = CARD_W + GAP
const SPEED   = 0.45
const DRAG_SENS = 1.2

/* ── VideoCard ── */
function VideoCard({ item, w, h, onOpen }: { item: VideoItem; w: number; h: number; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => { videoRef.current?.play().catch(() => {}) }, [])

  return (
    <div
      style={{
        width: w, height: h, flexShrink: 0,
        borderRadius: 16, overflow: 'hidden', position: 'relative', cursor: 'pointer',
        border: '1px solid rgba(212,168,67,0.15)',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.6),0 0 0 1px rgba(212,168,67,0.35)' : '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.3s ease,transform 0.3s ease',
        transform: hovered ? 'scale(1.025) translateY(-4px)' : 'scale(1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      <video ref={videoRef} src={item.url} autoPlay muted loop playsInline
        onCanPlay={() => setReady(true)}
        style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block',
          transition:'filter 0.3s ease', filter: hovered ? 'brightness(0.45)' : 'brightness(0.72)' }}
      />
      {!ready && (
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(135deg,#0d2040,#1a3a6b)',
          display:'flex',alignItems:'center',justifyContent:'center' }}>
          <div style={{ width:36,height:36,borderRadius:'50%',
            border:'2px solid rgba(212,168,67,0.2)',borderTopColor:'rgba(212,168,67,0.7)',
            animation:'spin 0.8s linear infinite' }}/>
        </div>
      )}
      <div style={{ position:'absolute',inset:0,pointerEvents:'none',
        background:'linear-gradient(180deg,transparent 40%,rgba(0,10,28,0.85) 100%)' }}/>
      <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',
        opacity: hovered ? 1 : 0, transition:'opacity 0.25s ease', pointerEvents:'none' }}>
        <div style={{ width:60,height:60,borderRadius:'50%',
          background:'rgba(212,168,67,0.15)',border:'1.5px solid rgba(212,168,67,0.6)',
          backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 0 30px rgba(212,168,67,0.25)' }}>
          <div style={{ width:0,height:0,borderTop:'10px solid transparent',
            borderBottom:'10px solid transparent',borderLeft:'18px solid rgba(212,168,67,0.9)',marginLeft:4 }}/>
        </div>
      </div>
      {item.label_pt && (
        <div style={{ position:'absolute',bottom:16,left:16,right:16,pointerEvents:'none',
          opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          transition:'all 0.25s ease' }}>
          <p style={{ fontFamily:"'Josefin Sans',sans-serif",fontSize:'0.6rem',fontWeight:700,
            letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(212,168,67,0.9)',margin:0 }}>
            {item.label_pt}
          </p>
        </div>
      )}
    </div>
  )
}

/* ── NavButton ── */
function NavButton({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width:44,height:44,borderRadius:'50%',cursor:'pointer',
        border:`1px solid rgba(212,168,67,${hov?'0.6':'0.25'})`,
        background: hov ? 'rgba(212,168,67,0.12)' : 'rgba(255,255,255,0.04)',
        color: hov ? 'rgba(212,168,67,1)' : 'rgba(212,168,67,0.5)',
        display:'flex',alignItems:'center',justifyContent:'center',
        transition:'all 0.2s ease', fontSize:16,
        boxShadow: hov ? '0 0 20px rgba(212,168,67,0.15)' : 'none',
      }}>
      {dir === 'left' ? '←' : '→'}
    </button>
  )
}

/* ── VideoModal ── */
function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div onClick={onClose} style={{
      position:'fixed',inset:0,zIndex:9999,background:'rgba(0,5,20,0.92)',
      backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',
      padding:'1.5rem',animation:'fadeIn 0.2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position:'relative',width:'100%',maxWidth:480,borderRadius:20,overflow:'hidden',
        border:'1px solid rgba(212,168,67,0.25)',aspectRatio:'9/16',background:'#000',
        boxShadow:'0 40px 120px rgba(0,0,0,0.8)',
      }}>
        <video src={url} autoPlay controls playsInline
          style={{ width:'100%',height:'100%',objectFit:'contain',display:'block' }}/>
      </div>
      <button onClick={onClose} style={{
        position:'fixed',top:24,right:24,width:44,height:44,borderRadius:'50%',
        border:'1px solid rgba(212,168,67,0.35)',background:'rgba(0,36,81,0.8)',
        color:'rgba(212,168,67,0.8)',fontSize:20,cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',
        backdropFilter:'blur(8px)',zIndex:10000,
      }}>✕</button>
      <p style={{
        position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',
        fontFamily:"'Josefin Sans',sans-serif",fontSize:'0.55rem',letterSpacing:'.3em',
        textTransform:'uppercase',color:'rgba(255,255,255,0.25)',margin:0,pointerEvents:'none',
      }}>ESC para fechar</p>
    </div>
  )
}

/* ── VideoStrip (componente principal exportado) ── */
interface Props { locale?: 'pt' | 'en' | 'es' }

export function VideoStrip({ locale = 'pt' }: Props) {
  const raw = useSiteContent<VideosData>('videos', FALLBACK)
  const data: VideosData = {
    ...FALLBACK, ...raw,
    items: raw?.items?.length ? raw.items : FALLBACK.items,
  }
  const L = locale

  const [modalUrl, setModalUrl]     = useState<string | null>(null)
  const [paused, setPaused]         = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const trackRef   = useRef<HTMLDivElement>(null)
  const offsetRef  = useRef(0)
  const rafRef     = useRef<number>(0)
  const dragStartX = useRef(0)
  const dragStartO = useRef(0)
  const lastTS     = useRef(0)

  const items = data.items.length > 0 ? [...data.items, ...data.items, ...data.items] : []
  const totalW = items.length * STEP

  const animate = useCallback((ts: number) => {
    if (!trackRef.current) return
    if (!paused && !isDragging) {
      const delta = ts - lastTS.current
      lastTS.current = ts
      offsetRef.current += SPEED * Math.min(delta, 32)
      const loopAt = data.items.length * STEP
      if (loopAt > 0 && offsetRef.current >= loopAt * 2) offsetRef.current -= loopAt
    } else {
      lastTS.current = ts
    }
    trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`
    rafRef.current = requestAnimationFrame(animate)
  }, [paused, isDragging, data.items.length])

  useEffect(() => {
    if (data.items.length === 0) return
    lastTS.current = performance.now()
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate, data.items.length])

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
    dragStartO.current = offsetRef.current
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    offsetRef.current = dragStartO.current - (e.clientX - dragStartX.current) * DRAG_SENS
  }
  const onPointerUp = () => setIsDragging(false)
  const nudge = (dir: 1 | -1) => { offsetRef.current += dir * STEP }

  if (data.items.length === 0) return null

  return (
    <>
      <section style={{
        background:'linear-gradient(180deg,#002451 0%,#0d2040 60%,#071628 100%)',
        padding:'5rem 0 6rem', overflow:'hidden', position:'relative',
      }}>
        {/* pontilhado */}
        <div style={{ position:'absolute',inset:0,pointerEvents:'none',opacity:.03,
          backgroundImage:'radial-gradient(rgba(212,168,67,1) 1px,transparent 1px)',
          backgroundSize:'28px 28px' }}/>
        {/* linha dourada topo */}
        <div style={{ position:'absolute',top:0,left:0,right:0,height:'1px',
          background:'linear-gradient(90deg,transparent,rgba(212,168,67,0.35),transparent)' }}/>

        {/* cabeçalho */}
        <div style={{ textAlign:'center',padding:'0 1.5rem',marginBottom:'3.5rem',position:'relative' }}>
          <p style={{ fontFamily:"'Josefin Sans',sans-serif",fontSize:'0.6rem',fontWeight:700,
            letterSpacing:'.45em',textTransform:'uppercase',color:'rgba(212,168,67,0.55)',margin:'0 0 .9rem' }}>
            {(data as unknown as Record<string,string>)[`eyebrow_${L}`] ?? data.eyebrow_pt}
          </p>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontStyle:'italic',
            fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:400,color:'#D4A843',margin:'0 0 1.2rem',lineHeight:1.1 }}>
            {(data as unknown as Record<string,string>)[`title_${L}`] ?? data.title_pt}
          </h2>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:12,maxWidth:260,margin:'0 auto' }}>
            <div style={{ flex:1,height:1,background:'linear-gradient(90deg,transparent,rgba(212,168,67,0.45))' }}/>
            <span style={{ color:'rgba(212,168,67,0.6)',fontSize:'0.8rem' }}>✦</span>
            <div style={{ flex:1,height:1,background:'linear-gradient(90deg,rgba(212,168,67,0.45),transparent)' }}/>
          </div>
        </div>

        {/* fades laterais */}
        <div style={{ position:'absolute',left:0,top:0,bottom:0,width:120,zIndex:10,pointerEvents:'none',
          background:'linear-gradient(90deg,#002451 0%,transparent 100%)' }}/>
        <div style={{ position:'absolute',right:0,top:0,bottom:0,width:120,zIndex:10,pointerEvents:'none',
          background:'linear-gradient(270deg,#071628 0%,transparent 100%)' }}/>

        {/* trilho */}
        <div style={{ overflow:'hidden',cursor:isDragging?'grabbing':'grab',userSelect:'none',
          WebkitUserSelect:'none', padding:'0.5rem 0' }}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div ref={trackRef} style={{ display:'flex',gap:GAP,width:totalW,willChange:'transform',
            paddingLeft: 40, boxSizing:'content-box' }}>
            {items.map((item, idx) => (
              <VideoCard key={idx} item={item} w={CARD_W} h={CARD_H} onOpen={() => setModalUrl(item.url)} />
            ))}
          </div>
        </div>

        {/* controles */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',
          gap:16,marginTop:'2.5rem',position:'relative',zIndex:5 }}>
          <NavButton dir="left"  onClick={() => nudge(-1)} />
          <span style={{ fontFamily:"'Josefin Sans',sans-serif",fontSize:'0.55rem',
            letterSpacing:'.25em',textTransform:'uppercase',color:'rgba(212,168,67,0.35)' }}>
            {data.items.length} {data.items.length === 1 ? 'vídeo' : 'vídeos'}
          </span>
          <NavButton dir="right" onClick={() => nudge(1)} />
        </div>
      </section>

      {modalUrl && <VideoModal url={modalUrl} onClose={() => setModalUrl(null)} />}
    </>
  )
}
