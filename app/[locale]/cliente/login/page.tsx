'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import { IconAncora, IconVela } from '@/components/icons'

export default function ClienteLoginPage() {
  const locale = useLocale()
  const router = useRouter()
  const [tab, setTab]               = useState<'login' | 'signup'>('login')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName]             = useState('')
  const [whatsapp, setWhatsapp]     = useState('')
  const [optinTermos, setOptinTermos]       = useState(false)
  const [optinParceiros, setOptinParceiros] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      setError('Email ou senha invalidos.')
      setLoading(false)
    } else {
      await fetch('/api/cliente/login-event', { method: 'POST' }).catch(() => {})
      router.push(`/${locale}/cliente`)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!optinTermos) {
      setError('Voce precisa aceitar os Termos de Uso e a Politica de Privacidade para continuar.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas nao coincidem.')
      return
    }
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, password, whatsapp,
          optin_accepted: optinTermos,
          optin_parceiros: optinParceiros,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.formErrors?.[0] ?? data.error ?? 'Erro.')
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) throw new Error('Conta criada! Faca login.')
      router.push(`/${locale}/cliente`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.')
      setLoading(false)
    }
  }

  const inp = "w-full bg-[#005fa3] border border-white/25 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-[#D4A843]"

  return (
    <div className="min-h-screen bg-[#0074bf] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 text-[#D4A843]">
            <IconAncora size={52} strokeWidth={1.25} />
          </div>
          <h1 className="font-display text-3xl text-white mb-2">Cabine do Comandante</h1>
          <p className="text-white/70 text-sm">Area exclusiva para clientes Porto Cabral BC</p>
        </div>

        {/* Tabs login / cadastro */}
        <div className="flex mb-6 bg-white/5 rounded-xl p-1">
          {(['login','signup'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-accent uppercase tracking-wide transition-all ${
                tab === t ? 'bg-[#D4A843] text-[#002451] font-bold' : 'text-white/60 hover:text-white'}`}>
              {t === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className="space-y-4">

          {/* Campos exclusivos do cadastro */}
          {tab === 'signup' && (
            <>
              <input required value={name} onChange={e => setName(e.target.value)}
                className={inp} placeholder="Nome completo" />
              <input required value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                className={inp} placeholder="WhatsApp (00) 00000-0000" type="tel" />
            </>
          )}

          {/* Email e senha (comuns) */}
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
            className={inp} placeholder="Email" />
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
            className={inp} placeholder="Senha (minimo 8 caracteres)" minLength={8} />

          {/* Confirmacao de senha — apenas no cadastro */}
          {tab === 'signup' && (
            <input required type="password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={inp} placeholder="Repita a senha" minLength={8} />
          )}

          {/* Opt-ins — apenas no cadastro */}
          {tab === 'signup' && (
            <div className="space-y-3 pt-1">

              {/* Opt-in obrigatorio: Termos + Privacidade */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={optinTermos}
                    onChange={e => setOptinTermos(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-500 text-[#D4A843] focus:ring-[#D4A843] accent-[#D4A843]"
                  />
                </div>
                <span className="text-xs text-white/80 leading-relaxed">
                  Li e aceito os{' '}
                  <a href={`/${locale}/termos`} target="_blank" className="text-[#D4A843] underline underline-offset-2">
                    Termos de Uso
                  </a>{' '}
                  e a{' '}
                  <a href={`/${locale}/privacidade`} target="_blank" className="text-[#D4A843] underline underline-offset-2">
                    Politica de Privacidade
                  </a>
                  . <span className="text-red-400">*</span>
                  <span className="block text-white/50 mt-0.5">Obrigatorio para criar a conta.</span>
                </span>
              </label>

              {/* Opt-in opcional: sorteios e parceiros */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={optinParceiros}
                    onChange={e => setOptinParceiros(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-500 text-[#D4A843] focus:ring-[#D4A843] accent-[#D4A843]"
                  />
                </div>
                <span className="text-xs text-white/80 leading-relaxed">
                  <span className="text-[#D4A843] font-semibold">🎁 Quero participar dos sorteios semanais</span>{' '}
                  e receber ofertas exclusivas dos parceiros do Porto Cabral BC em Balneario Camboriu.
                  <span className="block text-white/50 mt-0.5">
                    Opcional. Autorizo o compartilhamento do meu perfil com parceiros para promocoes personalizadas.
                    Revogavel a qualquer momento. LGPD — Lei 13.709/2018.
                  </span>
                </span>
              </label>

            </div>
          )}

          {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-3">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-[#D4A843] text-[#002451] font-bold font-accent uppercase tracking-widest py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-60">
            {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
          </button>

        </form>

        <div className="flex justify-center mt-10 text-[#D4A843]/20">
          <IconVela size={40} strokeWidth={1} />
        </div>
      </div>
    </div>
  )
}
