/**
 * Porto Cabral BC — Biblioteca de Ícones SVG
 * ─────────────────────────────────────────────────────────────────────────────
 * Design system: stroke-based, 24×24 viewport, strokeWidth 1.4 padrão.
 * Todos os ícones foram desenhados com precisão artesanal para a identidade
 * náutico-gastronômica do Porto Cabral BC. Coerência total de estilo.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { SVGProps } from 'react'

type Props = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number, children: React.ReactNode, props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
)

/* ═══════════════════════════════════════════════════════════════════════════
   ÍCONES NÁUTICOS — Identidade e Navegação
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── ÂNCORA — símbolo central do restaurante ──────────────────────────────
   Âncora clássica de marinheiro com argola superior, haste vertical,
   braços curvados e garra. Proporcional e com personalidade.            */
export function IconAncora({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Argola superior */}
    <path d="M10 4.5 C10 3.12 10.9 2 12 2 C13.1 2 14 3.12 14 4.5 C14 5.88 13.1 7 12 7" />
    {/* Haste vertical */}
    <line x1="12" y1="7" x2="12" y2="20" />
    {/* Travessa horizontal */}
    <line x1="8.5" y1="7" x2="15.5" y2="7" />
    {/* Braços curvados da âncora */}
    <path d="M12 20 C8.5 20 6 18.2 5.5 15.5" />
    <path d="M12 20 C15.5 20 18 18.2 18.5 15.5" />
    {/* Garras com pontas arredondadas */}
    <path d="M5.5 15.5 L3.5 17.5" />
    <path d="M5.5 15.5 L5.5 13" />
    <path d="M18.5 15.5 L20.5 17.5" />
    <path d="M18.5 15.5 L18.5 13" />
  </>, p)
}

/* ── RODA DO LEME — navegação, identidade premium ─────────────────────────
   Leme de navio com 8 raios orgânicos, aro duplo e cubo central.       */
export function IconLeme({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Aro externo */}
    <circle cx="12" cy="12" r="9.5" />
    {/* Aro interno / cubo */}
    <circle cx="12" cy="12" r="2.8" />
    {/* 8 raios nos ângulos certos e diagonais */}
    <line x1="12" y1="9.2" x2="12" y2="2.5" />
    <line x1="12" y1="14.8" x2="12" y2="21.5" />
    <line x1="9.2" y1="12" x2="2.5" y2="12" />
    <line x1="14.8" y1="12" x2="21.5" y2="12" />
    <line x1="10.02" y1="10.02" x2="5.47" y2="5.47" />
    <line x1="13.98" y1="13.98" x2="18.53" y2="18.53" />
    <line x1="13.98" y1="10.02" x2="18.53" y2="5.47" />
    <line x1="10.02" y1="13.98" x2="5.47" y2="18.53" />
    {/* Pequenas empunhaduras nos raios */}
    <circle cx="12" cy="2.5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="12" cy="21.5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="2.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="21.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="5.47" cy="5.47" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="18.53" cy="18.53" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="18.53" cy="5.47" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="5.47" cy="18.53" r="0.9" fill="currentColor" stroke="none" />
  </>, p)
}

/* ── BÚSSOLA — localização, orientação ────────────────────────────────────
   Bússola com rosa dos ventos, agulha bicolor e marcações cardeais.    */
export function IconBussola({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Corpo da bússola */}
    <circle cx="12" cy="12" r="9.5" />
    {/* Agulha Norte (sólida) */}
    <path d="M12 5 L13.4 11.4 L12 12.6 L10.6 11.4 Z" fill="currentColor" fillOpacity="0.9" stroke="none" />
    {/* Agulha Sul (vazada/outline) */}
    <path d="M12 19 L13.4 12.6 L12 11.4 L10.6 12.6 Z" fill="currentColor" fillOpacity="0.2" />
    {/* Ponto central */}
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    {/* Marcações N/S/L/O */}
    <line x1="12" y1="2.5" x2="12" y2="3.8" strokeWidth="1.8" />
    <line x1="12" y1="20.2" x2="12" y2="21.5" strokeWidth="1.8" />
    <line x1="2.5" y1="12" x2="3.8" y2="12" strokeWidth="1.8" />
    <line x1="20.2" y1="12" x2="21.5" y2="12" strokeWidth="1.8" />
  </>, p)
}

/* ── VELA DE NAVIO — hero, identidade do restaurante ──────────────────────
   Veleiro estilizado de topo, com mastro central, duas velas
   triangulares e casco. Remete ao logotipo náutico.                    */
export function IconVela({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Mastro principal */}
    <line x1="12" y1="2" x2="12" y2="19" />
    {/* Vela maior (esquerda do mastro) — triângulo com barriga */}
    <path d="M12 3.5 C11 6 8 9.5 6 14 L12 14 Z" fill="currentColor" fillOpacity="0.18" />
    <path d="M12 3.5 C11 6 8 9.5 6 14 L12 14 Z" />
    {/* Vela menor (direita do mastro) */}
    <path d="M12 7 C13 9.5 16 12 17 15 L12 15 Z" fill="currentColor" fillOpacity="0.12" />
    <path d="M12 7 C13 9.5 16 12 17 15 L12 15 Z" />
    {/* Casco */}
    <path d="M5 19 Q7 21.5 12 21.5 Q17 21.5 19 19" />
    {/* Linha d'água */}
    <line x1="4" y1="19" x2="20" y2="19" />
  </>, p)
}

/* ── TRIDENTE — alta gastronomia, iguarias do mar ─────────────────────────
   Tridente clássico com três dentes, cruzeta e cabo longo.
   Símbolo de Posêidon e dos frutos do mar.                             */
export function IconTridente({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Cabo principal */}
    <line x1="12" y1="9.5" x2="12" y2="22" />
    {/* Cruzeta horizontal */}
    <line x1="8" y1="9.5" x2="16" y2="9.5" />
    {/* Dente central */}
    <path d="M12 2 L12 9.5" />
    <path d="M10.8 5 L12 2 L13.2 5" />
    {/* Dente esquerdo */}
    <path d="M8 3 L8 9.5" />
    <path d="M6.8 5.8 L8 3 L9.2 5.8" />
    {/* Dente direito */}
    <path d="M16 3 L16 9.5" />
    <path d="M14.8 5.8 L16 3 L17.2 5.8" />
  </>, p)
}

/* ── CARTA NÁUTICA — localização, mapa do restaurante ─────────────────────
   Pergaminho aberto com costuras nas bordas, rotas tracejadas e
   uma marcação de destino — como uma carta náutica clássica.           */
export function IconCarta({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Corpo do pergaminho */}
    <path d="M3 5.5 L8.5 3.5 L15.5 5.5 L21 3.5 L21 18.5 L15.5 20.5 L8.5 18.5 L3 20.5 Z"
      fill="currentColor" fillOpacity="0.08" />
    <path d="M3 5.5 L8.5 3.5 L15.5 5.5 L21 3.5 L21 18.5 L15.5 20.5 L8.5 18.5 L3 20.5 Z" />
    {/* Dobras divisórias */}
    <line x1="8.5" y1="3.5" x2="8.5" y2="18.5" strokeDasharray="1.5 1.5" strokeOpacity="0.5" />
    <line x1="15.5" y1="5.5" x2="15.5" y2="20.5" strokeDasharray="1.5 1.5" strokeOpacity="0.5" />
    {/* Rota tracejada */}
    <path d="M5 14 Q7 11 10 12 Q13 13 14 10" strokeDasharray="2 1.5" />
    {/* Marcação de destino (estrela-âncora) */}
    <circle cx="14" cy="10" r="1.5" />
    <line x1="14" y1="8" x2="14" y2="8.5" />
    <line x1="14" y1="11.5" x2="14" y2="12" />
  </>, p)
}

/* ── ONDA — experiência sobre o mar, scroll indicator ─────────────────────
   Duas ondas sobrepostas com ritmo e amplitude naturais do oceano.     */
export function IconOnda({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Onda superior */}
    <path d="M2 8.5 C4.5 5.5 7.5 5.5 10 8.5 C12.5 11.5 15.5 11.5 18 8.5 C19.5 6.8 20.5 6 22 6.5" />
    {/* Onda inferior */}
    <path d="M2 14.5 C4.5 11.5 7.5 11.5 10 14.5 C12.5 17.5 15.5 17.5 18 14.5 C19.5 12.8 20.5 12 22 12.5" />
  </>, p)
}

/* ── HORIZONTE / PÔR DO SOL — melhor sunset, experiência ─────────────────
   Sol nascendo sobre a linha do horizonte com raios e reflexo na água. */
export function IconHorizonte({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Reflexo ondulado do sol na água */}
    <path d="M2 20.5 Q5 19 8 20.5 Q11 22 14 20.5 Q17 19 20 20.5 Q21 21 22 20.5"
      strokeOpacity="0.45" />
    {/* Linha do horizonte principal */}
    <line x1="2" y1="18" x2="22" y2="18" />
    {/* Semicírculo do sol emergindo */}
    <path d="M7 18 Q7 12.5 12 12.5 Q17 12.5 17 18" fill="currentColor" fillOpacity="0.15" />
    <path d="M7 18 Q7 12.5 12 12.5 Q17 12.5 17 18" />
    {/* Raios solares */}
    <line x1="12" y1="11.5" x2="12" y2="9" />
    <line x1="17.8" y1="13.2" x2="19.8" y2="11.6" />
    <line x1="6.2" y1="13.2" x2="4.2" y2="11.6" />
    <line x1="15.8" y1="11.5" x2="17" y2="9.5" />
    <line x1="8.2" y1="11.5" x2="7" y2="9.5" />
  </>, p)
}

/* ── SINO DO NAVIO — horários, seção de schedule ─────────────────────────
   Sino de navio com cúpula perfeita, detalhes do badalo e aro de topo. */
export function IconSino({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Gancho de suspensão */}
    <path d="M10.5 2.5 C10.5 1.7 11.1 1 12 1 C12.9 1 13.5 1.7 13.5 2.5" />
    {/* Cúpula do sino */}
    <path d="M7 14.5 C7 9.5 8.8 6.5 12 5.5 C15.2 6.5 17 9.5 17 14.5 Z"
      fill="currentColor" fillOpacity="0.12" />
    <path d="M7 14.5 C7 9.5 8.8 6.5 12 5.5 C15.2 6.5 17 9.5 17 14.5 Z" />
    {/* Aro base do sino */}
    <path d="M5 14.5 L19 14.5" />
    <path d="M5.5 14.5 C5.5 14.5 6 16 7 16 L17 16 C18 16 18.5 14.5 18.5 14.5" />
    {/* Badalo */}
    <line x1="12" y1="16" x2="12" y2="18.5" />
    <circle cx="12" cy="19.2" r="1.2" fill="currentColor" />
    {/* Linha de apoio no topo */}
    <line x1="10.5" y1="2.5" x2="13.5" y2="2.5" />
  </>, p)
}

/* ── LUNETA / SPYGLASS — área do cliente, explorar ────────────────────────
   Luneta de marinheiro com lentes aninhadas, extensões e olheira.      */
export function IconLuneta({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Lente objetiva (grande, à esquerda) */}
    <circle cx="8.5" cy="11" r="5.5" />
    {/* Lente interna */}
    <circle cx="8.5" cy="11" r="2.5" fill="currentColor" fillOpacity="0.1" />
    {/* Corpo extensível (segmentos) */}
    <line x1="14" y1="9.5" x2="18" y2="8.2" strokeWidth="2.8" strokeLinecap="butt" />
    <line x1="14" y1="12.5" x2="18" y2="13.8" strokeWidth="2.8" strokeLinecap="butt" />
    <line x1="18" y1="8.2" x2="21.5" y2="7.2" strokeWidth="2" strokeLinecap="round" />
    <line x1="18" y1="13.8" x2="21.5" y2="14.8" strokeWidth="2" strokeLinecap="round" />
    {/* Cruzeta da lente */}
    <line x1="5.5" y1="11" x2="11.5" y2="11" strokeOpacity="0.3" />
    <line x1="8.5" y1="8" x2="8.5" y2="14" strokeOpacity="0.3" />
  </>, p)
}

/* ═══════════════════════════════════════════════════════════════════════════
   ÍCONES GASTRONÔMICOS — Cardápio e Frutos do Mar
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── LAGOSTA — iguarias do mar, crustáceo premium ─────────────────────────
   Lagosta vista de frente: carapaça, antenas longas, pinças e
   pleópodos articulados.                                                */
export function IconLagosta({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Carapaça central */}
    <path d="M9 8 C9 5.5 10 4 12 4 C14 4 15 5.5 15 8 L15 15 C15 17.5 13.8 19 12 19 C10.2 19 9 17.5 9 15 Z"
      fill="currentColor" fillOpacity="0.1" />
    <path d="M9 8 C9 5.5 10 4 12 4 C14 4 15 5.5 15 8 L15 15 C15 17.5 13.8 19 12 19 C10.2 19 9 17.5 9 15 Z" />
    {/* Cabeça / cefalotórax */}
    <path d="M9.5 9.5 C8 8.5 7 8 7 6 C7 4.5 8 4 9 5 L9 8" />
    <path d="M14.5 9.5 C16 8.5 17 8 17 6 C17 4.5 16 4 15 5 L15 8" />
    {/* Antenas longas */}
    <path d="M10 5 L5 1.5" />
    <path d="M14 5 L19 1.5" />
    {/* Antenas menores */}
    <path d="M10.5 4.5 L7 2.5" />
    <path d="M13.5 4.5 L17 2.5" />
    {/* Segmentos do abdome */}
    <line x1="9" y1="10" x2="15" y2="10" strokeOpacity="0.4" />
    <line x1="9" y1="12" x2="15" y2="12" strokeOpacity="0.4" />
    <line x1="9" y1="14" x2="15" y2="14" strokeOpacity="0.4" />
    {/* Pleópodos (pernas natatórias) */}
    <path d="M9.5 17 L6.5 20" />
    <path d="M10.5 18.5 L8 22" />
    <path d="M12 19.5 L12 22" />
    <path d="M13.5 18.5 L16 22" />
    <path d="M14.5 17 L17.5 20" />
    {/* Olhos */}
    <circle cx="10" cy="5.5" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="14" cy="5.5" r="0.8" fill="currentColor" stroke="none" />
  </>, p)
}

/* ── PEIXE — seção de peixes ──────────────────────────────────────────────
   Peixe de perfil visto da esquerda: corpo fusiforme, barbatanas
   dorsal, caudal e peitoral, guelras e olho.                           */
export function IconPeixe({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Corpo principal fusiforme */}
    <path d="M4 12 C4 8.5 6.5 6.5 10 6.5 L17 6.5 C19.5 6.5 21.5 8.5 21.5 12
             C21.5 15.5 19.5 17.5 17 17.5 L10 17.5 C6.5 17.5 4 15.5 4 12 Z"
      fill="currentColor" fillOpacity="0.1" />
    <path d="M4 12 C4 8.5 6.5 6.5 10 6.5 L17 6.5 C19.5 6.5 21.5 8.5 21.5 12
             C21.5 15.5 19.5 17.5 17 17.5 L10 17.5 C6.5 17.5 4 15.5 4 12 Z" />
    {/* Barbatana caudal (em V) */}
    <path d="M3 12 L0.5 8 M3 12 L0.5 16" />
    <path d="M3 12 Q2 10 0.5 8" />
    <path d="M3 12 Q2 14 0.5 16" />
    {/* Barbatana dorsal */}
    <path d="M10 6.5 Q12 3.5 15 6.5" />
    {/* Barbatana peitoral */}
    <path d="M12 13 Q10 16 10 17.5" strokeOpacity="0.6" />
    {/* Guelras */}
    <path d="M10.5 8 C9.5 9.5 9.5 14.5 10.5 16" strokeOpacity="0.5" />
    {/* Olho */}
    <circle cx="17.5" cy="11" r="1.5" />
    <circle cx="17.5" cy="11" r="0.5" fill="currentColor" stroke="none" />
    {/* Boca */}
    <path d="M21 11 Q21.5 12 21 13" />
  </>, p)
}

/* ── CAMARÃO — seção de camarões ──────────────────────────────────────────
   Camarão visto de perfil: corpo curvado em C, carapaça segmentada,
   cauda em leque, antenas e pernas.                                     */
export function IconCamarao({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Corpo curvado (arco principal) */}
    <path d="M7.5 3.5 C5 5 3.5 7.5 4 10 C4.5 12.5 7 14.5 9 16 C11 17.5 12 19.5 11 21.5"
      fill="none" />
    <path d="M7.5 3.5 C5 5 3.5 7.5 4 10 C4.5 12.5 7 14.5 9 16 C11 17.5 12 19.5 11 21.5" />
    {/* Carapaça (borda dorsal) */}
    <path d="M7.5 3.5 C10 2.5 13 4.5 13 7.5 C13 10 11 12.5 9 16"
      strokeOpacity="0.55" />
    {/* Segmentos abdominais */}
    <line x1="5.5" y1="11.5" x2="8" y2="9" strokeOpacity="0.4" />
    <line x1="6.5" y1="13" x2="9.5" y2="11" strokeOpacity="0.4" />
    <line x1="8" y1="14.5" x2="11" y2="13" strokeOpacity="0.4" />
    {/* Cauda em leque */}
    <path d="M11 21.5 Q9 23 7.5 22" />
    <path d="M11 21.5 Q11 23.5 9.5 23.5" />
    <path d="M11 21.5 Q13 22.5 13 21" />
    {/* Antenas longas */}
    <path d="M8.5 3.5 L14 0.5" />
    <path d="M9.5 4 L13 1.5" />
    {/* Pernas (pleopodos) */}
    <line x1="9" y1="10.5" x2="13" y2="10" />
    <line x1="8.5" y1="12.5" x2="13" y2="12.5" />
    <line x1="9" y1="14.5" x2="13" y2="15" />
    {/* Olho */}
    <circle cx="9.5" cy="4" r="1.1" />
    <circle cx="9.5" cy="4" r="0.4" fill="currentColor" stroke="none" />
  </>, p)
}

/* ── OSTRA — entradas, ostras frescas ─────────────────────────────────────
   Ostra aberta vista de frente: concha rugosa com pregas, interior
   nacarado e pérola visível.                                            */
export function IconOstra({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Concha inferior (maior) */}
    <path d="M3 13 Q3.5 8.5 12 7.5 Q20.5 8.5 21 13 Q20.5 19.5 12 20.5 Q3.5 19.5 3 13 Z"
      fill="currentColor" fillOpacity="0.1" />
    <path d="M3 13 Q3.5 8.5 12 7.5 Q20.5 8.5 21 13 Q20.5 19.5 12 20.5 Q3.5 19.5 3 13 Z" />
    {/* Pregas radiais da concha */}
    <path d="M5 17 Q8 12 12 11.5 Q16 12 19 17" strokeOpacity="0.35" />
    <path d="M4.5 15 Q8 11 12 10.5 Q16 11 19.5 15" strokeOpacity="0.25" />
    <path d="M6 11 Q9 9.5 12 9.5 Q15 9.5 18 11" strokeOpacity="0.2" />
    {/* Tampa / concha superior (apenas borda) */}
    <path d="M4 13 Q5 9 12 8 Q19 9 20 13" strokeOpacity="0.6" />
    {/* Interior nacarado */}
    <ellipse cx="12" cy="15" rx="6" ry="3.5" fill="currentColor" fillOpacity="0.08"
      stroke="currentColor" strokeOpacity="0.3" />
    {/* Pérola */}
    <circle cx="12" cy="15.5" r="2" fill="currentColor" fillOpacity="0.25" />
    <circle cx="12" cy="15.5" r="2" />
    <circle cx="11.3" cy="15" r="0.5" fill="currentColor" strokeOpacity="0" fillOpacity="0.4" />
  </>, p)
}

/* ── POLVO — iguarias do mar, especialidade ───────────────────────────────
   Polvo visto de frente: manto ovalado, 8 tentáculos curvados com
   ventosas alternadas.                                                  */
export function IconPolvo({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Manto (cabeça) */}
    <ellipse cx="12" cy="8" rx="5.5" ry="5" fill="currentColor" fillOpacity="0.1" />
    <ellipse cx="12" cy="8" rx="5.5" ry="5" />
    {/* Olhos */}
    <circle cx="9.5" cy="7" r="1.2" fill="currentColor" fillOpacity="0.2" />
    <circle cx="9.5" cy="7" r="1.2" />
    <circle cx="14.5" cy="7" r="1.2" fill="currentColor" fillOpacity="0.2" />
    <circle cx="14.5" cy="7" r="1.2" />
    {/* Boca */}
    <path d="M10.5 9.5 Q12 10.8 13.5 9.5" />
    {/* 8 tentáculos curvados */}
    <path d="M7.5 12.5 C6 14 5.5 16.5 6 19 C6.5 21 6 22 5.5 22.5" />
    <path d="M9 13 C8 15 8 17.5 8.5 20 C9 22 8.5 23 8 23" />
    <path d="M10.5 13.5 C10 16 10 18.5 10.5 21 C11 23 10.5 23.5 10 23.5" />
    <path d="M12 13.5 C12 16 12 19 12 21.5 C12 23 12 23.5 12 23.5" />
    <path d="M13.5 13.5 C14 16 14 18.5 13.5 21 C13 23 13.5 23.5 14 23.5" />
    <path d="M15 13 C16 15 16 17.5 15.5 20 C15 22 15.5 23 16 23" />
    <path d="M16.5 12.5 C18 14 18.5 16.5 18 19 C17.5 21 18 22 18.5 22.5" />
    {/* Ventosas nos tentáculos principais */}
    <circle cx="8.5" cy="15.5" r="0.6" fill="currentColor" stroke="none" fillOpacity="0.5" />
    <circle cx="8" cy="18" r="0.6" fill="currentColor" stroke="none" fillOpacity="0.5" />
    <circle cx="16" cy="15.5" r="0.6" fill="currentColor" stroke="none" fillOpacity="0.5" />
    <circle cx="16.5" cy="18" r="0.6" fill="currentColor" stroke="none" fillOpacity="0.5" />
  </>, p)
}

/* ── TALHERES — trattoria, carnes, restaurante ────────────────────────────
   Garfo clássico com 4 dentes à esquerda e faca com lâmina e cabo
   à direita — o símbolo universal de restaurante refinado.             */
export function IconTalheres({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* ─── GARFO (esquerda) ─── */}
    {/* Cabo do garfo */}
    <line x1="7.5" y1="11" x2="7.5" y2="22" />
    {/* Junção garfo */}
    <path d="M5.5 11 Q7.5 12.5 9.5 11" />
    {/* Dentes (4) */}
    <line x1="5.5" y1="2" x2="5.5" y2="10.5" />
    <line x1="6.5" y1="2" x2="6.5" y2="10.5" />
    <line x1="8.5" y1="2" x2="8.5" y2="10.5" />
    <line x1="9.5" y1="2" x2="9.5" y2="10.5" />
    {/* Arredondamentos no topo dos dentes */}
    <path d="M5.5 2 Q5.5 1.2 6 1.2" />
    <path d="M9.5 2 Q9.5 1.2 9 1.2" />

    {/* ─── FACA (direita) ─── */}
    {/* Cabo da faca */}
    <line x1="16.5" y1="12" x2="16.5" y2="22" />
    {/* Separador cabo/lâmina */}
    <line x1="15" y1="12" x2="18" y2="12" />
    {/* Lâmina com curvatura no topo */}
    <path d="M16.5 12 L15.5 2" />
    <path d="M15.5 2 Q16.5 1.2 18 4 L16.5 12" fill="currentColor" fillOpacity="0.12" />
    <path d="M15.5 2 Q16.5 1.2 18 4 L16.5 12" />
  </>, p)
}

/* ── FOLHA — da horta ao prato, opções veganas ────────────────────────────
   Folha botânica com nervura central marcante, nervuras secundárias
   e pecíolo. Forma orgânica e leve.                                     */
export function IconFolha({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Limbo foliar (contorno) */}
    <path d="M12 21 C12 21 3.5 17 3.5 9 C3.5 5 7 2 12 2.5 C17 2 20.5 5 20.5 9
             C20.5 17 12 21 12 21 Z"
      fill="currentColor" fillOpacity="0.12" />
    <path d="M12 21 C12 21 3.5 17 3.5 9 C3.5 5 7 2 12 2.5 C17 2 20.5 5 20.5 9
             C20.5 17 12 21 12 21 Z" />
    {/* Nervura central (pecíolo + costela) */}
    <line x1="12" y1="21" x2="12" y2="4" strokeWidth="1.6" />
    {/* Nervuras secundárias esquerdas */}
    <path d="M12 8 Q9.5 9 7.5 10.5" strokeOpacity="0.5" />
    <path d="M12 11.5 Q9 13 7 15" strokeOpacity="0.5" />
    <path d="M12 15 Q9.5 16 8 18" strokeOpacity="0.4" />
    {/* Nervuras secundárias direitas */}
    <path d="M12 8 Q14.5 9 16.5 10.5" strokeOpacity="0.5" />
    <path d="M12 11.5 Q15 13 17 15" strokeOpacity="0.5" />
    <path d="M12 15 Q14.5 16 16 18" strokeOpacity="0.4" />
  </>, p)
}

/* ── TAÇA DE VINHO — vinhos e bebidas alcóolicas ──────────────────────────
   Taça de vinho elegante: cálice bojudo com bojo, haste fina e pé.    */
export function IconTaca({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Bojo da taça */}
    <path d="M7.5 2.5 L16.5 2.5 L14.5 12 Q14.5 15.5 12 15.5 Q9.5 15.5 9.5 12 Z"
      fill="currentColor" fillOpacity="0.12" />
    <path d="M7.5 2.5 L16.5 2.5 L14.5 12 Q14.5 15.5 12 15.5 Q9.5 15.5 9.5 12 L7.5 2.5" />
    {/* Linha de vinho */}
    <path d="M8.5 7 Q12 8.5 15.5 7" strokeOpacity="0.4" strokeDasharray="1.5 1" />
    {/* Reflexo no bojo */}
    <path d="M9 5 Q9.5 7 9 9" strokeOpacity="0.25" strokeWidth="1" />
    {/* Haste */}
    <line x1="12" y1="15.5" x2="12" y2="20.5" />
    {/* Pé */}
    <path d="M8.5 20.5 Q10 22 12 22 Q14 22 15.5 20.5" />
    <line x1="8" y1="20.5" x2="16" y2="20.5" />
  </>, p)
}

/* ── COQUETELEIRA — drinks e caipirinhas ──────────────────────────────────
   Coqueteleira de bar com topo cônico, corpo, linha divisória e
   pingos de condensação externos.                                       */
export function IconCoqueteleira({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Topo cônico */}
    <path d="M9 2 L15 2 L16 5.5 L8 5.5 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M9 2 L15 2 L16 5.5 L8 5.5 Z" />
    {/* Tampa arredondada */}
    <path d="M12 2 L14 0.5" />
    <path d="M13.5 2 L16 0.8" />
    {/* Corpo principal */}
    <path d="M8 5.5 L9.5 21 Q9.5 23 12 23 Q14.5 23 14.5 21 L16 5.5 Z"
      fill="currentColor" fillOpacity="0.1" />
    <path d="M8 5.5 L9.5 21 Q9.5 23 12 23 Q14.5 23 14.5 21 L16 5.5 Z" />
    {/* Linha divisória strainer */}
    <line x1="8.2" y1="9.5" x2="15.8" y2="9.5" />
    {/* Furos do strainer */}
    <circle cx="11" cy="7.5" r="0.4" fill="currentColor" stroke="none" fillOpacity="0.5" />
    <circle cx="12.8" cy="7.2" r="0.4" fill="currentColor" stroke="none" fillOpacity="0.5" />
    <circle cx="10.2" cy="6.8" r="0.4" fill="currentColor" stroke="none" fillOpacity="0.5" />
    {/* Gotas de condensação */}
    <path d="M6.5 12 Q5.8 13.5 6.5 14.5" strokeWidth="1" strokeOpacity="0.45" />
    <path d="M17.5 15 Q18.2 16.5 17.5 17.5" strokeWidth="1" strokeOpacity="0.45" />
  </>, p)
}

/* ── SOBREMESA / PUDIM — seção de sobremesas ──────────────────────────────
   Cúpula de pudim estilizada com calda escorrendo, montada em prato.  */
export function IconSobremesa({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Cúpula do pudim */}
    <path d="M5.5 13.5 Q5.5 6.5 12 6.5 Q18.5 6.5 18.5 13.5 Z"
      fill="currentColor" fillOpacity="0.12" />
    <path d="M5.5 13.5 Q5.5 6.5 12 6.5 Q18.5 6.5 18.5 13.5" />
    {/* Furo/buraco central do pudim */}
    <path d="M12 6.5 Q11.5 4.5 13 3.5 Q11 3 10.5 4.5 Q11.2 5.5 12 6.5" />
    {/* Calda escorrendo pelos lados */}
    <path d="M7 13.5 Q6.5 15 7 16 Q7.5 17 7 17.5" strokeOpacity="0.5" strokeWidth="1" />
    <path d="M17 13.5 Q17.5 15 17 16 Q16.5 17 17 17.5" strokeOpacity="0.5" strokeWidth="1" />
    {/* Base plana */}
    <line x1="4" y1="13.5" x2="20" y2="13.5" />
    {/* Prato */}
    <path d="M3 15.5 Q3 17 5.5 17.5 L18.5 17.5 Q21 17 21 15.5" />
    <ellipse cx="12" cy="17.5" rx="9" ry="1.8" />
  </>, p)
}

/* ── SALADA / TIGELA — saladas frescas ────────────────────────────────────
   Tigela de salada com folhas e vegetais emergindo acima da borda.    */
export function IconSalada({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Tigela */}
    <path d="M3.5 13 Q4 20 12 20 Q20 20 20.5 13 Z"
      fill="currentColor" fillOpacity="0.1" />
    <path d="M3.5 13 Q4 20 12 20 Q20 20 20.5 13" />
    {/* Borda da tigela */}
    <line x1="2" y1="13" x2="22" y2="13" />
    {/* Folha central grande */}
    <path d="M12 13 C12 11 11 9 12 7 C13 9 12 11 12 13" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 13 C12 11 11 9 12 7 C13 9 12 11 12 13" />
    {/* Folha esquerda */}
    <path d="M9 13 C9 11 7.5 9.5 7.5 8 C8.5 8.5 10.5 10.5 9 13" fill="currentColor" fillOpacity="0.15" />
    <path d="M9 13 C9 11 7.5 9.5 7.5 8 C8.5 8.5 10.5 10.5 9 13" />
    {/* Folha direita */}
    <path d="M15 13 C15 11 16.5 9.5 16.5 8 C15.5 8.5 13.5 10.5 15 13" fill="currentColor" fillOpacity="0.15" />
    <path d="M15 13 C15 11 16.5 9.5 16.5 8 C15.5 8.5 13.5 10.5 15 13" />
    {/* Tomate (círculo pequeno) */}
    <circle cx="8.5" cy="12" r="1.5" fill="currentColor" fillOpacity="0.3" />
    {/* Pepino (elipse) */}
    <ellipse cx="15.5" cy="12" rx="1.5" ry="1" fill="currentColor" fillOpacity="0.25" />
  </>, p)
}

/* ── ESTRELA DO MAR — reserva concluída, sucesso premium ─────────────────
   Estrela do mar com 5 braços orgânicos e textura pontuada no centro. */
export function IconEstrelaMar({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Estrela do mar — 5 braços orgânicos e arredondados */}
    <path d="M12 2
             C12.5 4 14 5.5 15.5 6 L20.5 7.5
             C19 8.5 18.5 10 18.5 12 L20.5 16.5
             C18 16 16 17 14.5 18.5 L12 22
             L9.5 18.5 C8 17 6 16 3.5 16.5 L5.5 12
             C5.5 10 5 8.5 3.5 7.5 L8.5 6
             C10 5.5 11.5 4 12 2 Z"
      fill="currentColor" fillOpacity="0.12" />
    <path d="M12 2
             C12.5 4 14 5.5 15.5 6 L20.5 7.5
             C19 8.5 18.5 10 18.5 12 L20.5 16.5
             C18 16 16 17 14.5 18.5 L12 22
             L9.5 18.5 C8 17 6 16 3.5 16.5 L5.5 12
             C5.5 10 5 8.5 3.5 7.5 L8.5 6
             C10 5.5 11.5 4 12 2 Z" />
    {/* Pontos/texturas */}
    <circle cx="12" cy="12" r="1.8" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="10.5" cy="11" r="0.5" fill="currentColor" stroke="none" fillOpacity="0.4" />
    <circle cx="13.5" cy="13" r="0.5" fill="currentColor" stroke="none" fillOpacity="0.4" />
  </>, p)
}

/* ═══════════════════════════════════════════════════════════════════════════
   ÍCONES DE INTERFACE — Área do Cliente e Sistema
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── TRIPULANTE / USUÁRIO — perfil do cliente ─────────────────────────────
   Silhueta de marinheiro estilizada: rosto oval com quepe/boné de
   capitão. Remete ao "capitão a bordo" — cliente VIP do Porto Cabral.  */
export function IconTripulante({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Silhueta do busto */}
    <path d="M4 22 C4 16.5 7.5 13.5 12 13.5 C16.5 13.5 20 16.5 20 22" />
    {/* Cabeça */}
    <circle cx="12" cy="9" r="4.5" />
    {/* Quepe de capitão (borda + topo) */}
    <rect x="8.5" y="4.5" width="7" height="1.5" rx="0.5"
      fill="currentColor" fillOpacity="0.3" />
    <path d="M8.5 6 L15.5 6" />
    <path d="M9.5 4.5 Q12 3.2 14.5 4.5" />
    {/* Emblema do quepe */}
    <circle cx="12" cy="5.5" r="0.6" fill="currentColor" stroke="none" fillOpacity="0.6" />
  </>, p)
}

/* ── LOGBOOK / CADERNETA — minhas reservas ────────────────────────────────
   Diário de bordo com capa dura, lombada com argolas, linhas de texto
   e marcador de página — o "logbook" do capitão.                       */
export function IconLogbook({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Lombada (esquerda) */}
    <rect x="3.5" y="2" width="3" height="20" rx="0.8"
      fill="currentColor" fillOpacity="0.15" />
    <line x1="3.5" y1="2" x2="3.5" y2="22" />
    <line x1="6.5" y1="2" x2="6.5" y2="22" />
    {/* Argolas da lombada */}
    <line x1="3.5" y1="6" x2="6.5" y2="6" strokeWidth="2" />
    <line x1="3.5" y1="12" x2="6.5" y2="12" strokeWidth="2" />
    <line x1="3.5" y1="18" x2="6.5" y2="18" strokeWidth="2" />
    {/* Capa/miolo do livro */}
    <rect x="6.5" y="2" width="14" height="20" rx="1"
      fill="currentColor" fillOpacity="0.07" />
    <rect x="6.5" y="2" width="14" height="20" rx="1" />
    {/* Linhas de texto */}
    <line x1="10" y1="7.5" x2="18" y2="7.5" />
    <line x1="10" y1="11" x2="18" y2="11" />
    <line x1="10" y1="14.5" x2="15" y2="14.5" />
    <line x1="10" y1="18" x2="16.5" y2="18" />
    {/* Marcador de página */}
    <path d="M17.5 2 L17.5 6.5 L19 5 L20.5 6.5 L20.5 2" fill="currentColor" fillOpacity="0.25" />
  </>, p)
}

/* ── CONFIRMADO / CHECK — reserva confirmada ──────────────────────────────
   Círculo com visto estilizado em âncora: o traço do check forma a
   haste e o arco inferior de uma micro-âncora.                         */
export function IconConfirmado({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Círculo exterior */}
    <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity="0.08" />
    <circle cx="12" cy="12" r="9.5" />
    {/* Check mark expressivo */}
    <polyline points="6.5,12 10,15.5 17.5,8.5" strokeWidth="2" />
  </>, p)
}

/* ── CANCELADO / X — reserva cancelada ───────────────────────────────────
   Círculo com X formado por dois traços diagonais expressivos.         */
export function IconCancelado({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Círculo exterior */}
    <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity="0.07" />
    <circle cx="12" cy="12" r="9.5" />
    {/* X diagonal */}
    <line x1="8" y1="8" x2="16" y2="16" strokeWidth="1.8" />
    <line x1="16" y1="8" x2="8" y2="16" strokeWidth="1.8" />
  </>, p)
}

/* ── PENDENTE / AMPULHETA — reserva aguardando confirmação ────────────────
   Ampulheta náutica com estrutura de madeira, areias e fluxo central.  */
export function IconPendente({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Barra superior e inferior */}
    <line x1="5.5" y1="2" x2="18.5" y2="2" strokeWidth="1.8" />
    <line x1="5.5" y1="22" x2="18.5" y2="22" strokeWidth="1.8" />
    {/* Suportes laterais */}
    <line x1="6.5" y1="2" x2="6.5" y2="22" strokeOpacity="0.4" />
    <line x1="17.5" y1="2" x2="17.5" y2="22" strokeOpacity="0.4" />
    {/* Ampulheta (parte superior) */}
    <path d="M6.5 2.5 Q6.5 10 12 12 Q17.5 10 17.5 2.5" fill="currentColor" fillOpacity="0.1" />
    <path d="M6.5 2.5 Q6.5 10 12 12 Q17.5 10 17.5 2.5" />
    {/* Ampulheta (parte inferior — vazia, quase) */}
    <path d="M6.5 21.5 Q6.5 16 12 14 Q13 13.5 12 12" fill="currentColor" fillOpacity="0.06" />
    <path d="M6.5 21.5 Q6.5 16 12 14" />
    <path d="M17.5 21.5 Q17.5 16 12 14" />
    {/* Fio de areia caindo */}
    <line x1="12" y1="12" x2="12" y2="16" strokeWidth="0.9" strokeOpacity="0.55" />
    {/* Areia acumulada na base */}
    <path d="M9 20 Q12 18 15 20" fill="currentColor" fillOpacity="0.2" stroke="none" />
  </>, p)
}

/* ── PREFERÊNCIAS / SLIDER — preferências do cliente ─────────────────────
   Três sliders de equalização — remete a "ajustar suas preferências".  */
export function IconPreferencias({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Trilhas dos sliders */}
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
    {/* Indicadores (knobs) nos sliders */}
    <circle cx="8" cy="6" r="2.5" fill="currentColor" fillOpacity="0.15" />
    <circle cx="8" cy="6" r="2.5" />
    <circle cx="15.5" cy="12" r="2.5" fill="currentColor" fillOpacity="0.15" />
    <circle cx="15.5" cy="12" r="2.5" />
    <circle cx="10" cy="18" r="2.5" fill="currentColor" fillOpacity="0.15" />
    <circle cx="10" cy="18" r="2.5" />
    {/* Marcadores internos dos knobs */}
    <line x1="6.5" y1="6" x2="9.5" y2="6" strokeOpacity="0.4" strokeWidth="0.9" />
    <line x1="14" y1="12" x2="17" y2="12" strokeOpacity="0.4" strokeWidth="0.9" />
    <line x1="8.5" y1="18" x2="11.5" y2="18" strokeOpacity="0.4" strokeWidth="0.9" />
  </>, p)
}

/* ═══════════════════════════════════════════════════════════════════════════
   ÍCONES DO FOOTER — Localização e Informações
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── PINO DE LOCALIZAÇÃO — endereço no footer ─────────────────────────────
   Pino de mapa com âncora dentro do círculo — fusão de localização
   com identidade náutica do Porto Cabral.                              */
export function IconLocalizacao({ size = 24, ...p }: Props) {
  return base(size, <>
    {/* Corpo do pino */}
    <path d="M12 2 C8.13 2 5 5.13 5 9 C5 14.25 12 22 12 22 C12 22 19 14.25 19 9 C19 5.13 15.87 2 12 2 Z"
      fill="currentColor" fillOpacity="0.1" />
    <path d="M12 2 C8.13 2 5 5.13 5 9 C5 14.25 12 22 12 22 C12 22 19 14.25 19 9 C19 5.13 15.87 2 12 2 Z" />
    {/* Âncora interior */}
    <circle cx="12" cy="8.5" r="1.2" />
    <line x1="12" y1="9.7" x2="12" y2="13.5" />
    <path d="M9.5 11.5 C9.5 13 10.5 13.5 12 13.5 C13.5 13.5 14.5 13 14.5 11.5" />
    <line x1="9.5" y1="11.5" x2="8.5" y2="11.5" />
    <line x1="14.5" y1="11.5" x2="15.5" y2="11.5" />
  </>, p)
}
