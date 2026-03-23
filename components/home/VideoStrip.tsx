'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useSiteContent } from '@/lib/useSiteContent'

/* ─── tipos ─────────────────────────────────────────────────── */
export type VideoItem = {
  url: string
  label?: string
  thumb?: string   // URL de thumb opcional (Cloudinary aceita .jpg no lugar de .mp4)
}
export type VideosData = {
  eyebrow_pt: string; eyebrow_en: string; eyebrow_es: string
  title_pt:   string; title_en:   string; title_es:   string
  items: VideoItem[]
}

export const VIDEOS_FB: VideosData = {
  eyebrow_pt:'Porto Cabral BC', eyebrow_en:'Porto Cabral BC', eyebrow_es:'Porto Cabral BC',
  title_pt:'Viva a Experiência', title_en:'Live the Experience', title_es:'Vive la Experiencia',
  items: [],
}

/* ─── constantes ────────────────────────────────────────────── */
const CARD_W   = 300   // px
const CARD_H   = 500   // px — proporção retrato (estilo Reels)
const GAP      = 16    // px
const STEP     = CARD_W + GAP
const SPEED    = 0.38  // px/frame — lento e contemplativo

/* ─── sub-componente: card individual ──────────────────────── */
function VideoCard({
  item, w, h, onClick,
}: { item: VideoItem; w: number; h: number; onClick: () => void }) {
  const vidRef  = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [hover, setHover] = useState(false)

  /* thumb automática do Cloudinary: troca extensão e adiciona transformação */
  const thumbUrl = item.thumb
    ?? item.url.replace(/\.(mp4|mov|webm)(\?.*)?$/i, '.jpg')
                .replace('/video/upload/', '/video/upload/w_600,q_auto,f_auto,so_2/')

  useEffect(() => {
    const v = vidRef.current
    if (!v) return
    v.muted = true
    v.playsInline = true
    v.loop = true
    const onCanPlay = () => setReady(true)
    v.addEventListener('canplay', onCanPlay)
    if (hover) v.play().catch(() => {})
    else { v.pause(); v.currentTime = 0 }
    return () => v.removeEventListener('canplay', onCanPlay)
  }, [hover])

  return (
    <div
      className="pc-video-card"
      style={{
        width: w, height: h, flexShrink: 0,
        borderRadius: 16, overflow: 'hidden', position: 'relative',
        cursor: 'pointer',
        background: '#071628',
        border: '1px solid rgba(212,168,67,0.12)',
        transition: 'border-color .3s, transform .3s, box-shadow .3s',
        boxShadow: hover
          ? '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,67,0.3)'
          : '0 8px 30px rgba(0,0,0,0.4)',
        transform: hover ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        willChange: 'transform',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {/* thumb sempre visível como fundo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbUrl} alt={item.label ?? ''}
        style={{
          position:'absolute', inset:0, width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center',
          transition: 'opacity .4s',
          opacity: (hover && ready) ? 0 : 1,
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      {/* vídeo carregado no hover */}
      <video
        ref={vidRef}
        muted playsInline loop preload="none"
        style={{
          position:'absolute', inset:0, width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center',
          transition: 'opacity .4s',
          opacity: (hover && ready) ? 1 : 0,
        }}
      >
        <source src={item.url} type="video/mp4" />
      </video>
      {/* gradiente bottom */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background: 'linear-gradient(to top, rgba(0,8,20,0.85) 0%, rgba(0,8,20,0.2) 45%, transparent 100%)',
      }}/>
      {/* ícone play */}
      <div style={{
        position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
        opacity: hover ? 0 : 0.7, transition: 'opacity .3s', pointerEvents:'none',
      }}>
        <div style={{
          width:52, height:52, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
          background:'rgba(0,0,0,0.5)', border:'1.5px solid rgba(212,168,67,0.5)',
          backdropFilter:'blur(6px)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(212,168,67,0.9)">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </div>
      </div>
      {/* label */}
      {item.label && (
        <div style={{
          position:'absolute', bottom:16, left:16, right:16,
          fontFamily:"'Josefin Sans',sans-serif", fontSize:10, fontWeight:700,
          letterSpacing:'.15em', textTransform:'uppercase', color:'rgba(212,168,67,0.8)',
          opacity: hover ? 1 : 0.6, transition:'opacity .3s',
        }}>
          {item.label}
        </div>
      )}
    </div>
  )
}

/* ─── sub-componente: modal de vídeo ───────────────────────── */
function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div
      style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'rgba(0,4,16,0.92)', backdropFilter:'blur(12px)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position:'relative', width:'100%', maxWidth:560,
          borderRadius:20, overflow:'hidden',
          boxShadow:'0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,168,67,0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <video
          autoPlay controls playsInline
          style={{ width:'100%', display:'block', maxHeight:'85vh', background:'#000' }}
        >
          <source src={url} type="video/mp4"/>
        </video>
        {/* barra dourada topo */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:2,
          background:'linear-gradient(90deg,transparent,#D4A843,transparent)',
        }}/>
      </div>
      {/* botão fechar */}
      <button
        onClick={onClose}
        style={{
          position:'fixed', top:24, right:24,
          width:44, height:44, borderRadius:'50%', border:'1px solid rgba(212,168,67,0.35)',
          background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)',
          color:'rgba(212,168,67,0.9)', fontSize:20, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all .2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,168,67,0.15)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.6)' }}
      >
        ✕
      </button>
    </div>
  )
}

/* ─── componente principal exportado ───────────────────────── */
export function VideoStrip({ locale = 'pt' }: { locale?: string }) {
  const raw  = useSiteContent<VideosData>('videos', VIDEOS_FB)
  const data = { ...VIDEOS_FB, ...raw, items: raw?.items?.length ? raw.items : VIDEOS_FB.items }
  const L    = locale as 'pt' | 'en' | 'es'

  const [modalUrl, setModalUrl] = useState<string | null>(null)
  const [isDragging, setDragging] = useState(false)
  const [paused,    setPaused]   = useState(false)   // pausado pelo hover

  const trackRef   = useRef<HTMLDivElement>(null)
  const offsetRef  = useRef(0)
  const rafRef     = useRef(0)
  const lastTsRef  = useRef(0)
  const dragStartX = useRef(0)
  const dragStartO = useRef(0)

  /* duplica 3x para loop infinito */
  const items    = [...data.items, ...data.items, ...data.items]
  const loopW    = data.items.length * STEP  // tamanho de 1 bloco

  /* loop RAF */
  const tick = useCallback((ts: number) => {
    const dt = Math.min(ts - lastTsRef.current, 40)
    lastTsRef.current = ts
    if (!paused && !isDragging) {
      offsetRef.current += SPEED * dt
      if (offsetRef.current >= loopW * 2) offsetRef.current -= loopW
    }
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [paused, isDragging, loopW])

  useEffect(() => {
    if (!data.items.length) return
    lastTsRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [tick, data.items.length])

  /* drag pointer */
  const onDown = (e: React.PointerEvent) => {
    setDragging(true)
    dragStartX.current = e.clientX
    dragStartO.current = offsetRef.current
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    offsetRef.current = dragStartO.current - (e.clientX - dragStartX.current) * 1.3
  }
  const onUp = () => setDragging(false)

  /* botões de navegação */
  const nudge = (dir: -1 | 1) => { offsetRef.current += dir * STEP * 1.5 }

  if (!data.items.length) return null

  const eyebrow = data[`eyebrow_${L}`] ?? data.eyebrow_pt
  const title   = data[`title_${L}`]   ?? data.title_pt

  return (
    <>
      <section style={{
        background:'linear-gradient(180deg,#002451 0%,#071628 55%,#0d1f3c 100%)',
        padding:'5.5rem 0 6rem', overflow:'hidden', position:'relative',
      }}>
        {/* pontos decorativos */}
        <div style={{
          position:'absolute',inset:0,pointerEvents:'none',opacity:.025,
          backgroundImage:'radial-gradient(rgba(212,168,67,1) 1px,transparent 1px)',
          backgroundSize:'30px 30px',
        }}/>
        {/* linha topo */}
        <div style={{
          position:'absolute',top:0,left:0,right:0,height:1,
          background:'linear-gradient(90deg,transparent,rgba(212,168,67,0.4),transparent)',
        }}/>
        {/* linha base */}
        <div style={{
          position:'absolute',bottom:0,left:0,right:0,height:1,
          background:'linear-gradient(90deg,transparent,rgba(212,168,67,0.15),transparent)',
        }}/>

        {/* cabeçalho */}
        <div style={{textAlign:'center',padding:'0 1.5rem',marginBottom:'3.5rem',position:'relative',zIndex:2}}>
          <p style={{
            fontFamily:"'Josefin Sans',sans-serif",fontSize:'0.58rem',fontWeight:700,
            letterSpacing:'.5em',textTransform:'uppercase',color:'rgba(212,168,67,0.5)',margin:'0 0 .9rem',
          }}>{eyebrow}</p>
          <h2 style={{
            fontFamily:"'Playfair Display',serif",fontStyle:'italic',
            fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:400,
            color:'#FECE65',margin:'0 0 1.4rem',lineHeight:1.1,
          }}>{title}</h2>
          <div style={{
            display:'flex',alignItems:'center',justifyContent:'center',gap:14,
            maxWidth:280,margin:'0 auto',
          }}>
            <div style={{flex:1,height:1,background:'linear-gradient(90deg,transparent,rgba(212,168,67,0.4))'}}/>
            <span style={{color:'rgba(212,168,67,0.55)',fontSize:'0.75rem',lineHeight:1}}>✦</span>
            <div style={{flex:1,height:1,background:'linear-gradient(90deg,rgba(212,168,67,0.4),transparent)'}}/>
          </div>
        </div>

        {/* fades laterais */}
        {[
          {left:0,  background:'linear-gradient(90deg,#002451 0%,transparent 100%)'},
          {right:0, background:'linear-gradient(270deg,#071628 0%,transparent 100%)'},
        ].map((s,i)=>(
          <div key={i} style={{
            position:'absolute',top:0,bottom:0,width:'min(140px,12vw)',
            zIndex:10,pointerEvents:'none',...s,
          }}/>
        ))}

        {/* trilho */}
        <div
          style={{overflow:'hidden',cursor:isDragging?'grabbing':'grab',
            userSelect:'none',WebkitUserSelect:'none',padding:'6px 0 10px',
          }}
          onPointerDown={onDown} onPointerMove={onMove}
          onPointerUp={onUp}     onPointerLeave={onUp}
          onMouseEnter={()=>setPaused(true)}
          onMouseLeave={()=>setPaused(false)}
        >
          <div
            ref={trackRef}
            style={{
              display:'flex',gap:GAP,
              width: items.length * STEP,
              willChange:'transform',
            }}
          >
            {items.map((item,i) => (
              <VideoCard
                key={i} item={item} w={CARD_W} h={CARD_H}
                onClick={()=>{ if(!isDragging) setModalUrl(item.url) }}
              />
            ))}
          </div>
        </div>

        {/* controles */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'center',
          gap:20,marginTop:'2.8rem',position:'relative',zIndex:5,
        }}>
          {/* prev */}
          <button onClick={()=>nudge(-1)} aria-label="Anterior" style={{
            width:44,height:44,borderRadius:'50%',cursor:'pointer',
            border:'1px solid rgba(212,168,67,0.3)',background:'rgba(212,168,67,0.07)',
            color:'rgba(212,168,67,0.8)',display:'flex',alignItems:'center',justifyContent:'center',
            transition:'all .2s',backdropFilter:'blur(6px)',
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(212,168,67,0.18)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(212,168,67,0.07)'}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>
          </button>

          {/* contador */}
          <span style={{
            fontFamily:"'Josefin Sans',sans-serif",fontSize:'0.58rem',
            letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(212,168,67,0.35)',
          }}>
            {data.items.length} vídeos
          </span>

          {/* next */}
          <button onClick={()=>nudge(1)} aria-label="Próximo" style={{
            width:44,height:44,borderRadius:'50%',cursor:'pointer',
            border:'1px solid rgba(212,168,67,0.3)',background:'rgba(212,168,67,0.07)',
            color:'rgba(212,168,67,0.8)',display:'flex',alignItems:'center',justifyContent:'center',
            transition:'all .2s',backdropFilter:'blur(6px)',
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(212,168,67,0.18)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(212,168,67,0.07)'}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>
          </button>
        </div>
      </section>

      {modalUrl && <VideoModal url={modalUrl} onClose={()=>setModalUrl(null)}/>}
    </>
  )
}

/* ── VideoCard ── */
function VideoCard({ item, w, h, onOpen }: { item: VideoItem; w: number; h: number; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [])

  return (
    <div
      style={{
        width: w, height: h, flexShrink: 0,
        borderRadius: 16, overflow: 'hidden',
        position: 'relative', cursor: 'pointer',
        border: '1px solid rgba(212,168,67,0.15)',
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,67,0.35)'
          : '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        transform: hovered ? 'scale(1.025) translateY(-4px)' : 'scale(1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      {/* vídeo mudo em loop */}
      <video
        ref={videoRef}
        src={item.url}
        autoPlay muted loop playsInline
        onCanPlay={() => setReady(true)}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          display: 'block',
          transition: 'filter 0.3s ease',
          filter: hovered ? 'brightness(0.45)' : 'brightness(0.72)',
        }}
      />

      {/* skeleton enquanto carrega */}
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg,#0d2040,#1a3a6b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '2px solid rgba(212,168,67,0.2)',
            borderTopColor: 'rgba(212,168,67,0.7)',
            animation: 'spin 0.8s linear infinite',
          }}/>
        </div>
      )}

      {/* overlay gradiente */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg,transparent 40%,rgba(0,10,28,0.85) 100%)',
        pointerEvents: 'none',
      }}/>

      {/* ícone play no hover */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.25s ease',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'rgba(212,168,67,0.15)',
          border: '1.5px solid rgba(212,168,67,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px rgba(212,168,67,0.25)',
        }}>
          {/* triângulo play */}
          <div style={{
            width: 0, height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderLeft: '18px solid rgba(212,168,67,0.9)',
            marginLeft: 4,
          }}/>
        </div>
      </div>

      {/* label do vídeo */}
      {item.label_pt && (
        <div style={{
          position: 'absolute', bottom: 16, left: 16, right: 16,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          transition: 'all 0.25s ease',
          pointerEvents: 'none',
        }}>
          <p style={{
            fontFamily: "'Josefin Sans',sans-serif",
            fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '.2em', textTransform: 'uppercase',
            color: 'rgba(212,168,67,0.9)', margin: 0,
          }}>
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
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 44, height: 44, borderRadius: '50%', cursor: 'pointer',
        border: `1px solid rgba(212,168,67,${hov ? '0.6' : '0.25'})`,
        background: hov ? 'rgba(212,168,67,0.12)' : 'rgba(255,255,255,0.04)',
        color: hov ? 'rgba(212,168,67,1)' : 'rgba(212,168,67,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s ease',
        boxShadow: hov ? '0 0 20px rgba(212,168,67,0.15)' : 'none',
        fontSize: 16,
      }}
    >
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
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,5,20,0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* container do vídeo */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(212,168,67,0.25)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,168,67,0.1)',
          aspectRatio: '9/16',
          background: '#000',
        }}
      >
        <video
          src={url}
          autoPlay
          controls
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>

      {/* botão fechar */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: 24, right: 24,
          width: 44, height: 44, borderRadius: '50%',
          border: '1px solid rgba(212,168,67,0.35)',
          background: 'rgba(0,36,81,0.8)',
          color: 'rgba(212,168,67,0.8)',
          fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s',
          zIndex: 10000,
        }}
      >
        ✕
      </button>

      {/* hint ESC */}
      <p style={{
        position: 'fixed', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Josefin Sans',sans-serif",
        fontSize: '0.55rem', letterSpacing: '.3em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)', margin: 0,
        pointerEvents: 'none',
      }}>
        ESC para fechar
      </p>
    </div>
  )
}
