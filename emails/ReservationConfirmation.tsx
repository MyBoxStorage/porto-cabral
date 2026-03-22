import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type * as React from 'react'

export type ReservationLocale = 'pt' | 'en' | 'es'

const copy: Record<
  ReservationLocale,
  {
    preview: string
    title: string
    hello: (n: string) => string
    when: string
    people: string
    experience: string
    tips: string[]
    address: string
    directions: string
    clientArea: string
    footer: string
  }
> = {
  pt: {
    preview: 'Sua reserva no Porto Cabral BC foi recebida.',
    title: 'Reserva confirmada — Porto Cabral BC',
    hello: (n) => `Olá, ${n}`,
    when: 'Data e horário',
    people: 'Pessoas',
    experience: 'Sua experiência',
    tips: [
      'Chegue com 10 minutos de antecedência para embarque tranquilo.',
      'Informe alergias e ocasião especial — nossa equipe prepara os detalhes.',
      'Vistas do mar e carta premium: aproveite sem pressa.',
    ],
    address: 'Balneário Camboriú, SC — restaurante flutuante',
    directions: 'Como chegar',
    clientArea: 'Área do cliente',
    footer: 'Porto Cabral BC · Instagram @portocabralbc',
  },
  en: {
    preview: 'Your Porto Cabral BC reservation has been received.',
    title: 'Reservation received — Porto Cabral BC',
    hello: (n) => `Hello, ${n}`,
    when: 'Date & time',
    people: 'Guests',
    experience: 'Your experience',
    tips: [
      'Arrive 10 minutes early for a smooth boarding.',
      'Share allergies and special occasions — we take care of the details.',
      'Sea views and a premium menu: take your time.',
    ],
    address: 'Balneário Camboriú, SC — floating restaurant',
    directions: 'Getting here',
    clientArea: 'Customer area',
    footer: 'Porto Cabral BC · Instagram @portocabralbc',
  },
  es: {
    preview: 'Tu reserva en Porto Cabral BC fue recibida.',
    title: 'Reserva recibida — Porto Cabral BC',
    hello: (n) => `Hola, ${n}`,
    when: 'Fecha y hora',
    people: 'Personas',
    experience: 'Tu experiencia',
    tips: [
      'Llega 10 minutos antes para un embarque tranquilo.',
      'Indica alergias y ocasiones especiales — cuidamos los detalles.',
      'Vistas al mar y carta premium: disfruta sin prisa.',
    ],
    address: 'Balneário Camboriú, SC — restaurante flotante',
    directions: 'Cómo llegar',
    clientArea: 'Área de cliente',
    footer: 'Porto Cabral BC · Instagram @portocabralbc',
  },
}

const logoSvg = (
  <svg
    width="160"
    height="40"
    viewBox="0 0 200 48"
    role="img"
    aria-label="Porto Cabral BC"
  >
    <rect width="200" height="48" rx="8" fill="#0B1F4B" />
    <text
      x="100"
      y="30"
      textAnchor="middle"
      fill="#D4AF37"
      fontFamily="Georgia, serif"
      fontSize="18"
    >
      Porto Cabral BC
    </text>
  </svg>
)

export type ReservationConfirmationProps = {
  name: string
  reservationDate: string
  reservationTime: string
  partySize: number
  locale?: ReservationLocale
  baseUrl?: string
}

export const ReservationConfirmation = ({
  name,
  reservationDate,
  reservationTime,
  partySize,
  locale = 'pt',
  baseUrl = 'https://portocabralbc.com.br',
}: ReservationConfirmationProps) => {
  const c = copy[locale]
  return (
    <Html>
      <Head />
      <Preview>{c.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>{logoSvg}</Section>
          <Heading style={h1}>{c.title}</Heading>
          <Text style={text}>{c.hello(name)}</Text>
          <Section style={card}>
            <Text style={label}>{c.when}</Text>
            <Text style={highlight}>
              {reservationDate} · {reservationTime}
            </Text>
            <Text style={label}>{c.people}</Text>
            <Text style={highlight}>{partySize}</Text>
          </Section>
          <Hr style={hr} />
          <Heading as="h2" style={h2}>
            {c.experience}
          </Heading>
          {c.tips.map((tip) => (
            <Text key={tip} style={text}>
              • {tip}
            </Text>
          ))}
          <Hr style={hr} />
          <Text style={text}>{c.address}</Text>
          <Link href={baseUrl} style={link}>
            {c.directions}
          </Link>
          <Text style={text}>
            <Link href={`${baseUrl}/cliente`} style={link}>
              {c.clientArea}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>{c.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ReservationConfirmation

const main: React.CSSProperties = {
  backgroundColor: '#06102a',
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
}

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '32px 24px',
  maxWidth: '560px',
  background: 'linear-gradient(180deg, #0B1F4B 0%, #06102a 45%)',
  borderRadius: '12px',
  border: '1px solid #D4AF37',
}

const header: React.CSSProperties = { textAlign: 'center', marginBottom: '16px' }

const h1: React.CSSProperties = {
  color: '#F8FAFC',
  fontSize: '24px',
  fontWeight: 600,
  margin: '0 0 12px',
}

const h2: React.CSSProperties = {
  color: '#E2E8F0',
  fontSize: '18px',
  fontWeight: 600,
  margin: '0 0 8px',
}

const text: React.CSSProperties = {
  color: '#CBD5E1',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
}

const label: React.CSSProperties = {
  ...text,
  color: '#94A3B8',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  marginBottom: '4px',
}

const highlight: React.CSSProperties = {
  color: '#FDE68A',
  fontSize: '18px',
  fontWeight: 600,
  margin: '0 0 12px',
}

const card: React.CSSProperties = {
  backgroundColor: 'rgba(15, 23, 42, 0.55)',
  borderRadius: '10px',
  padding: '16px',
  border: '1px solid rgba(212, 175, 55, 0.35)',
}

const hr: React.CSSProperties = {
  borderColor: 'rgba(212, 175, 55, 0.35)',
  margin: '24px 0',
}

const link: React.CSSProperties = {
  color: '#FDE68A',
  textDecoration: 'underline',
  fontSize: '15px',
}

const footer: React.CSSProperties = {
  color: '#64748B',
  fontSize: '12px',
  textAlign: 'center' as const,
}
