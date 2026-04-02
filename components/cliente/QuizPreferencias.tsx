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

/* ── SVGs profissionais — traço fino, paleta neutra, 20×20 viewBox ── */
const ICONS: Record<string, React.ReactNode> = {
  /* Ocasião */
  romantic: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 17s-7-4.5-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 17 8c0 4.5-7 9-7 9z"/>
    </svg>
  ),
  friends: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="3"/>
      <circle cx="13" cy="7" r="3"/>
      <path d="M1 17c0-3 2.7-5 6-5m6 0c3.3 0 6 2 6 5"/>
      <path d="M7 12c1 .4 2 .6 3 .6s2-.2 3-.6"/>
    </svg>
  ),
  business: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="16" height="11" rx="1.5"/>
      <path d="M7 7V5a3 3 0 0 1 6 0v2"/>
      <line x1="10" y1="11" x2="10" y2="14"/>
      <line x1="7" y1="12.5" x2="13" y2="12.5"/>
    </svg>
  ),
  family: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="5.5" r="2.2"/>
      <circle cx="14" cy="5.5" r="2.2"/>
      <circle cx="10" cy="13" r="1.5"/>
      <path d="M2 17c0-2.5 1.8-4 4-4h.5M18 17c0-2.5-1.8-4-4-4h-.5"/>
      <path d="M7.5 13c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5"/>
    </svg>
  ),
  celebration: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      {/* Taça de champagne */}
      <path d="M7 2 h6 l-2 7 a2.5 2.5 0 0 1-2 0z"/>
      <line x1="10" y1="9" x2="10" y2="15"/>
      <line x1="7" y1="15" x2="13" y2="15"/>
      {/* Bolhas */}
      <circle cx="9" cy="5" r="0.6" fill="currentColor" stroke="none"/>
      <circle cx="11.5" cy="4" r="0.5" fill="currentColor" stroke="none"/>
      {/* Brilhos */}
      <line x1="14" y1="3" x2="16" y2="1"/>
      <line x1="15" y1="5" x2="17" y2="5"/>
      <line x1="14" y1="7" x2="16" y2="8"/>
    </svg>
  ),
  /* Frequência */
  first_time: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      {/* Onda do mar */}
      <path d="M2 8 Q4 5 6 8 Q8 11 10 8 Q12 5 14 8 Q16 11 18 8"/>
      <path d="M2 13 Q4 10 6 13 Q8 16 10 13 Q12 10 14 13 Q16 16 18 13"/>
    </svg>
  ),
  occasional: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      {/* Bússola */}
      <circle cx="10" cy="10" r="7.5"/>
      <polygon points="10,4 12,10 10,12 8,10" fill="currentColor" stroke="none" opacity="0.6"/>
      <polygon points="10,16 12,10 10,12 8,10" fill="none" stroke="currentColor" strokeWidth="1"/>
      <circle cx="10" cy="10" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  ),
  monthly: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="14" height="13" rx="1.5"/>
      <line x1="3" y1="8" x2="17" y2="8"/>
      <line x1="7" y1="2" x2="7" y2="6"/>
      <line x1="13" y1="2" x2="13" y2="6"/>
      <circle cx="10" cy="12.5" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  ),
  weekly: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3 l2 5h5l-4 3 1.5 5L10 13l-4.5 3L7 11 3 8h5z"/>
    </svg>
  ),
  /* Comida */
  frutos_do_mar: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13 Q6 7 10 7 Q14 7 17 13"/>
      <path d="M10 7 Q10 4 13 3"/>
      <path d="M7 9.5 Q10 8 13 9.5"/>
      <path d="M5.5 11.5 Q10 10 14.5 11.5"/>
      <line x1="6" y1="14" x2="6" y2="16"/>
      <line x1="10" y1="14" x2="10" y2="17"/>
      <line x1="14" y1="14" x2="14" y2="16"/>
    </svg>
  ),
  grelhados: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11 Q10 8 16 11"/>
      <line x1="2" y1="11" x2="18" y2="11"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="6" y1="17" x2="14" y2="17"/>
      <path d="M7 8 Q7 5 9 4 Q8 6 10 5 Q9 7 11 6 Q10 8 12 7"/>
    </svg>
  ),
  vegetariano: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 17 Q10 10 5 6 Q8 6 10 9 Q12 5 17 4 Q14 8 10 10"/>
      <path d="M10 17 Q10 13 7 11"/>
    </svg>
  ),
  sobremesas: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10 Q6 6 10 5 Q14 6 14 10"/>
      <rect x="5" y="10" width="10" height="5" rx="1"/>
      <line x1="5" y1="15" x2="15" y2="15"/>
      <line x1="10" y1="4" x2="10" y2="2"/>
    </svg>
  ),
  /* Bebida */
  vinho: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2 h6 l-1 6 a3 3 0 0 1-4 0z"/>
      <line x1="10" y1="11" x2="10" y2="16"/>
      <line x1="7" y1="16" x2="13" y2="16"/>
    </svg>
  ),
  drinks: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 3 h12 l-5 7 v6"/>
      <line x1="8" y1="16" x2="12" y2="16"/>
      <line x1="11" y1="7" x2="15" y2="4"/>
    </svg>
  ),
  cerveja: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="6" width="9" height="11" rx="1"/>
      <path d="M14 8 h2 a1.5 1.5 0 0 1 0 3 h-2"/>
      <path d="M5 6 Q5 3 8 3 Q8 5 10 4 Q10 6 13 6"/>
    </svg>
  ),
  sem_alcool: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      {/* Folha de chá / copo com canudo */}
      <rect x="5.5" y="6" width="9" height="11" rx="1.5"/>
      <path d="M8.5 6 V4.5 a1.5 1.5 0 0 1 3 0 V6"/>
      {/* Canudo / folha dentro */}
      <path d="M10 9 Q12 10 10 12 Q8 13 10 15"/>
      <path d="M5.5 10 h9"/>
    </svg>
  ),
  /* Grupo */
  casal: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="5.5" r="2.5"/>
      <circle cx="12.5" cy="5.5" r="2.5"/>
      <path d="M2 17 c0-3 2.5-4.5 5.5-4.5"/>
      <path d="M18 17 c0-3-2.5-4.5-5.5-4.5"/>
      <path d="M7.5 12.5 Q10 14 12.5 12.5"/>
    </svg>
  ),
  '3_4': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="5" r="2.2"/>
      <circle cx="4.5" cy="7" r="1.8"/>
      <circle cx="15.5" cy="7" r="1.8"/>
      <path d="M5 17 c0-2.5 2-4 5-4 s5 1.5 5 4"/>
      <path d="M1 17 c0-2 1.2-3 3.5-3"/>
      <path d="M19 17 c0-2-1.2-3-3.5-3"/>
    </svg>
  ),
  '5_8': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="4.5" r="2"/>
      <circle cx="4" cy="6.5" r="1.6"/>
      <circle cx="16" cy="6.5" r="1.6"/>
      <circle cx="7" cy="9" r="1.4"/>
      <circle cx="13" cy="9" r="1.4"/>
      <path d="M2 17 c0-2 4-3 8-3 s8 1 8 3"/>
    </svg>
  ),
  '9_mais': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="5" r="2"/>
      <circle cx="10" cy="4" r="2"/>
      <circle cx="14" cy="5" r="2"/>
      <circle cx="3.5" cy="9" r="1.7"/>
      <circle cx="10" cy="8.5" r="1.7"/>
      <circle cx="16.5" cy="9" r="1.7"/>
      <path d="M1 17 c0-2 3-3.5 9-3.5 s9 1.5 9 3.5"/>
    </svg>
  ),
  /* Como encontrou */
  google: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="5.5"/>
      <line x1="13.2" y1="13.2" x2="17" y2="17"/>
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="4"/>
      <circle cx="10" cy="10" r="3.2"/>
      <circle cx="14.2" cy="5.8" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  ),
  indicacao: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10 l2.5 2.5 L14 7"/>
      <path d="M3.5 6.5 A7.5 7.5 0 1 0 6.5 3.5"/>
      <path d="M3.5 2 v4.5 h4.5"/>
    </svg>
  ),
  ja_conhecia: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      {/* Âncora — ícone central do Porto Cabral */}
      <circle cx="10" cy="5" r="2"/>
      <line x1="10" y1="7" x2="10" y2="17"/>
      <path d="M5 10 h10"/>
      <path d="M5 17 Q5 14 10 14"/>
      <path d="M15 17 Q15 14 10 14"/>
    </svg>
  ),
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
  opts: { value: string; label: string }[]
}

const STEPS: Record<Locale, StepDef[]> = {
  pt: [
    {
      key: 'occasion_type',
      question: 'Qual é a ocasião?',
      opts: [
        { value: 'romantic',    label: 'Romântico'  },
        { value: 'friends',     label: 'Amigos'     },
        { value: 'business',    label: 'Negócios'   },
        { value: 'family',      label: 'Família'    },
        { value: 'celebration', label: 'Celebração' },
      ],
    },
    {
      key: 'visit_frequency',
      question: 'Com que frequência nos visita?',
      opts: [
        { value: 'first_time', label: 'Primeira vez' },
        { value: 'occasional', label: 'Às vezes'     },
        { value: 'monthly',    label: 'Todo mês'     },
        { value: 'weekly',     label: 'Toda semana'  },
      ],
    },
    {
      key: 'food_preferences',
      question: 'O que você prefere comer?',
      multi: true,
      opts: [
        { value: 'frutos_do_mar', label: 'Frutos do Mar' },
        { value: 'grelhados',     label: 'Grelhados'     },
        { value: 'vegetariano',   label: 'Vegetariano'   },
        { value: 'sobremesas',    label: 'Sobremesas'    },
      ],
    },
    {
      key: 'drink_preferences',
      question: 'Preferência de bebida?',
      multi: true,
      opts: [
        { value: 'vinho',      label: 'Vinho'      },
        { value: 'drinks',     label: 'Drinks'     },
        { value: 'cerveja',    label: 'Cerveja'    },
        { value: 'sem_alcool', label: 'Sem álcool' },
      ],
    },
    {
      key: 'group_size',
      question: 'Tamanho do grupo?',
      opts: [
        { value: 'casal',   label: 'Casal'     },
        { value: '3_4',     label: '3 – 4'     },
        { value: '5_8',     label: '5 – 8'     },
        { value: '9_mais',  label: '9 ou mais' },
      ],
    },
    {
      key: 'how_found',
      question: 'Como nos conheceu?',
      opts: [
        { value: 'google',      label: 'Google'    },
        { value: 'instagram',   label: 'Instagram' },
        { value: 'indicacao',   label: 'Indicação' },
        { value: 'ja_conhecia', label: 'Já conhecia' },
      ],
    },
  ],
  en: [
    {
      key: 'occasion_type',
      question: 'What is the occasion?',
      opts: [
        { value: 'romantic',    label: 'Romantic'    },
        { value: 'friends',     label: 'Friends'     },
        { value: 'business',    label: 'Business'    },
        { value: 'family',      label: 'Family'      },
        { value: 'celebration', label: 'Celebration' },
      ],
    },
    {
      key: 'visit_frequency',
      question: 'How often do you visit us?',
      opts: [
        { value: 'first_time', label: 'First time'   },
        { value: 'occasional', label: 'Occasionally' },
        { value: 'monthly',    label: 'Monthly'      },
        { value: 'weekly',     label: 'Weekly'       },
      ],
    },
    {
      key: 'food_preferences',
      question: 'What do you prefer to eat?',
      multi: true,
      opts: [
        { value: 'frutos_do_mar', label: 'Seafood'    },
        { value: 'grelhados',     label: 'Grilled'    },
        { value: 'vegetariano',   label: 'Vegetarian' },
        { value: 'sobremesas',    label: 'Desserts'   },
      ],
    },
    {
      key: 'drink_preferences',
      question: 'Drink preference?',
      multi: true,
      opts: [
        { value: 'vinho',      label: 'Wine'          },
        { value: 'drinks',     label: 'Cocktails'     },
        { value: 'cerveja',    label: 'Beer'          },
        { value: 'sem_alcool', label: 'Non-alcoholic' },
      ],
    },
    {
      key: 'group_size',
      question: 'Group size?',
      opts: [
        { value: 'casal',   label: 'Couple'    },
        { value: '3_4',     label: '3 – 4'     },
        { value: '5_8',     label: '5 – 8'     },
        { value: '9_mais',  label: '9 or more' },
      ],
    },
    {
      key: 'how_found',
      question: 'How did you find us?',
      opts: [
        { value: 'google',      label: 'Google'         },
        { value: 'instagram',   label: 'Instagram'      },
        { value: 'indicacao',   label: 'Recommendation' },
        { value: 'ja_conhecia', label: 'Already knew'   },
      ],
    },
  ],
  es: [
    {
      key: 'occasion_type',
      question: '¿Cuál es la ocasión?',
      opts: [
        { value: 'romantic',    label: 'Romántico'   },
        { value: 'friends',     label: 'Amigos'      },
        { value: 'business',    label: 'Negocios'    },
        { value: 'family',      label: 'Familia'     },
        { value: 'celebration', label: 'Celebración' },
      ],
    },
    {
      key: 'visit_frequency',
      question: '¿Con qué frecuencia nos visita?',
      opts: [
        { value: 'first_time', label: 'Primera vez' },
        { value: 'occasional', label: 'A veces'     },
        { value: 'monthly',    label: 'Cada mes'    },
        { value: 'weekly',     label: 'Cada semana' },
      ],
    },
    {
      key: 'food_preferences',
      question: '¿Qué prefiere comer?',
      multi: true,
      opts: [
        { value: 'frutos_do_mar', label: 'Mariscos'     },
        { value: 'grelhados',     label: 'A la plancha' },
        { value: 'vegetariano',   label: 'Vegetariano'  },
        { value: 'sobremesas',    label: 'Postres'      },
      ],
    },
    {
      key: 'drink_preferences',
      question: '¿Preferencia de bebida?',
      multi: true,
      opts: [
        { value: 'vinho',      label: 'Vino'        },
        { value: 'drinks',     label: 'Cócteles'    },
        { value: 'cerveja',    label: 'Cerveza'     },
        { value: 'sem_alcool', label: 'Sin alcohol' },
      ],
    },
    {
      key: 'group_size',
      question: '¿Tamaño del grupo?',
      opts: [
        { value: 'casal',   label: 'Pareja'  },
        { value: '3_4',     label: '3 – 4'   },
        { value: '5_8',     label: '5 – 8'   },
        { value: '9_mais',  label: '9 o más' },
      ],
    },
    {
      key: 'how_found',
      question: '¿Cómo nos conoció?',
      opts: [
        { value: 'google',      label: 'Google'        },
        { value: 'instagram',   label: 'Instagram'     },
        { value: 'indicacao',   label: 'Recomendación' },
        { value: 'ja_conhecia', label: 'Ya lo conocía' },
      ],
    },
  ],
}

const UI: Record<Locale, {
  prev: string; next: string; finish: string; saving: string
  done_title: string; done_sub: string; multi_hint: string; title: string
}> = {
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
      <div style={{ margin: '0 auto 1.25rem', color: '#D4A843', opacity: 0.7, width: 48, height: 48 }}>
        {ICONS.indicacao}
      </div>
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
        .quiz-opt { transition: all 0.18s; }
        .quiz-opt:active { transform: scale(0.97); }
        .quiz-opt:hover { border-color: rgba(212,168,67,0.45) !important; background: rgba(212,168,67,0.06) !important; }
        .quiz-opt-icon { transition: color 0.18s, transform 0.18s; }
        .quiz-opt:hover .quiz-opt-icon { transform: scale(1.1); }
      `}</style>

      {/* Título */}
      <p style={{
        fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
        fontSize: '1.1rem', color: '#fff', margin: '0 0 1.25rem',
      }}>{ui.title}</p>

      {/* Barra de progresso */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem' }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i < step ? '#D4A843' : i === step ? 'rgba(212,168,67,0.6)' : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Pergunta + opções */}
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
          }}>{ui.multi_hint}</p>
        )}
        {!cur.multi && <div style={{ marginBottom: '1.25rem' }} />}

        {/* Grid de opções */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {cur.opts.map(opt => {
            const selected = Array.isArray(val) ? val.includes(opt.value) : val === opt.value
            const icon = ICONS[opt.value]
            return (
              <button
                key={opt.value}
                className="quiz-opt"
                onClick={() => toggle(cur.key, opt.value, cur.multi)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '15px 16px', borderRadius: 12,
                  border: `1.5px solid ${selected ? '#D4A843' : 'rgba(255,255,255,0.1)'}`,
                  background: selected ? 'rgba(212,168,67,0.12)' : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  textAlign: 'left',
                }}
              >
                {/* Ícone SVG */}
                {icon && (
                  <span
                    className="quiz-opt-icon"
                    style={{
                      flexShrink: 0,
                      color: selected ? '#D4A843' : 'rgba(255,255,255,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 20, height: 20,
                    }}
                  >
                    {icon}
                  </span>
                )}
                {/* Label */}
                <span style={{
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: '0.7rem', fontWeight: selected ? 700 : 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: selected ? '#D4A843' : 'rgba(255,255,255,0.65)',
                  lineHeight: 1.3, flex: 1,
                }}>
                  {opt.label}
                </span>
                {/* Check */}
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
        >{ui.prev}</button>

        {step < steps.length - 1 ? (
          <button onClick={next} style={{
            fontFamily: "'Josefin Sans',sans-serif",
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#002451',
            background: 'linear-gradient(90deg,#D4A843,#FECE65,#D4A843)',
            backgroundSize: '200% auto',
            animation: 'shimmer 3s linear infinite',
            border: 'none', borderRadius: 10,
            padding: '12px 24px', cursor: 'pointer', minHeight: 46,
          }}>{ui.next}</button>
        ) : (
          <button onClick={submit} disabled={saving} style={{
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
          }}>{saving ? ui.saving : ui.finish}</button>
        )}
      </div>

      {/* Indicador de passo */}
      <p style={{
        fontFamily: "'Josefin Sans',sans-serif",
        fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.2)', textAlign: 'center', margin: '1.25rem 0 0',
      }}>{step + 1} / {steps.length}</p>
    </div>
  )
}
