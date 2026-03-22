/**
 * Porto Cabral BC — Ícones SVG inline para as seções do cardápio (flipbook)
 * ─────────────────────────────────────────────────────────────────────────────
 * Retornam HTML string pois são injetados via innerHTML no canvas do page-flip.
 * Design ultra-profissional: cada ícone desenhado especificamente para a seção,
 * com traços precisos, proporções corretas e identidade náutico-gastronômica.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function getMenuSectionIcon(idx: number, color = '#c9a84c', size = 38): string {
  const s = size
  const c = color

  const icons: string[] = [

    // 0 — Entradas Quentes: chama viva
    // Chama orgânica em dupla camada com base sólida e ponta curvada
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2 C10.5 4.5 8.5 6.5 8.5 9.5 C8.5 11.5 9.5 13 11 13.5
               C10.2 11.5 11.5 9.5 11.5 9.5 C11.5 12.5 10.5 14.5 13 16
               C15.5 17.5 17 15 16 11.5 C15.2 9 16 7 17.5 5.5
               C18 8 18.5 11 18.5 12.5 C18.5 16.5 15.5 21 12 21
               C8.5 21 5.5 17 5.5 13 C5.5 8.5 8.5 4 12 2 Z"
        fill="${c}" fill-opacity="0.15"/>
      <path d="M12 2 C10.5 4.5 8.5 6.5 8.5 9.5 C8.5 11.5 9.5 13 11 13.5
               C10.2 11.5 11.5 9.5 11.5 9.5 C11.5 12.5 10.5 14.5 13 16
               C15.5 17.5 17 15 16 11.5 C15.2 9 16 7 17.5 5.5
               C18 8 18.5 11 18.5 12.5 C18.5 16.5 15.5 21 12 21
               C8.5 21 5.5 17 5.5 13 C5.5 8.5 8.5 4 12 2 Z"/>
      <path d="M12 14 C10.5 15 10 17 11 18.5 C12 20 13.5 20 14.5 19
               C13.5 18.5 13 17.5 13 16.5 C13 15.5 12 14 12 14 Z"
        fill="${c}" fill-opacity="0.4" stroke="none"/>
    </svg>`,

    // 1 — Entradas Frias: cristal de gelo / floco de neve
    // Floco de neve simétrico com 6 eixos e ramificações precisas
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/>
      <line x1="12" y1="2" x2="9.5" y2="5"/>
      <line x1="12" y1="2" x2="14.5" y2="5"/>
      <line x1="12" y1="22" x2="9.5" y2="19"/>
      <line x1="12" y1="22" x2="14.5" y2="19"/>
      <line x1="2" y1="12" x2="5" y2="9.5"/>
      <line x1="2" y1="12" x2="5" y2="14.5"/>
      <line x1="22" y1="12" x2="19" y2="9.5"/>
      <line x1="22" y1="12" x2="19" y2="14.5"/>
      <circle cx="12" cy="12" r="2.5" fill="${c}" fill-opacity="0.2" stroke="${c}"/>
    </svg>`,

    // 2 — Saladas: folha botânica detalhada
    // Folha com nervuras simétricas e pecíolo curvado
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22 C12 22 3.5 17.5 3.5 9.5 C3.5 5.5 7 2 12 2.5 C17 2 20.5 5.5 20.5 9.5
               C20.5 17.5 12 22 12 22 Z" fill="${c}" fill-opacity="0.14"/>
      <path d="M12 22 C12 22 3.5 17.5 3.5 9.5 C3.5 5.5 7 2 12 2.5 C17 2 20.5 5.5 20.5 9.5
               C20.5 17.5 12 22 12 22 Z"/>
      <line x1="12" y1="22" x2="12" y2="4" stroke-width="1.7"/>
      <path d="M12 8 Q9.5 9.2 7.5 11" stroke-opacity="0.55"/>
      <path d="M12 12 Q9 13.5 7 16" stroke-opacity="0.55"/>
      <path d="M12 16 Q9.5 17 8 19.5" stroke-opacity="0.4"/>
      <path d="M12 8 Q14.5 9.2 16.5 11" stroke-opacity="0.55"/>
      <path d="M12 12 Q15 13.5 17 16" stroke-opacity="0.55"/>
      <path d="M12 16 Q14.5 17 16 19.5" stroke-opacity="0.4"/>
    </svg>`,

    // 3 — Iguarias do Mar: lagosta de frente com antenas
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 8 C9 5.5 10 4 12 4 C14 4 15 5.5 15 8 L15 15 C15 17.5 13.8 19 12 19
               C10.2 19 9 17.5 9 15 Z" fill="${c}" fill-opacity="0.12"/>
      <path d="M9 8 C9 5.5 10 4 12 4 C14 4 15 5.5 15 8 L15 15 C15 17.5 13.8 19 12 19
               C10.2 19 9 17.5 9 15 Z"/>
      <path d="M9.5 9.5 C8 8.5 7 8 7 6 C7 4.5 8 4 9 5 L9 8"/>
      <path d="M14.5 9.5 C16 8.5 17 8 17 6 C17 4.5 16 4 15 5 L15 8"/>
      <line x1="10" y1="5" x2="5" y2="1.5"/>
      <line x1="14" y1="5" x2="19" y2="1.5"/>
      <line x1="10.5" y1="4.5" x2="7" y2="2.5"/>
      <line x1="13.5" y1="4.5" x2="17" y2="2.5"/>
      <line x1="9" y1="10" x2="15" y2="10" stroke-opacity="0.4"/>
      <line x1="9" y1="12.5" x2="15" y2="12.5" stroke-opacity="0.4"/>
      <line x1="9" y1="15" x2="15" y2="15" stroke-opacity="0.4"/>
      <path d="M9.5 17.5 L6.5 21"/> <path d="M10.5 18.5 L8 22"/>
      <path d="M12 19.5 L12 22"/>
      <path d="M13.5 18.5 L16 22"/> <path d="M14.5 17.5 L17.5 21"/>
      <circle cx="10" cy="5.5" r="0.9" fill="${c}" stroke="none"/>
      <circle cx="14" cy="5.5" r="0.9" fill="${c}" stroke="none"/>
    </svg>`,

    // 4 — Peixes: peixe de perfil detalhado
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12 C4 8.5 6.5 6.5 10 6.5 L17 6.5 C19.5 6.5 21.5 8.5 21.5 12
               C21.5 15.5 19.5 17.5 17 17.5 L10 17.5 C6.5 17.5 4 15.5 4 12 Z"
        fill="${c}" fill-opacity="0.1"/>
      <path d="M4 12 C4 8.5 6.5 6.5 10 6.5 L17 6.5 C19.5 6.5 21.5 8.5 21.5 12
               C21.5 15.5 19.5 17.5 17 17.5 L10 17.5 C6.5 17.5 4 15.5 4 12 Z"/>
      <path d="M3.5 12 Q2 9 0.5 8 M3.5 12 Q2 15 0.5 16"/>
      <path d="M10 6.5 Q12 3.5 15 6.5"/>
      <path d="M10.5 8 C9.5 9.5 9.5 14.5 10.5 16" stroke-opacity="0.45"/>
      <circle cx="18" cy="10.5" r="1.6"/>
      <circle cx="18" cy="10.5" r="0.5" fill="${c}" stroke="none"/>
    </svg>`,

    // 5 — Camarões: camarão curvado de perfil
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7.5 3.5 C5 5 3.5 7.5 4 10 C4.5 12.5 7 14.5 9 16 C11 17.5 12 19.5 11 21.5"/>
      <path d="M7.5 3.5 C10 2.5 13 4.5 13 7.5 C13 10 11 12.5 9 16" stroke-opacity="0.6"/>
      <line x1="5.5" y1="11.5" x2="8" y2="9" stroke-opacity="0.4"/>
      <line x1="6.5" y1="13" x2="9.5" y2="11" stroke-opacity="0.4"/>
      <line x1="8" y1="14.5" x2="11" y2="13" stroke-opacity="0.4"/>
      <path d="M11 21.5 Q9 23 7.5 22"/>
      <path d="M11 21.5 Q11 23.5 9.5 23.5"/>
      <path d="M11 21.5 Q13 22.5 13 21"/>
      <path d="M8.5 3.5 L14 0.5"/> <path d="M9.5 4 L13 1.5"/>
      <line x1="9" y1="10.5" x2="13" y2="10"/>
      <line x1="8.5" y1="12.5" x2="13" y2="12.5"/>
      <line x1="9" y1="14.5" x2="13" y2="15"/>
      <circle cx="9.5" cy="4" r="1.1"/>
      <circle cx="9.5" cy="4" r="0.4" fill="${c}" stroke="none"/>
    </svg>`,

    // 6 — Trattoria: garfo com 4 dentes e faca
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <line x1="7.5" y1="11" x2="7.5" y2="22"/>
      <path d="M5.5 11 Q7.5 12.5 9.5 11"/>
      <line x1="5.5" y1="2" x2="5.5" y2="10.5"/>
      <line x1="6.5" y1="2" x2="6.5" y2="10.5"/>
      <line x1="8.5" y1="2" x2="8.5" y2="10.5"/>
      <line x1="9.5" y1="2" x2="9.5" y2="10.5"/>
      <line x1="16.5" y1="12" x2="16.5" y2="22"/>
      <line x1="15" y1="12" x2="18" y2="12"/>
      <path d="M16.5 12 L15.5 2"/>
      <path d="M15.5 2 Q16.5 1.2 18 4 L16.5 12" fill="${c}" fill-opacity="0.14"/>
      <path d="M15.5 2 Q16.5 1.2 18 4 L16.5 12"/>
    </svg>`,

    // 7 — Carnes & Aves: chama de brasa / braseiro
    // Uma grelha com chamas embaixo — símbolo de carnes grelhadas
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="13" x2="21" y2="13"/>
      <line x1="3" y1="10.5" x2="21" y2="10.5"/>
      <line x1="3" y1="8" x2="21" y2="8"/>
      <rect x="2" y="13" width="20" height="2.5" rx="1" fill="${c}" fill-opacity="0.15"/>
      <rect x="2" y="13" width="20" height="2.5" rx="1"/>
      <path d="M8 15.5 L5.5 22"/> <path d="M12 15.5 L12 22"/> <path d="M16 15.5 L18.5 22"/>
      <path d="M7 8 C7 6.5 7.5 5 8 4 C8 5.5 9 6.5 9 8"/>
      <path d="M12 8 C12 6 12.5 4.5 13 3 C13 5 14 6.5 14 8"/>
      <path d="M16 8 C16 6.5 16.5 5 17 4 C17 5.5 18 6 18 8"/>
    </svg>`,

    // 8 — Da Horta ao Prato: cenoura / vegetal da terra
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 21 Q8 18.5 7.5 15 Q7 11 9 8.5 C10 7 12 6.5 14 7
               Q16 7.5 16.5 9.5 Q17 12 16 15 Q15 18.5 13 21 Z"
        fill="${c}" fill-opacity="0.14"/>
      <path d="M10 21 Q8 18.5 7.5 15 Q7 11 9 8.5 C10 7 12 6.5 14 7
               Q16 7.5 16.5 9.5 Q17 12 16 15 Q15 18.5 13 21 Z"/>
      <line x1="11.5" y1="21" x2="11.5" y2="9" stroke-opacity="0.4"/>
      <path d="M9 10.5 Q11.5 12 14 10.5" stroke-opacity="0.4"/>
      <path d="M8.5 14 Q11.5 15.5 14.5 14" stroke-opacity="0.4"/>
      <path d="M12 7 L11.5 2.5"/>
      <path d="M12 7 L15 4"/>
      <path d="M12 7 L9 4.5"/>
      <path d="M11.5 2.5 Q10.5 1.5 9.5 2 Q11 2.5 11.5 2.5"/>
    </svg>`,

    // 9 — Sobremesas: cúpula de pudim com calda e prato
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5.5 13.5 Q5.5 6.5 12 6.5 Q18.5 6.5 18.5 13.5 Z"
        fill="${c}" fill-opacity="0.14"/>
      <path d="M5.5 13.5 Q5.5 6.5 12 6.5 Q18.5 6.5 18.5 13.5"/>
      <path d="M12 6.5 Q11.5 4.5 13 3.5 Q11 3 10.5 4.5 Q11.2 5.5 12 6.5"/>
      <path d="M7 13.5 Q6.5 15 7 16 Q7.5 17 7 17.5" stroke-opacity="0.5"/>
      <path d="M17 13.5 Q17.5 15 17 16 Q16.5 17 17 17.5" stroke-opacity="0.5"/>
      <line x1="4" y1="13.5" x2="20" y2="13.5"/>
      <rect x="5.5" y="13.5" width="13" height="3" rx="0.5" fill="${c}" fill-opacity="0.12"/>
      <rect x="5.5" y="13.5" width="13" height="3" rx="0.5"/>
      <path d="M3.5 18 Q3.5 19.5 6 19.5 L18 19.5 Q20.5 19.5 20.5 18"/>
      <ellipse cx="12" cy="18" rx="9" ry="1.8"/>
    </svg>`,

    // 10 — Bebidas: taça com onda interior
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7.5 2.5 L16.5 2.5 L14.5 12 Q14.5 15.5 12 15.5 Q9.5 15.5 9.5 12 Z"
        fill="${c}" fill-opacity="0.12"/>
      <path d="M7.5 2.5 L16.5 2.5 L14.5 12 Q14.5 15.5 12 15.5 Q9.5 15.5 9.5 12 L7.5 2.5"/>
      <path d="M9 8.5 Q10.5 10.5 12 8.5 Q13.5 6.5 15 8.5" stroke-opacity="0.6"/>
      <path d="M9.2 5.5 Q9 4.5 9.5 4" stroke-opacity="0.35" stroke-width="1"/>
      <line x1="12" y1="15.5" x2="12" y2="20.5"/>
      <line x1="8.5" y1="20.5" x2="15.5" y2="20.5"/>
      <path d="M8 22 Q10 23 12 22 Q14 23 16 22" stroke-opacity="0.5"/>
    </svg>`,

    // 11 — Drinks & Caipirinhas: coqueteleira com gotas
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 2 L15 2 L16 5.5 L8 5.5 Z" fill="${c}" fill-opacity="0.2"/>
      <path d="M9 2 L15 2 L16 5.5 L8 5.5 Z"/>
      <path d="M13.5 2 L16.5 0.8"/> <path d="M14.5 2.5 L17 1.5"/>
      <path d="M8 5.5 L9.5 21 Q9.5 23 12 23 Q14.5 23 14.5 21 L16 5.5 Z"
        fill="${c}" fill-opacity="0.1"/>
      <path d="M8 5.5 L9.5 21 Q9.5 23 12 23 Q14.5 23 14.5 21 L16 5.5 Z"/>
      <line x1="8.2" y1="9.5" x2="15.8" y2="9.5"/>
      <circle cx="11" cy="7.5" r="0.45" fill="${c}" stroke="none" fill-opacity="0.55"/>
      <circle cx="12.8" cy="7.2" r="0.45" fill="${c}" stroke="none" fill-opacity="0.55"/>
      <circle cx="10.2" cy="6.8" r="0.45" fill="${c}" stroke="none" fill-opacity="0.55"/>
      <path d="M6.5 12 Q5.8 13.5 6.5 14.5" stroke-width="1.1" stroke-opacity="0.5"/>
      <path d="M17.5 15 Q18.2 16.5 17.5 17.5" stroke-width="1.1" stroke-opacity="0.5"/>
      <circle cx="6" cy="14.8" r="0.6" fill="${c}" stroke="none" fill-opacity="0.35"/>
      <circle cx="18" cy="17.8" r="0.6" fill="${c}" stroke="none" fill-opacity="0.35"/>
    </svg>`,
  ]

  return icons[idx] ?? icons[0]
}
