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
  const [gLoading, setGLoading]     = useState(false)
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

  async function handleGoogle() {
    setGLoading(true)
    await signIn('google', { callbackUrl: `/${locale}/cliente` })
  }

  const inp = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4A843]"

  return (
    <div className="min-h-screen bg-[#0074bf] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 text-[#D4A843]">
            <IconAncora size={52} strokeWidth={1.25} />
          </div>
          <h1 className="font-display text-3xl text-white mb-2">Cabine do Comandante</h1>
          <p className="text-slate-400 text-sm">Area exclusiva para clientes Porto Cabral BC</p>
        </div>

        {/* Tabs login / cadastro */}
        <div className="flex mb-6 bg-white/5 rounded-xl p-1">
          {(['login','signup'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-accent uppercase tracking-wide transition-all ${
                tab === t ? 'bg-[#D4A843] text-[#002451] font-bold' : 'text-slate-400 hover:text-white'}`}>
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
                <span className="text-xs text-slate-300 leading-relaxed">
                  Li e aceito os{' '}
                  <a href={`/${locale}/termos`} target="_blank" className="text-[#D4A843] underline underline-offset-2">
                    Termos de Uso
                  </a>{' '}
                  e a{' '}
                  <a href={`/${locale}/privacidade`} target="_blank" className="text-[#D4A843] underline underline-offset-2">
                    Politica de Privacidade
                  </a>
                  . <span className="text-red-400">*</span>
                  <span className="block text-slate-500 mt-0.5">Obrigatorio para criar a conta.</span>
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
                <span className="text-xs text-slate-300 leading-relaxed">
                  <span className="text-[#D4A843] font-semibold">🎁 Quero participar dos sorteios semanais</span>{' '}
                  e receber ofertas exclusivas dos parceiros do Porto Cabral BC em Balneario Camboriu.
                  <span className="block text-slate-500 mt-0.5">
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

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-slate-500 text-xs uppercase tracking-widest">ou</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button onClick={handleGoogle} disabled={gLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-[#002451] font-bold font-accent uppercase tracking-wide py-3 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-60">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {gLoading ? 'Redirecionando...' : 'Continuar com Google'}
        </button>

        <div className="flex justify-center mt-10 text-[#D4A843]/20">
          <IconVela size={40} strokeWidth={1} />
        </div>
      </div>
    </div>
  )
}
