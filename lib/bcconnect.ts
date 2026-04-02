// URL e chave sem fallback: se não configurados, sendBcEvent retorna sem fazer nada.
// Isso evita que ambientes de preview/dev enviem dados para o CRM de produção
// por engano quando a variável BC_CONNECT_WEBHOOK_URL não está definida.
const BC_WEBHOOK_URL = process.env.BC_CONNECT_WEBHOOK_URL
const BC_API_KEY     = process.env.BC_CONNECT_API_KEY ?? ''
const BC_PARTNER_ID  = process.env.BC_CONNECT_PARTNER_ID ?? ''

export type BcEventType =
  | 'SIGNUP'
  | 'RESERVATION'
  | 'PREFERENCE_UPDATE'
  | 'TICKET_PURCHASE'
  | 'LOGIN'

export interface BcLeadPayload {
  email: string
  name?: string
  phone?: string
  age?: number
  gender?: string
  cityOfOrigin?: string
}

export interface BcWebhookPayload {
  eventType: BcEventType
  occurredAt: string
  lead: BcLeadPayload
  optinAccepted?: boolean
  metadata?: {
    groupSize?: number
    estimatedTicket?: number
    occasionType?: string
    eventName?: string
    preferences?: Array<{ category: string; value: string }>
  }
}

export async function sendBcEvent(payload: BcWebhookPayload): Promise<void> {
  // Sai silenciosamente se qualquer configuração essencial estiver ausente
  if (!BC_API_KEY || !BC_WEBHOOK_URL || !BC_PARTNER_ID) return
  try {
    await fetch(`${BC_WEBHOOK_URL}/api/webhook/partner/${BC_PARTNER_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': BC_API_KEY,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })
  } catch (err) {
    console.warn('[BC Connect] Falha silenciosa:', err)
  }
}
