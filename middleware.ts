import { NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { auth } from './auth'
import { routing } from './i18n/routing'
import { isAdminEmail } from './lib/admin'

const intlMiddleware = createIntlMiddleware({
  ...routing,
  localeDetection: true,
})

export default auth((req) => {
  const { pathname } = req.nextUrl

  // /admin → redireciona para /painel (evita conflito com Payload CMS)
  if (pathname === '/admin' || /^\/(pt|en|es)\/admin(\/.*)?$/.test(pathname)) {
    const localeMatch = pathname.match(/^\/(pt|en|es)/)
    const locale = localeMatch?.[1] ?? 'pt'
    const rest = pathname.replace(/^\/(pt|en|es)?\/admin/, '') || ''
    return NextResponse.redirect(new URL(`/${locale}/painel${rest}`, req.nextUrl.origin))
  }

  // Proteção de rotas /painel/* e /[locale]/painel/* (exceto login)
  const isPainelRoute = /^(\/painel|\/(?:pt|en|es)\/painel)(\/.*)?$/.test(pathname)
  const isPainelLogin = /^(\/painel\/login|\/(?:pt|en|es)\/painel\/login)$/.test(pathname)
  if (isPainelRoute && !isPainelLogin) {
    const localeMatch = pathname.match(/^\/(pt|en|es)/)
    const locale = localeMatch?.[1] ?? 'pt'

    // Sem sessão → login do painel (tela separada da area do cliente)
    if (!req.auth?.user?.email) {
      return NextResponse.redirect(
        new URL(`/${locale}/painel/login`, req.nextUrl.origin)
      )
    }

    // Com sessão mas não é admin → home
    if (!isAdminEmail(req.auth.user.email)) {
      return NextResponse.redirect(new URL(`/${locale}`, req.nextUrl.origin))
    }
  }

  // Proteção de rotas /[locale]/cliente/* (exceto login)
  const isClienteRoute =
    /^\/(pt|en|es)\/cliente/.test(pathname) &&
    !pathname.includes('/cliente/login')

  if (isClienteRoute && !req.auth) {
    const localeMatch = pathname.match(/^\/(pt|en|es)/)
    const locale = localeMatch?.[1] ?? 'pt'
    return NextResponse.redirect(
      new URL(`/${locale}/cliente/login`, req.nextUrl.origin)
    )
  }

  return intlMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
