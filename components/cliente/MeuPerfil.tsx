'use client'
import { useState } from 'react'
import type { Session } from 'next-auth'

type Locale = 'pt' | 'en' | 'es'
type Props = { session: Session; locale: Locale }

const LABELS: Record<Locale, {
  fields: { key: string; label: string; placeholder: string; type?: string }[]
  save: string; saving: string; ok: string; err: string
}> = {
  pt: {
    fields: [
      { key: 'name',          label: 'Nome Completo',  placeholder: 'Seu nome completo' },
      { key: 'whatsapp',      label: 'WhatsApp',       placeholder: '(00) 00000-0000', type: 'tel' },
      { key: 'city_of_origin',label: 'Cidade de Origem', placeholder: 'Sua cidade' },
      { key: 'allergies',     label: 'Alergias',       placeholder: 'Frutos do mar, glúten…' },
      { key: 'special_notes', label: 'Observações',    placeholder: 'Preferências de mesa, ocasiões…' },
    ],
    save: 'Salvar Alterações', saving: 'Salvando…',
    ok: 'Perfil atualizado com sucesso!', err: 'Não foi possível atualizar o perfil.',
  },
  en: {
    fields: [
      { key: 'name',          label: 'Full Name',      placeholder: 'Your full name' },
      { key: 'whatsapp',      label: 'WhatsApp',       placeholder: '+00 (00) 00000-0000', type: 'tel' },
      { key: 'city_of_origin',label: 'City of Origin', placeholder: 'Your city' },
      { key: 'allergies',     label: 'Allergies',      placeholder: 'Seafood, gluten…' },
      { key: 'special_notes', label: 'Notes',          placeholder: 'Table preferences, occasions…' },
    ],
    save: 'Save Changes', saving: 'Saving…',
    ok: 'Profile updated successfully!', err: 'Could not update profile.',
  },
  es: {
    fields: [
      { key: 'name',          label: 'Nombre Completo', placeholder: 'Su nombre completo' },
      { key: 'whatsapp',      label: 'WhatsApp',        placeholder: '+00 (00) 00000-0000', type: 'tel' },
      { key: 'city_of_origin',label: 'Ciudad de Origen', placeholder: 'Su ciudad' },
      { key: 'allergies',     label: 'Alergias',        placeholder: 'Mariscos, gluten…' },
      { key: 'special_notes', label: 'Observaciones',   placeholder: 'Preferencias de mesa, ocasiones…' },
    ],
    save: 'Guardar Cambios', saving: 'Guardando…',
    ok: '¡Perfil actualizado con éxito!', err: 'No se pudo actualizar el perfil.',
  },
}

export function MeuPerfil({ session, locale }: Props) {
  const L = LABELS[locale]
  const [form, setForm] = useState({
    name: session.user?.name ?? '',
    whatsapp: '', city_of_origin: '', allergies: '', special_notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  function set(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setMsg(null)
    try {
      const res = await fetch('/api/cliente/perfil', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setMsg({ type: 'ok', text: L.ok })
    } catch {
      setMsg({ type: 'err', text: L.err })
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
        .pc-perfil-input:focus { border-color: rgba(212,168,67,0.6) !important; outline: none; box-shadow: 0 0 0 3px rgba(212,168,67,0.08); }
      `}</style>

      {L.fields.map(({ key, label, placeholder, type }, i) => (
        <div key={key} style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
          <label style={{
            display: 'block',
            fontFamily: "'Josefin Sans',sans-serif",
            fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(212,168,67,0.6)', marginBottom: 8,
          }}>
            {label}
          </label>
          <input
            className="pc-perfil-input"
            type={type ?? 'text'}
            value={form[key as keyof typeof form]}
            onChange={e => set(key as keyof typeof form, e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '13px 16px',
              fontFamily: "'Inter',sans-serif", fontSize: '0.9rem',
              color: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
        </div>
      ))}

      {/* Mensagem de feedback */}
      {msg && (
        <div style={{
          padding: '12px 16px', borderRadius: 10,
          background: msg.type === 'ok' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${msg.type === 'ok' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
          fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.75rem',
          color: msg.type === 'ok' ? '#34d399' : '#f87171',
          letterSpacing: '0.04em',
        }}>
          {msg.type === 'ok' ? '✓ ' : '⚠ '}{msg.text}
        </div>
      )}

      {/* Botão salvar */}
      <button
        type="submit"
        disabled={saving}
        style={{
          fontFamily: "'Josefin Sans',sans-serif",
          fontSize: '0.7rem', fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#002451',
          background: saving
            ? 'rgba(212,168,67,0.4)'
            : 'linear-gradient(90deg,#D4A843,#FECE65,#D4A843)',
          backgroundSize: '200% auto',
          animation: saving ? 'none' : 'shimmer 3s linear infinite',
          border: 'none', borderRadius: 10,
          padding: '14px 24px',
          cursor: saving ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.2s',
          opacity: saving ? 0.6 : 1,
          minHeight: 48,
        }}
      >
        {saving ? L.saving : L.save}
      </button>
      <style>{`@keyframes shimmer { to { background-position: 200% center; } }`}</style>
    </form>
  )
}
