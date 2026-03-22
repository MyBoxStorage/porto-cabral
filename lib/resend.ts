import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

export function getResend(): Resend | null {
  if (!apiKey) return null
  return new Resend(apiKey)
}

export const resendFromEmail =
  process.env.RESEND_FROM_EMAIL ?? 'reservas@portocabralbc.com.br'
