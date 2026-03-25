import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Porcentagem de transações capturadas para performance (0.0 a 1.0)
  // 10% em produção é suficiente e não gera custo desnecessário
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Captura replay de sessão apenas quando há erro
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.05,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: false,
    }),
  ],

  // Não loga no console em produção
  debug: false,
})
