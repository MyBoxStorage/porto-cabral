'use client'
import { useState } from 'react'

type Props = {
  title: string
  desc: string
  placeholder: string
  successMsg: string
}

export function FooterNewsletter({ title, desc, placeholder, successMsg }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status !== 'idle') return
    setStatus('loading')
    // Simula submissão — substituir pelo endpoint real quando disponível
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 800)
  }

  return (
    <div className="pt-2">
      <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white mb-2">{title}</h4>
      <p className="text-xs text-slate-600 mb-3">{desc}</p>

      {status === 'success' ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded text-xs font-accent text-pc-gold"
          style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.25)' }}>
          <span>✓</span>
          <span>{successMsg}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}
          className="flex overflow-hidden rounded"
          style={{ border: '1px solid rgba(212,168,67,0.2)' }}>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.07] transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 text-pc-gold/70 hover:text-pc-gold transition-colors disabled:opacity-50"
            style={{ background: 'rgba(212,168,67,0.07)', borderLeft: '1px solid rgba(212,168,67,0.2)' }}>
            {status === 'loading' ? (
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : '→'}
          </button>
        </form>
      )}
    </div>
  )
}
