import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type * as React from 'react'

export type WelcomeEmailProps = {
  name: string
  baseUrl?: string
}

export const WelcomeEmail = ({
  name,
  baseUrl = 'https://portocabralbc.com.br',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo à experiência Porto Cabral BC</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Olá, {name}</Heading>
        <Text style={text}>
          Sua conta na área do cliente está pronta. Acompanhe reservas, atualize
          preferências e receba novidades do restaurante flutuante em Balneário
          Camboriú.
        </Text>
        <Section style={card}>
          <Text style={text}>
            <strong>Benefícios:</strong> histórico de reservas, dados salvos com
            segurança e comunicação alinhada ao que você mais gosta.
          </Text>
        </Section>
        <Text style={text}>
          Complete o{' '}
          <Link href={`${baseUrl}/cliente/quiz`} style={link}>
            quiz de preferências
          </Link>{' '}
          para personalizarmos sua próxima visita.
        </Text>
        <Text style={text}>
          Siga o{' '}
          <Link href="https://instagram.com/portocabralbc" style={link}>
            Instagram @portocabralbc
          </Link>{' '}
          e fique por dentro de eventos e novidades.
        </Text>
        <Text style={footer}>Porto Cabral BC · experiência premium no mar</Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main: React.CSSProperties = {
  backgroundColor: '#06102a',
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
}

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '32px 24px',
  maxWidth: '520px',
  backgroundColor: '#0B1F4B',
  borderRadius: '12px',
  border: '1px solid #D4AF37',
}

const h1: React.CSSProperties = {
  color: '#F8FAFC',
  fontSize: '22px',
  fontWeight: 600,
  margin: '0 0 12px',
}

const text: React.CSSProperties = {
  color: '#CBD5E1',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '12px 0',
}

const card: React.CSSProperties = {
  backgroundColor: 'rgba(15, 23, 42, 0.55)',
  borderRadius: '10px',
  padding: '16px',
  margin: '16px 0',
}

const link: React.CSSProperties = {
  color: '#FDE68A',
  textDecoration: 'underline',
}

const footer: React.CSSProperties = {
  color: '#64748B',
  fontSize: '12px',
  marginTop: '24px',
}
