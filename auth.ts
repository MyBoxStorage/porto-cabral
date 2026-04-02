import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

import { sendBcEvent } from '@/lib/bcconnect'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.PC_NEXTAUTH_SECRET,

  // JWT stateless com expiração curta.
  // Sem adapter de banco — o signOut apaga o cookie mas não invalida server-side.
  // maxAge de 24 h reduz a janela de exposição em caso de token comprometido.
  session: {
    strategy: 'jwt',
    maxAge:   24 * 60 * 60, // 24 horas (era indefinido = 30 dias por padrão)
  },

  // Garante atributos de cookie seguros explicitamente
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path:     '/',
        secure:   true, // exige HTTPS — Vercel sempre serve HTTPS em produção
      },
    },
  },

  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const url  = process.env.NEXT_PUBLIC_SUPABASE_URL_PC
        const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PC
        if (!url || !anon) return null

        // Cria um client por autenticação — sem reutilização de sessão entre usuários
        const supabase = createClient(url, anon, {
          auth: { persistSession: false },
        })

        const { data, error } = await supabase.auth.signInWithPassword({
          email:    String(credentials.email),
          password: String(credentials.password),
        })

        if (error || !data.user) return null

        return {
          id:    data.user.id,
          email: data.user.email ?? undefined,
          name:
            (data.user.user_metadata?.full_name as string | undefined) ??
            (data.user.user_metadata?.name     as string | undefined) ??
            data.user.email ??
            undefined,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id)    token.id    = user.id
      if (user?.email) token.email = user.email
      return token
    },
    async session({ session, token }) {
      if (token?.id)    session.user.id    = token.id    as string
      if (token?.email) session.user.email = token.email as string
      return session
    },
    async signIn({ user }) {
      if (user?.email) {
        void sendBcEvent({
          eventType:  'LOGIN',
          occurredAt: new Date().toISOString(),
          lead:       { email: user.email },
        })
      }
      return true
    },
  },

  pages: {
    signIn: '/cliente/login',
    error:  '/cliente/login',
  },
})
