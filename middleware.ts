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

  // /admin e /[locale]/admin → redireciona para /painel sem locale
  if (pathname === '/admin' || /^\/(pt|en|es)\/admin(\/.*)?$/.test(pathname)) {
    const rest = pathname.replace(/^\/(pt|en|es)?\/admin/, '') || ''
    return NextResponse.redirect(new URL(`/painel${rest}`, req.nextUrl.origin))
  }

  // Proteção de /painel/* sem locale (exceto /painel/login)
  const isPainelRoute = /^\/painel(\/.*)?$/.test(pathname)
  const isPainelLogin = pathname === '/painel/login'
  if (isPainelRoute && !isPainelLogin) {
    if (!req.auth?.user?.email) {
      return NextResponse.redirect(new URL('/painel/login', req.nextUrl.origin))
    }
    if (!isAdminEmail(req.auth.user.email)) {
      return NextResponse.redirect(new URL('/', req.nextUrl.origin))
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
