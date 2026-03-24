'use client'
import { useState } from 'react'

type Locale = 'pt' | 'en' | 'es'
type Props = { locale: Locale }

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

/* ─────────────────────────────────────────────────────────────────────
   Todas as strings do quiz traduzidas.
   key = valor enviado para a API (invariante, em inglês/snake_case)
   label = o que o usuário vê (traduzido)
───────────────────────────────────────────────────────────────────── */
type StepDef = {
  key: keyof Answers
  question: string
  multi?: boolean
  opts: { value: string; label: string; emoji?: string }[]
}

const STEPS: Record<Locale, StepDef[]> = {
  pt: [
    {
      key: 'occasion_type',
      question: 'Qual é a ocasião?',
      opts: [
        { value: 'romantic',     label: 'Romântico',   emoji: '🥂' },
        { value: 'friends',      label: 'Amigos',      emoji: '🎉' },
        { value: 'business',     label: 'Negócios',    emoji: '💼' },
        { value: 'family',       label: 'Família',     emoji: '👨‍👩‍👧' },
        { value: 'celebration',  label: 'Celebração',  emoji: '✨' },
      ],
    },
    {
      key: 'visit_frequency',
      question: 'Com que frequência nos visita?',
      opts: [
        { value: 'first_time',  label: 'Primeira vez',   emoji: '🌊' },
        { value: 'occasional',  label: 'Às vezes',       emoji: '⚓' },
        { value: 'monthly',     label: 'Todo mês',       emoji: '📅' },
        { value: 'weekly',      label: 'Toda semana',    emoji: '🏆' },
      ],
    },
    {
      key: 'food_preferences',
      question: 'O que você prefere comer?',
      multi: true,
      opts: [
        { value: 'frutos_do_mar', label: 'Frutos do Mar',  emoji: '🦞' },
        { value: 'grelhados',     label: 'Grelhados',      emoji: '🔥' },
        { value: 'vegetariano',   label: 'Vegetariano',    emoji: '🥗' },
        { value: 'sobremesas',    label: 'Sobremesas',     emoji: '🍮' },
      ],
    },
    {
      key: 'drink_preferences',
      question: 'Preferência de bebida?',
      multi: true,
      opts: [
        { value: 'vinho',       label: 'Vinho',          emoji: '🍷' },
        { value: 'drinks',      label: 'Drinks',         emoji: '🍹' },
        { value: 'cerveja',     label: 'Cerveja',        emoji: '🍺' },
        { value: 'sem_alcool',  label: 'Sem álcool',     emoji: '🧃' },
      ],
    },
    {
      key: 'group_size',
      question: 'Tamanho do grupo?',
      opts: [
        { value: 'casal',   label: 'Casal',       emoji: '👫' },
        { value: '3_4',     label: '3 – 4',       emoji: '👥' },
        { value: '5_8',     label: '5 – 8',       emoji: '🎊' },
        { value: '9_mais',  label: '9 ou mais',   emoji: '🎭' },
      ],
    },
    {
      key: 'how_found',
      question: 'Como nos conheceu?',
      opts: [
        { value: 'google',       label: 'Google',       emoji: '🔍' },
        { value: 'instagram',    label: 'Instagram',    emoji: '📷' },
        { value: 'indicacao',    label: 'Indicação',    emoji: '🤝' },
        { value: 'ja_conhecia',  label: 'Já conhecia',  emoji: '⚓' },
      ],
    },
  ],

  en: [
    {
      key: 'occasion_type',
      question: 'What is the occasion?',
      opts: [
        { value: 'romantic',    label: 'Romantic',      emoji: '🥂' },
        { value: 'friends',     label: 'Friends',       emoji: '🎉' },
        { value: 'business',    label: 'Business',      emoji: '💼' },
        { value: 'family',      label: 'Family',        emoji: '👨‍👩‍👧' },
        { value: 'celebration', label: 'Celebration',   emoji: '✨' },
      ],
    },
    {
      key: 'visit_frequency',
      question: 'How often do you visit us?',
      opts: [
        { value: 'first_time',  label: 'First time',    emoji: '🌊' },
        { value: 'occasional',  label: 'Occasionally',  emoji: '⚓' },
        { value: 'monthly',     label: 'Monthly',       emoji: '📅' },
        { value: 'weekly',      label: 'Weekly',        emoji: '🏆' },
      ],
    },
    {
      key: 'food_preferences',
      question: 'What do you prefer to eat?',
      multi: true,
      opts: [
        { value: 'frutos_do_mar', label: 'Seafood',      emoji: '🦞' },
        { value: 'grelhados',     label: 'Grilled',      emoji: '🔥' },
        { value: 'vegetariano',   label: 'Vegetarian',   emoji: '🥗' },
        { value: 'sobremesas',    label: 'Desserts',     emoji: '🍮' },
      ],
    },
    {
      key: 'drink_preferences',
      question: 'Drink preference?',
      multi: true,
      opts: [
        { value: 'vinho',      label: 'Wine',            emoji: '🍷' },
        { value: 'drinks',     label: 'Cocktails',       emoji: '🍹' },
        { value: 'cerveja',    label: 'Beer',            emoji: '🍺' },
        { value: 'sem_alcool', label: 'Non-alcoholic',   emoji: '🧃' },
      ],
    },
    {
      key: 'group_size',
      question: 'Group size?',
      opts: [
        { value: 'casal',   label: 'Couple',      emoji: '👫' },
        { value: '3_4',     label: '3 – 4',       emoji: '👥' },
        { value: '5_8',     label: '5 – 8',       emoji: '🎊' },
        { value: '9_mais',  label: '9 or more',   emoji: '🎭' },
      ],
    },
    {
      key: 'how_found',
      question: 'How did you find us?',
      opts: [
        { value: 'google',      label: 'Google',        emoji: '🔍' },
        { value: 'instagram',   label: 'Instagram',     emoji: '📷' },
        { value: 'indicacao',   label: 'Recommendation',emoji: '🤝' },
        { value: 'ja_conhecia', label: 'Already knew',  emoji: '⚓' },
      ],
    },
  ],

  es: [
    {
      key: 'occasion_type',
      question: '¿Cuál es la ocasión?',
      opts: [
        { value: 'romantic',    label: 'Romántico',     emoji: '🥂' },
        { value: 'friends',     label: 'Amigos',        emoji: '🎉' },
        { value: 'business',    label: 'Negocios',      emoji: '💼' },
        { value: 'family',      label: 'Familia',       emoji: '👨‍👩‍👧' },
        { value: 'celebration', label: 'Celebración',   emoji: '✨' },
      ],
    },
    {
      key: 'visit_frequency',
      question: '¿Con qué frecuencia nos visita?',
      opts: [
        { value: 'first_time',  label: 'Primera vez',   emoji: '🌊' },
        { value: 'occasional',  label: 'A veces',       emoji: '⚓' },
        { value: 'monthly',     label: 'Cada mes',      emoji: '📅' },
        { value: 'weekly',      label: 'Cada semana',   emoji: '🏆' },
      ],
    },
    {
      key: 'food_preferences',
      question: '¿Qué prefiere comer?',
      multi: true,
      opts: [
        { value: 'frutos_do_mar', label: 'Mariscos',    emoji: '🦞' },
        { value: 'grelhados',     label: 'A la plancha', emoji: '🔥' },
        { value: 'vegetariano',   label: 'Vegetariano', emoji: '🥗' },
        { value: 'sobremesas',    label: 'Postres',     emoji: '🍮' },
      ],
    },
    {
      key: 'drink_preferences',
      question: '¿Preferencia de bebida?',
      multi: true,
      opts: [
        { value: 'vinho',      label: 'Vino',           emoji: '🍷' },
        { value: 'drinks',     label: 'Cócteles',       emoji: '🍹' },
        { value: 'cerveja',    label: 'Cerveza',        emoji: '🍺' },
        { value: 'sem_alcool', label: 'Sin alcohol',    emoji: '🧃' },
      ],
    },
    {
      key: 'group_size',
      question: '¿Tamaño del grupo?',
      opts: [
        { value: 'casal',   label: 'Pareja',      emoji: '👫' },
        { value: '3_4',     label: '3 – 4',       emoji: '👥' },
        { value: '5_8',     label: '5 – 8',       emoji: '🎊' },
        { value: '9_mais',  label: '9 o más',     emoji: '🎭' },
      ],
    },
    {
      key: 'how_found',
      question: '¿Cómo nos conoció?',
      opts: [
        { value: 'google',      label: 'Google',          emoji: '🔍' },
        { value: 'instagram',   label: 'Instagram',       emoji: '📷' },
        { value: 'indicacao',   label: 'Recomendación',   emoji: '🤝' },
        { value: 'ja_conhecia', label: 'Ya lo conocía',   emoji: '⚓' },
      ],
    },
  ],
}

const UI: Record<Locale, { prev: string; next: string; finish: string; saving: string; done_title: string; done_sub: string; multi_hint: string; title: string }> = {
  pt: { prev: '← Anterior', next: 'Próximo →', finish: 'Concluir ✓', saving: 'Salvando…', done_title: 'Preferências salvas!', done_sub: 'Vamos personalizar sua próxima visita ao Porto Cabral.', multi_hint: 'Selecione uma ou mais opções', title: 'Suas Preferências' },
  en: { prev: '← Back', next: 'Next →', finish: 'Finish ✓', saving: 'Saving…', done_title: 'Preferences saved!', done_sub: 'We will personalize your next visit to Porto Cabral.', multi_hint: 'Select one or more options', title: 'Your Preferences' },
  es: { prev: '← Anterior', next: 'Siguiente →', finish: 'Finalizar ✓', saving: 'Guardando…', done_title: '¡Preferencias guardadas!', done_sub: 'Personalizaremos su próxima visita a Porto Cabral.', multi_hint: 'Seleccione una o más opciones', title: 'Sus Preferencias' },
}

export function QuizPreferencias({ locale }: Props) {
  const steps = STEPS[locale]
  const ui = UI[locale]

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

  /* ── Tela de conclusão ── */
  if (done) return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
      <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '1.2rem', color: '#D4A843', margin: '0 0 8px' }}>{ui.done_title}</p>
      <p style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em', lineHeight: 1.6, margin: 0 }}>{ui.done_sub}</p>
    </div>
  )

  const cur = steps[step]
  const val = answers[cur.key]

  return (
    <div>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
        @keyframes shimmer { to { background-position: 200% center; } }
        .quiz-opt:active { transform: scale(0.97); }
      `}</style>

      {/* Título */}
      <p style={{
        fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
        fontSize: '1.1rem', color: '#fff', margin: '0 0 1.25rem',
      }}>{ui.title}</p>

      {/* Barra de progresso */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem' }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 3, borderRadius: 99,
              background: i < step ? '#D4A843' : i === step ? 'rgba(212,168,67,0.6)' : 'rgba(255,255,255,0.08)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {/* Pergunta */}
      <div key={step} style={{ animation: 'slideIn 0.25s ease' }}>
        <p style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: 'clamp(1rem, 4vw, 1.15rem)',
          color: '#fff', margin: '0 0 6px', lineHeight: 1.4,
        }}>
          {cur.question}
        </p>
        {cur.multi && (
          <p style={{
            fontFamily: "'Josefin Sans',sans-serif",
            fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'rgba(212,168,67,0.5)', margin: '0 0 1.25rem',
          }}>
            {ui.multi_hint}
          </p>
        )}
        {!cur.multi && <div style={{ marginBottom: '1.25rem' }} />}

        {/* Opções */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: cur.opts.length <= 4 ? '1fr 1fr' : '1fr 1fr',
          gap: 10,
        }}>
          {cur.opts.map(opt => {
            const selected = Array.isArray(val) ? val.includes(opt.value) : val === opt.value
            return (
              <button
                key={opt.value}
                className="quiz-opt"
                onClick={() => toggle(cur.key, opt.value, cur.multi)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 16px', borderRadius: 12,
                  border: `1.5px solid ${selected ? '#D4A843' : 'rgba(255,255,255,0.1)'}`,
                  background: selected
                    ? 'rgba(212,168,67,0.12)'
                    : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {opt.emoji && (
                  <span style={{ fontSize: '1.1rem', flexShrink: 0, lineHeight: 1 }}>{opt.emoji}</span>
                )}
                <span style={{
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: '0.7rem', fontWeight: selected ? 700 : 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: selected ? '#D4A843' : 'rgba(255,255,255,0.65)',
                  textAlign: 'left', lineHeight: 1.3,
                }}>
                  {opt.label}
                </span>
                {/* Checkmark */}
                {selected && (
                  <span style={{ marginLeft: 'auto', color: '#D4A843', fontSize: '0.75rem', flexShrink: 0 }}>✓</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navegação */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', gap: 12 }}>
        <button
          onClick={prev}
          disabled={step === 0}
          style={{
            fontFamily: "'Josefin Sans',sans-serif",
            fontSize: '0.65rem', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: step === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
            background: 'transparent', border: 'none',
            cursor: step === 0 ? 'default' : 'pointer',
            padding: 0, transition: 'color 0.2s',
          }}
        >
          {ui.prev}
        </button>

        {step < steps.length - 1 ? (
          <button
            onClick={next}
            style={{
              fontFamily: "'Josefin Sans',sans-serif",
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#002451',
              background: 'linear-gradient(90deg,#D4A843,#FECE65,#D4A843)',
              backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite',
              border: 'none', borderRadius: 10,
              padding: '12px 24px', cursor: 'pointer',
              minHeight: 46,
            }}
          >
            {ui.next}
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={saving}
            style={{
              fontFamily: "'Josefin Sans',sans-serif",
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#002451',
              background: saving ? 'rgba(212,168,67,0.4)' : 'linear-gradient(90deg,#D4A843,#FECE65,#D4A843)',
              backgroundSize: '200% auto',
              animation: saving ? 'none' : 'shimmer 3s linear infinite',
              border: 'none', borderRadius: 10,
              padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1, minHeight: 46,
            }}
          >
            {saving ? ui.saving : ui.finish}
          </button>
        )}
      </div>

      {/* Indicador de passo */}
      <p style={{
        fontFamily: "'Josefin Sans',sans-serif",
        fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.2)', textAlign: 'center', margin: '1.25rem 0 0',
      }}>
        {step + 1} / {steps.length}
      </p>
    </div>
  )
}
