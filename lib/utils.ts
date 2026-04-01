import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata uma string "YYYY-MM-DD" como "DD/MM/YYYY" sem risco de fuso horário.
 * Não usa new Date() para evitar o deslocamento de UTC → local.
 */
export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '—'
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const [y, m, d] = parts
  return `${d}/${m}/${y}`
}

/**
 * Formata um timestamp ISO (created_at, updated_at) como "DD/MM/YYYY HH:MM"
 * usando o locale pt-BR do browser. Seguro para timestamps com fuso horário.
 */
export function formatDateTimeBR(isoStr: string): string {
  if (!isoStr) return '—'
  try {
    return new Date(isoStr).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return isoStr
  }
}

/**
 * Formata um timestamp ISO como "DD/MM/YYYY" apenas.
 */
export function formatDateOnlyBR(isoStr: string): string {
  if (!isoStr) return '—'
  try {
    return new Date(isoStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  } catch {
    return isoStr
  }
}

/**
 * Formata "YYYY-MM-DD" com dia da semana + mês por extenso,
 * conforme o locale solicitado. Sem deslocamento de fuso.
 */
export function formatDateLong(dateStr: string, locale: 'pt' | 'en' | 'es'): string {
  if (!dateStr) return '—'
  try {
    const [y, m, d] = dateStr.split('-').map(Number)
    // Constrói a data no horário local sem deslocamento UTC
    const date = new Date(y, m - 1, d)
    const localeMap = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' } as const
    return date.toLocaleDateString(localeMap[locale], {
      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}
