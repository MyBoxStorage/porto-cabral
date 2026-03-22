'use client'
import { useState } from 'react'

type Answers = {
  occasion_type: string; visit_frequency: string
  food_preferences: string[]; drink_preferences: string[]
  group_size: string; how_found: string
}

const initial: Answers = {
  occasion_type: '', visit_frequency: '',
  food_preferences: [], drink_preferences: [],
  group_size: '', how_found: '',
}

const steps = [
  { key: 'occasion_type', label: 'Qual é a ocasião?',
    opts: ['romantic','friends','business','family','celebration'] },
  { key: 'visit_frequency', label: 'Com que frequência nos visita?',
    opts: ['first_time','monthly','weekly','occasional'] },
  { key: 'food_preferences', label: 'O que você prefere comer?',
    opts: ['frutos_do_mar','grelhados','vegetariano','sobremesas'], multi: true },
  { key: 'drink_preferences', label: 'Sua preferência de bebida?',
    opts: ['vinho','drinks','cerveja','sem_alcool'], multi: true },
  { key: 'group_size', label: 'Tamanho do grupo?',
    opts: ['casal','3_4','5_8','9_mais'] },
  { key: 'how_found', label: 'Como nos conheceu?',
    opts: ['google','instagram','indicacao','ja_conhecia'] },
]

export function QuizPreferencias() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(initial)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  function toggle(key: keyof Answers, val: string, multi?: boolean) {
    if (multi) {
      const arr = (answers[key] as string[])
      setAnswers(a => ({
        ...a,
        [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val],
      }))
    } else {
      setAnswers(a => ({ ...a, [key]: val }))
    }
  }

  function next() { if (step < steps.length - 1) setStep(s => s + 1) }
  function prev() { if (step > 0) setStep(s => s - 1) }

  async function submit() {
    setSaving(true)
    try {
      await fetch('/api/cliente/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
      setDone(true)
    } catch { /* silent */ }
    finally { setSaving(false) }
  }

  if (done) return (
    <div className="text-center py-8">
      <p className="text-3xl mb-4">🎉</p>
      <p className="text-white font-display text-xl mb-2">Obrigado!</p>
      <p className="text-slate-400 text-sm">Suas preferências foram salvas. Vamos personalizar sua próxima visita!</p>
    </div>
  )

  const cur = steps[step]
  const val = answers[cur.key as keyof Answers]

  return (
    <div className="space-y-6">
      <div className="flex gap-1 mb-4">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-[#D4A843]' : 'bg-white/10'}`} />
        ))}
      </div>
      <p className="text-white font-display text-lg">{cur.label}</p>
      <div className="grid grid-cols-2 gap-3">
        {cur.opts.map(opt => {
          const selected = Array.isArray(val) ? val.includes(opt) : val === opt
          return (
            <button key={opt} onClick={() => toggle(cur.key as keyof Answers, opt, cur.multi)}
              className={`py-3 px-4 rounded-xl border text-sm font-accent uppercase tracking-wide transition-all ${
                selected ? 'bg-[#D4A843] border-[#D4A843] text-[#002451] font-bold'
                         : 'border-white/20 text-slate-300 hover:border-[#D4A843]/50'}`}>
              {opt.replace(/_/g, ' ')}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between pt-2">
        <button onClick={prev} disabled={step === 0}
          className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors text-sm">
          ← Anterior
        </button>
        {step < steps.length - 1 ? (
          <button onClick={next}
            className="bg-[#D4A843] text-[#002451] font-bold font-accent uppercase tracking-wide px-6 py-2 rounded-lg hover:brightness-110 transition-all">
            Próximo →
          </button>
        ) : (
          <button onClick={submit} disabled={saving}
            className="bg-[#D4A843] text-[#002451] font-bold font-accent uppercase tracking-wide px-6 py-2 rounded-lg hover:brightness-110 transition-all disabled:opacity-60">
            {saving ? 'Salvando...' : 'Concluir ✓'}
          </button>
        )}
      </div>
    </div>
  )
}
