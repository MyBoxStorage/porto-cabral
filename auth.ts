import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'

import { sendBcEvent } from '@/lib/bcconnect'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.PC_NEXTAUTH_SECRET,
  // Sem adapter — usa JWT session (cookie criptografado, sem tabelas no banco)
  session: { strategy: 'jwt' },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const url  = process.env.NEXT_PUBLIC_SUPABASE_URL_PC
        const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PC
        if (!url || !anon) return null
        const supabase = createClient(url, anon)
        const { data, error } = await supabase.auth.signInWithPassword({
          email: String(credentials.email),
          password: String(credentials.password),
        })
        if (error || !data.user) return null
        return {
          id: data.user.id,
          email: data.user.email ?? undefined,
          name:
            (data.user.user_metadata?.full_name as string | undefined) ??
            (data.user.user_metadata?.name as string | undefined) ??
            data.user.email ??
            undefined,
        }
      },
    }),
  ],
  callbacks: {
    // Persiste id e email no token JWT
    async jwt({ token, user }) {
      if (user?.id)    token.id    = user.id
      if (user?.email) token.email = user.email
      return token
    },
    // Expoe id e email na sessao a partir do token
    async session({ session, token }) {
      if (token?.id)    session.user.id    = token.id as string
      if (token?.email) session.user.email = token.email as string
      return session
    },
    async signIn({ user }) {
      if (user?.email) {
        void sendBcEvent({
          eventType: 'LOGIN',
          occurredAt: new Date().toISOString(),
          lead: { email: user.email },
        })
      }
      return true
    },
  },
  pages: {
    signIn: '/cliente/login',
    error: '/cliente/login',
  },
})
