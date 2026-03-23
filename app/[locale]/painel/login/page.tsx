'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useState } from 'react'

export default function PainelLoginPage() {
  const locale = useLocale()
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      setError('Email ou senha invalidos.')
      setLoading(false)
      return
    }
    // Redireciona para o painel — o Server Component verifica se eh admin
    router.push(`/${locale}/painel`)
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: 8,
    border: '1px solid rgba(212,168,67,0.25)',
    background: 'rgba(255,255,255,0.06)', color: '#fff',
    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em',
    textTransform: 'uppercase', color: 'rgba(212,168,67,0.55)',
    marginBottom: '0.4rem',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #001432 0%, #002451 60%, #0d2040 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: 40, marginBottom: '1rem' }}>⚓</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.75rem', fontStyle: 'italic', fontWeight: 400,
            color: '#D4A843', margin: '0 0 0.4rem',
          }}>
            Porto Cabral BC
          </h1>
          <p style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(212,168,67,0.45)', margin: 0,
          }}>
            Painel Administrativo
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              required type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@portocabralbc.com.br"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Senha</label>
            <input
              required type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '0.75rem 1rem',
              color: '#fca5a5', fontSize: '0.85rem',
              fontFamily: "'Josefin Sans', sans-serif",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              marginTop: '0.5rem', padding: '0.85rem',
              borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading
                ? 'rgba(212,168,67,0.4)'
                : 'linear-gradient(90deg, #D4A843 0%, #FECE65 50%, #D4A843 100%)',
              color: '#002451', fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              opacity: loading ? 0.7 : 1, width: '100%',
            }}
          >
            {loading ? 'Aguarde...' : 'Entrar no Painel'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href={`/${locale}`} style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(212,168,67,0.35)', textDecoration: 'none',
          }}>
            <- Voltar ao site
          </a>
        </div>

      </div>
    </div>
  )
}
