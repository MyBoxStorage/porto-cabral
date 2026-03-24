'use client'
import { useEffect, useState } from 'react'

type Locale = 'pt' | 'en' | 'es'

type Reservation = {
  id: string; name: string; email: string
  reservation_date: string; reservation_time: string
  party_size: number; status: string; occasion_type?: string
}

const LABELS: Record<Locale, {
  loading: string; error: string; empty: string; empty_sub: string
  people: string
  status: Record<string, string>
  occasion: Record<string, string>
  make_reservation: string
}> = {
  pt: {
    loading: 'Carregando suas reservas…',
    error: 'Não foi possível carregar suas reservas.',
    empty: 'Nenhuma reserva ainda',
    empty_sub: 'Sua próxima experiência no Porto Cabral está a um clique.',
    people: 'pessoa(s)',
    status: { pending: 'Pendente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Concluída', no_show: 'No-show' },
    occasion: { jantar: 'Jantar', almoco: 'Almoço', romantico: 'Romântico', aniversario: 'Aniversário', negocios: 'Negócios', familia: 'Família', celebration: 'Celebração', romantic: 'Romântico' },
    make_reservation: 'Fazer uma reserva →',
  },
  en: {
    loading: 'Loading your reservations…',
    error: 'Could not load your reservations.',
    empty: 'No reservations yet',
    empty_sub: 'Your next Porto Cabral experience is one click away.',
    people: 'guest(s)',
    status: { pending: 'Pending', confirmed: 'Confirmed', cancelled: 'Cancelled', completed: 'Completed', no_show: 'No-show' },
    occasion: { jantar: 'Dinner', almoco: 'Lunch', romantico: 'Romantic', aniversario: 'Birthday', negocios: 'Business', familia: 'Family', celebration: 'Celebration', romantic: 'Romantic' },
    make_reservation: 'Make a reservation →',
  },
  es: {
    loading: 'Cargando sus reservas…',
    error: 'No se pudieron cargar sus reservas.',
    empty: 'Sin reservas aún',
    empty_sub: 'Su próxima experiencia en Porto Cabral está a un clic.',
    people: 'persona(s)',
    status: { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada', no_show: 'No presentado' },
    occasion: { jantar: 'Cena', almoco: 'Almuerzo', romantico: 'Romántico', aniversario: 'Cumpleaños', negocios: 'Negocios', familia: 'Familia', celebration: 'Celebración', romantic: 'Romántico' },
    make_reservation: 'Hacer una reserva →',
  },
}

const STATUS_COLORS: Record<string, { dot: string; text: string; bg: string }> = {
  pending:   { dot: '#f59e0b', text: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
  confirmed: { dot: '#10b981', text: '#34d399', bg: 'rgba(16,185,129,0.08)' },
  cancelled: { dot: '#ef4444', text: '#f87171', bg: 'rgba(239,68,68,0.08)'  },
  completed: { dot: '#D4A843', text: '#D4A843', bg: 'rgba(212,168,67,0.08)' },
  no_show:   { dot: '#6b7280', text: '#9ca3af', bg: 'rgba(107,114,128,0.08)' },
}

function formatDate(dateStr: string, locale: Locale): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    const localeMap: Record<Locale, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }
    return date.toLocaleDateString(localeMap[locale], { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

type Props = { locale: Locale }

export function MinhasReservas({ locale }: Props) {
  const L = LABELS[locale]
  const [reservas, setReservas] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/cliente/reservas')
      .then(r => r.json())
      .then(data => { setReservas(data.reservations ?? []); setLoading(false) })
      .catch(() => { setErro(L.error); setLoading(false) })
  }, [L.error])

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '2px solid rgba(212,168,67,0.15)',
        borderTopColor: '#D4A843',
        animation: 'spin 0.9s linear infinite',
      }} />
      <p style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(212,168,67,0.45)', textTransform: 'uppercase', margin: 0 }}>
        {L.loading}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (erro) return (
    <p style={{ color: '#f87171', fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.8rem', padding: '2rem 0', textAlign: 'center' }}>{erro}</p>
  )

  if (reservas.length === 0) return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      {/* Ícone decorativo */}
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.25 }}>⚓</div>
      <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '1.1rem', color: '#fff', margin: '0 0 8px' }}>{L.empty}</p>
      <p style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', margin: '0 0 1.5rem' }}>{L.empty_sub}</p>
      <a href="#reserva" style={{
        display: 'inline-block', fontFamily: "'Josefin Sans',sans-serif",
        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#002451', background: 'linear-gradient(90deg,#D4A843,#FECE65,#D4A843)',
        backgroundSize: '200% auto', padding: '11px 24px', borderRadius: 8,
        textDecoration: 'none', animation: 'shimmer 3s linear infinite',
      }}>
        {L.make_reservation}
      </a>
      <style>{`@keyframes shimmer { to { background-position: 200% center; } }`}</style>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
      {reservas.map((r, i) => {
        const cfg = STATUS_COLORS[r.status] ?? STATUS_COLORS.pending
        const statusLabel = L.status[r.status] ?? r.status
        const occasionLabel = r.occasion_type ? (L.occasion[r.occasion_type] ?? r.occasion_type) : null

        return (
          <div
            key={r.id}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '1.25rem',
              animation: `fadeIn 0.3s ease ${i * 0.06}s both`,
              transition: 'border-color 0.2s',
            }}
          >
            {/* Linha superior: data + status */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
                  fontSize: 'clamp(0.95rem, 3.5vw, 1.05rem)',
                  color: '#fff', margin: 0, lineHeight: 1.3,
                }}>
                  {formatDate(r.reservation_date, locale)}
                </p>
                <p style={{
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.06em', margin: '4px 0 0',
                }}>
                  {r.reservation_time} · {r.party_size} {L.people}
                  {occasionLabel ? ` · ${occasionLabel}` : ''}
                </p>
              </div>

              {/* Badge de status */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                background: cfg.bg,
                border: `1px solid ${cfg.dot}30`,
                borderRadius: 99, padding: '5px 12px',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: cfg.dot, display: 'inline-block', flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: '0.6rem', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: cfg.text,
                }}>
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Linha de ouro decorativa */}
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg,rgba(212,168,67,0.2),transparent)',
            }} />
          </div>
        )
      })}
    </div>
  )
}
