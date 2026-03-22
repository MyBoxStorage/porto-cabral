'use client'
import { useEffect, useState } from 'react'
import { IconConfirmado, IconCancelado, IconPendente, IconEstrelaMar, IconAncora, IconLogbook } from '@/components/icons'

type Reservation = {
  id: string; name: string; email: string
  reservation_date: string; reservation_time: string
  party_size: number; status: string; occasion_type?: string
}

type StatusCfg = {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  label: string
  color: string
}

const STATUS: Record<string, StatusCfg> = {
  pending:   { Icon: IconPendente,   label: 'Pendente',   color: 'text-amber-400' },
  confirmed: { Icon: IconConfirmado, label: 'Confirmada', color: 'text-green-400' },
  cancelled: { Icon: IconCancelado,  label: 'Cancelada',  color: 'text-red-400'   },
  completed: { Icon: IconEstrelaMar, label: 'Concluída',  color: 'text-[#D4A843]' },
}

export function MinhasReservas() {
  const [reservas, setReservas] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/cliente/reservas')
      .then(r => r.json())
      .then(data => { setReservas(data.reservations ?? []); setLoading(false) })
      .catch(() => { setErro('Não foi possível carregar suas reservas.'); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-[#D4A843] animate-spin">
        <IconAncora size={32} strokeWidth={1.5} />
      </div>
    </div>
  )
  if (erro) return <p className="text-red-400 text-sm py-4">{erro}</p>
  if (reservas.length === 0) return (
    <div className="text-center py-10 text-slate-400">
      <div className="flex justify-center mb-4 opacity-30">
        <IconLogbook size={48} strokeWidth={1} />
      </div>
      <p className="text-sm">Você ainda não tem reservas.</p>
    </div>
  )

  return (
    <div className="space-y-4">
      {reservas.map(r => {
        const cfg = STATUS[r.status] ?? STATUS.pending
        const { Icon } = cfg
        return (
          <div key={r.id} className="bg-[#1a3a6b]/40 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-white font-semibold font-display">{r.reservation_date} às {r.reservation_time}</p>
                <p className="text-slate-400 text-sm mt-0.5">
                  {r.party_size} pessoa(s){r.occasion_type ? ` · ${r.occasion_type}` : ''}
                </p>
              </div>
              <div className={`flex items-center gap-1.5 text-sm font-accent uppercase tracking-wide ${cfg.color}`}>
                <Icon size={14} strokeWidth={2} />
                {cfg.label}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
