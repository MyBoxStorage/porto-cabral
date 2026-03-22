'use client'
import { useState } from 'react'
import type { Session } from 'next-auth'

type Props = { session: Session }

export function MeuPerfil({ session }: Props) {
  const [form, setForm] = useState({
    name: session.user?.name ?? '',
    whatsapp: '',
    city_of_origin: '',
    allergies: '',
    special_notes: '',
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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Erro ao salvar.')
      setMsg({ type: 'ok', text: 'Perfil atualizado com sucesso!' })
    } catch {
      setMsg({ type: 'err', text: 'Não foi possível atualizar o perfil.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {[
        { key: 'name',          label: 'Nome',         placeholder: 'Seu nome completo' },
        { key: 'whatsapp',      label: 'WhatsApp',     placeholder: '(00) 00000-0000'  },
        { key: 'city_of_origin',label: 'Cidade',       placeholder: 'Sua cidade'       },
        { key: 'allergies',     label: 'Alergias',     placeholder: 'Frutos do mar...' },
        { key: 'special_notes', label: 'Observações',  placeholder: 'Preferências...'  },
      ].map(({ key, label, placeholder }) => (
        <div key={key} className="space-y-1">
          <label className="text-xs font-accent uppercase tracking-widest text-slate-400">{label}</label>
          <input value={form[key as keyof typeof form]}
            onChange={e => set(key as keyof typeof form, e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4A843]" />
        </div>
      ))}
      {msg && (
        <p className={`text-sm ${msg.type === 'ok' ? 'text-green-400' : 'text-red-400'}`}>{msg.text}</p>
      )}
      <button type="submit" disabled={saving}
        className="bg-[#D4A843] text-[#002451] font-bold font-accent uppercase tracking-widest px-8 py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-60">
        {saving ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  )
}
