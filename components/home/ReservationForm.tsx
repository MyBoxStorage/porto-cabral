'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

type FormData = {
  name: string; email: string; whatsapp: string
  reservation_date: string; reservation_time: string
  party_size: number; occasion_type: string
  observations: string; optin_accepted: boolean
}

const initialForm: FormData = {
  name: '', email: '', whatsapp: '', reservation_date: '',
  reservation_time: '20:00', party_size: 2,
  occasion_type: 'jantar', observations: '', optin_accepted: false,
}

export function ReservationForm() {
  const locale = useLocale() as 'pt' | 'en' | 'es'
  const t = useTranslations('reservation')
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [reservationId, setReservationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)

  function set(key: keyof FormData, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.optin_accepted) {
      setError(t('lgpd_required'))
      triggerShake(); return
    }
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/reserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message ?? data.error ?? t('error'))
      setReservationId(data.reservationId)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('error'))
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  if (success) {
    return (
      <div className="text-center py-10 px-6">
        <div className="text-5xl md:text-6xl mb-5 md:mb-6">⚓</div>
        <h3 className="font-display text-2xl md:text-3xl text-pc-navy mb-3 md:mb-4">{t('success')}</h3>
        <p className="text-slate-600 mb-2 text-sm md:text-base">{t('success_body')}</p>
        {reservationId && (
          <p className="text-xs text-slate-400 font-mono mt-2">ID: {reservationId}</p>
        )}
      </div>
    )
  }

  const partyOptions = locale === 'pt'
    ? [{ v: 2, l: '2 Pessoas' }, { v: 4, l: '3–4 Pessoas' }, { v: 6, l: '5–8 Pessoas' }, { v: 10, l: 'Evento Privado (+8)' }]
    : locale === 'es'
    ? [{ v: 2, l: '2 Personas' }, { v: 4, l: '3–4 Personas' }, { v: 6, l: '5–8 Personas' }, { v: 10, l: 'Evento Privado (+8)' }]
    : [{ v: 2, l: '2 Guests' }, { v: 4, l: '3–4 Guests' }, { v: 6, l: '5–8 Guests' }, { v: 10, l: 'Private Event (+8)' }]

  const namePlaceholder = locale === 'pt' ? 'Como devemos chamá-lo?' : locale === 'es' ? '¿Cómo debemos llamarle?' : 'How should we call you?'
  const obsPlaceholder  = locale === 'pt' ? 'Alergias, ocasião especial, preferências de mesa...' : locale === 'es' ? 'Alergias, ocasión especial, preferencias de mesa...' : 'Allergies, special occasion, table preferences...'

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 bg-white p-5 sm:p-8 md:p-12 rounded-2xl shadow-xl transition-all
        ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
    >
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`}</style>

      {/* Nome */}
      <div className="space-y-1.5">
        <label className="text-xs font-accent uppercase tracking-widest text-slate-500">{t('name')} *</label>
        <input
          required
          value={form.name}
          onChange={e => set('name', e.target.value)}
          className="w-full min-h-[48px] bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-pc-gold rounded-lg px-4 py-3 outline-none text-sm"
          placeholder={namePlaceholder}
        />
      </div>

      {/* WhatsApp */}
      <div className="space-y-1.5">
        <label className="text-xs font-accent uppercase tracking-widest text-slate-500">{t('whatsapp')} *</label>
        <input
          required
          value={form.whatsapp}
          onChange={e => set('whatsapp', e.target.value)}
          className="w-full min-h-[48px] bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-pc-gold rounded-lg px-4 py-3 outline-none text-sm"
          placeholder="(00) 00000-0000"
          type="tel"
          inputMode="tel"
        />
      </div>

      {/* Email — largura total no mobile para facilitar digitação */}
      <div className="sm:col-span-2 space-y-1.5">
        <label className="text-xs font-accent uppercase tracking-widest text-slate-500">{t('email')} *</label>
        <input
          required
          type="email"
          inputMode="email"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          className="w-full min-h-[48px] bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-pc-gold rounded-lg px-4 py-3 outline-none text-sm"
          placeholder="seu@email.com"
        />
      </div>

      {/* Nº de pessoas */}
      <div className="space-y-1.5">
        <label className="text-xs font-accent uppercase tracking-widest text-slate-500">{t('party_size')} *</label>
        <select
          value={form.party_size}
          onChange={e => set('party_size', Number(e.target.value))}
          className="w-full min-h-[48px] bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-pc-gold rounded-lg px-4 py-3 outline-none text-sm"
        >
          {partyOptions.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>

      {/* Data */}
      <div className="space-y-1.5">
        <label className="text-xs font-accent uppercase tracking-widest text-slate-500">{t('date')} *</label>
        <input
          required
          type="date"
          value={form.reservation_date}
          onChange={e => set('reservation_date', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full min-h-[48px] bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-pc-gold rounded-lg px-4 py-3 outline-none text-sm"
        />
      </div>

      {/* Horário */}
      <div className="space-y-1.5">
        <label className="text-xs font-accent uppercase tracking-widest text-slate-500">{t('time')} *</label>
        <select
          value={form.reservation_time}
          onChange={e => set('reservation_time', e.target.value)}
          className="w-full min-h-[48px] bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-pc-gold rounded-lg px-4 py-3 outline-none text-sm"
        >
          {['12:00','13:00','14:00','18:00','19:00','20:00','21:00','22:00'].map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      {/* Observações — largura total sempre */}
      <div className="sm:col-span-2 space-y-1.5">
        <label className="text-xs font-accent uppercase tracking-widest text-slate-500">{t('observations')}</label>
        <textarea
          value={form.observations}
          onChange={e => set('observations', e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-[#D4A843] rounded-lg px-4 py-3 outline-none resize-none text-sm"
          placeholder={obsPlaceholder}
        />
      </div>

      {/* LGPD */}
      <div className="sm:col-span-2 flex items-start gap-3 py-1">
        <input
          type="checkbox"
          id="lgpd"
          checked={form.optin_accepted}
          onChange={e => set('optin_accepted', e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-pc-gold focus:ring-pc-gold flex-shrink-0"
          style={{ width: 18, height: 18 }}
        />
        <label htmlFor="lgpd" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
          {t('lgpd')}
        </label>
      </div>

      {/* Erro */}
      {error && (
        <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Botão submit */}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full shimmer text-pc-navy py-4 rounded-lg font-accent font-bold uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-[0.98] transition-transform shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:animate-none min-h-[52px]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {t('sending')}
            </span>
          ) : t('submit')}
        </button>
      </div>
    </form>
  )
}
