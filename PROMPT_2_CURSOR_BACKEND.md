# PROMPT 2 — CURSOR (Agente) — Backend Completo Porto Cabral

## MISSÃO

Você é um engenheiro backend sênior. Crie o backend completo do site **Porto Cabral BC** — restaurante flutuante premium em Balneário Camboriú. O backend será construído como parte de um projeto Next.js 15 App Router, usando rotas de API (`app/api/`) com TypeScript, Supabase como banco de dados, NextAuth.js v5 para autenticação, Payload CMS para gestão de conteúdo, Resend para emails e integração com o sistema SaaS **BC Connect** para captura e qualificação de leads.

---

## STACK TÉCNICA

- **Runtime:** Node.js 20+
- **Framework:** Next.js 15 App Router (TypeScript) — as rotas de API ficam em `app/api/`
- **Banco de dados:** Supabase (PostgreSQL) — use o Supabase JS Client (`@supabase/supabase-js`) e Supabase Admin Client para operações server-side
- **ORM:** Drizzle ORM (schema type-safe com Supabase)
- **Autenticação:** NextAuth.js v5 (`auth.ts` na raiz) com adapter Supabase
- **CMS:** Payload CMS v3 (integrado ao Next.js, painel em `/admin`)
- **Email:** Resend (`resend` npm package) com templates React Email
- **Validação:** Zod
- **Rate limiting:** Upstash Redis (mesmo serviço já usado no BC Connect)
- **Integração BC Connect:** webhook HTTP para `https://bc-connect-api-v2.fly.dev`

---

## VARIÁVEIS DE AMBIENTE NECESSÁRIAS

Crie o arquivo `.env.local.example` com todas as variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=reservas@portocabralbc.com.br

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# Cloudinary (vídeo hero)
NEXT_PUBLIC_HERO_VIDEO_URL=

# Google Places API (reviews)
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=

# BC Connect Integration
BC_CONNECT_WEBHOOK_URL=https://bc-connect-api-v2.fly.dev
BC_CONNECT_API_KEY=
BC_CONNECT_PARTNER_ID=

# Payload CMS
PAYLOAD_SECRET=
DATABASE_URI=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## SCHEMA DO BANCO DE DADOS (Supabase/Drizzle)

Crie o arquivo `lib/db/schema.ts` com as seguintes tabelas:

### Tabela: `customers`
```typescript
customers: {
  id: uuid (PK, default gen_random_uuid())
  auth_user_id: uuid (FK para auth.users do Supabase, unique)
  name: text NOT NULL
  email: text NOT NULL UNIQUE
  whatsapp: text
  birth_date: date
  city_of_origin: text
  allergies: text (campo livre, ex: "camarão, glúten")
  special_notes: text
  optin_accepted: boolean DEFAULT false
  optin_accepted_at: timestamp
  created_at: timestamp DEFAULT now()
  updated_at: timestamp DEFAULT now()
}
```

### Tabela: `customer_preferences`
```typescript
customer_preferences: {
  id: uuid (PK)
  customer_id: uuid (FK customers.id, ON DELETE CASCADE)
  occasion_type: text (ex: 'romantic', 'celebration', 'business', 'family', 'explore')
  visit_frequency: text (ex: 'first_time', 'sometimes', 'frequent')
  food_preferences: text[] (ex: ['seafood', 'meat', 'pasta'])
  drink_preferences: text[] (ex: ['wine', 'cocktails', 'beer', 'no_alcohol'])
  group_size: text (ex: 'solo', 'couple', '3-4', '5+')
  how_found: text (ex: 'instagram', 'referral', 'google', 'walking_by')
  quiz_completed_at: timestamp
  created_at: timestamp DEFAULT now()
  updated_at: timestamp DEFAULT now()
}
```

### Tabela: `reservations`
```typescript
reservations: {
  id: uuid (PK)
  customer_id: uuid (FK customers.id, nullable — pode reservar sem conta)
  name: text NOT NULL
  email: text NOT NULL
  whatsapp: text NOT NULL
  reservation_date: date NOT NULL
  reservation_time: time NOT NULL
  party_size: integer NOT NULL
  occasion_type: text
  observations: text
  allergies: text
  status: text DEFAULT 'pending' (pending | confirmed | cancelled | completed)
  optin_accepted: boolean DEFAULT false
  bc_connect_sent: boolean DEFAULT false
  bc_connect_sent_at: timestamp
  confirmation_email_sent: boolean DEFAULT false
  confirmation_email_sent_at: timestamp
  created_at: timestamp DEFAULT now()
  updated_at: timestamp DEFAULT now()
}
```

### Tabela: `google_reviews_cache`
```typescript
google_reviews_cache: {
  id: uuid (PK)
  place_id: text NOT NULL
  reviews: jsonb NOT NULL
  rating: numeric(2,1)
  total_reviews: integer
  cached_at: timestamp DEFAULT now()
  expires_at: timestamp (cached_at + 24 hours)
}
```

---

## ROTAS DE API

### POST `/api/reserva`

**Responsabilidade:** Receber dados do formulário de reserva, salvar no banco, enviar email de confirmação, disparar webhook BC Connect.

**Corpo esperado (Zod schema):**
```typescript
const ReservationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  whatsapp: z.string().min(10).max(15),
  reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reservation_time: z.string().regex(/^\d{2}:\d{2}$/),
  party_size: z.number().int().min(1).max(50),
  occasion_type: z.string().optional(),
  observations: z.string().max(500).optional(),
  allergies: z.string().max(300).optional(),
  optin_accepted: z.boolean(),
  locale: z.enum(['pt', 'en', 'es']).default('pt'),
})
```

**Fluxo completo:**
1. Validar corpo com Zod — retornar 400 se inválido
2. Rate limit: máximo 5 reservas por IP por hora (Upstash Redis)
3. Salvar reserva no Supabase (tabela `reservations`)
4. Enviar email de confirmação com Resend (template React Email em PT/EN/ES conforme `locale`)
5. Disparar webhook BC Connect (fire-and-forget, sem await):
```typescript
sendBcEvent({
  eventType: 'RESERVATION',
  occurredAt: new Date().toISOString(),
  lead: {
    email: body.email.toLowerCase(),
    name: body.name,
    phone: body.whatsapp.replace(/\D/g, ''),
  },
  optinAccepted: body.optin_accepted,
  metadata: {
    groupSize: body.party_size,
    estimatedTicket: body.party_size * 175, // ticket médio R$175 por pessoa
    occasionType: body.occasion_type ?? 'reserva_restaurante',
  }
})
```
6. Retornar `{ success: true, reservationId: uuid }`

**Rate limiting com Upstash:**
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
})
```

---

### POST `/api/auth/signup`

**Responsabilidade:** Criar conta de cliente, salvar perfil no Supabase, disparar evento SIGNUP para BC Connect.

**Fluxo:**
1. Criar usuário no Supabase Auth (`supabaseAdmin.auth.admin.createUser`)
2. Inserir perfil em `customers`
3. Disparar BC Connect (fire-and-forget):
```typescript
sendBcEvent({
  eventType: 'SIGNUP',
  occurredAt: new Date().toISOString(),
  lead: { email, name, phone },
  optinAccepted: optin_accepted,
})
```
4. Enviar email de boas-vindas com Resend

---

### POST `/api/cliente/quiz`

**Responsabilidade:** Salvar/atualizar preferências do quiz de qualificação e disparar PREFERENCE_UPDATE no BC Connect.

**Requer:** sessão autenticada (NextAuth)

**Fluxo:**
1. Verificar sessão
2. Upsert em `customer_preferences`
3. Disparar BC Connect:
```typescript
sendBcEvent({
  eventType: 'PREFERENCE_UPDATE',
  occurredAt: new Date().toISOString(),
  lead: { email: session.user.email },
  metadata: {
    preferences: [
      { category: 'OCCASION', value: data.occasion_type },
      { category: 'FOOD', value: data.food_preferences.join(',') },
      { category: 'DRINK', value: data.drink_preferences.join(',') },
      { category: 'GROUP_SIZE', value: data.group_size },
    ]
  }
})
```

---

### GET `/api/cliente/reservas`

**Responsabilidade:** Retornar histórico de reservas do cliente autenticado.

**Requer:** sessão autenticada

**Retorna:** array de reservas ordenadas por data DESC

---

### PUT `/api/cliente/perfil`

**Responsabilidade:** Atualizar dados do perfil do cliente.

**Requer:** sessão autenticada

**Campos atualizáveis:** name, whatsapp, birth_date, city_of_origin, allergies, special_notes

---

### GET `/api/reviews`

**Responsabilidade:** Retornar reviews do Google Places com cache de 24h no Supabase.

**Fluxo:**
1. Verificar cache em `google_reviews_cache` — se válido (expires_at > now()), retornar cache
2. Se expirado, chamar Google Places API:
```
GET https://maps.googleapis.com/maps/api/place/details/json
  ?place_id={GOOGLE_PLACE_ID}
  &fields=reviews,rating,user_ratings_total
  &key={GOOGLE_PLACES_API_KEY}
  &language=pt-BR
```
3. Salvar/atualizar cache no Supabase
4. Retornar reviews (máximo 5, ordenados por rating DESC)

---

### POST `/api/cliente/login-event`

**Responsabilidade:** Disparar evento LOGIN no BC Connect quando usuário autenticar.

**Chamado internamente após login do NextAuth**

```typescript
sendBcEvent({
  eventType: 'LOGIN',
  occurredAt: new Date().toISOString(),
  lead: { email: session.user.email },
})
```

---

## INTEGRAÇÃO BC CONNECT

Crie o arquivo `lib/bcconnect.ts` seguindo rigorosamente o guia oficial:

```typescript
const BC_WEBHOOK_URL = process.env.BC_CONNECT_WEBHOOK_URL ?? 'https://bc-connect-api-v2.fly.dev'
const BC_API_KEY    = process.env.BC_CONNECT_API_KEY ?? ''
const BC_PARTNER_ID = process.env.BC_CONNECT_PARTNER_ID ?? ''

export type BcEventType = 'SIGNUP' | 'RESERVATION' | 'PREFERENCE_UPDATE' | 'TICKET_PURCHASE' | 'LOGIN'

export interface BcLeadPayload {
  email: string        // OBRIGATÓRIO
  name?: string
  phone?: string       // apenas dígitos
  age?: number
  gender?: string
  cityOfOrigin?: string
}

export interface BcWebhookPayload {
  eventType: BcEventType
  occurredAt: string   // ISO 8601 com Z obrigatório
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
  if (!BC_API_KEY) return // silencioso em dev sem key
  try {
    await fetch(`${BC_WEBHOOK_URL}/api/webhook/partner/${BC_PARTNER_ID}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'x-api-key': BC_API_KEY 
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })
  } catch (err) {
    console.warn('[BC Connect] Falha silenciosa:', err)
  }
}
```

**REGRAS CRÍTICAS BC CONNECT:**
- SEMPRE fire-and-forget (sem await no chamador)
- NUNCA passar null — usar undefined ou omitir
- Email é o identificador único — sistema mescla automaticamente duplicatas
- occurredAt DEVE ser ISO 8601 com Z (ex: `new Date().toISOString()`)
- NUNCA expor BC_CONNECT_API_KEY no frontend
- Cada interação cria uma LeadInteraction que alimenta os scores PA, FE, PS, IC, BC

---

## TEMPLATES DE EMAIL (React Email)

Crie os templates em `emails/`:

### `emails/ReservationConfirmation.tsx`
Template bilíngue elegante com:
- Logo Porto Cabral (SVG inline)
- Fundo azul royal + dourado
- Dados da reserva em destaque (data, horário, pessoas)
- Seção "Sua Experiência" com dicas do restaurante
- Endereço + como chegar
- Link para área do cliente
- Footer com redes sociais

### `emails/WelcomeEmail.tsx`
Template de boas-vindas:
- Saudação personalizada com nome
- Resumo dos benefícios da conta
- CTA para completar o quiz de preferências
- Convite para seguir o Instagram

---

## NEXTAUTH.JS V5 CONFIGURAÇÃO

Crie `auth.ts` na raiz:

```typescript
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { SupabaseAdapter } from '@auth/supabase-adapter'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      // email + password via Supabase Auth
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Adicionar customer_id à sessão
      return session
    },
    async signIn({ user }) {
      // Disparar LOGIN event no BC Connect (fire-and-forget)
      return true
    },
  },
  pages: {
    signIn: '/cliente/login',
    error: '/cliente/login',
  },
})
```

---

## PAYLOAD CMS V3 CONFIGURAÇÃO

Crie `payload.config.ts` com as collections:

```typescript
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  admin: {
    user: 'admins', // collection de usuários admin
  },
  collections: [
    // Cardápio
    {
      slug: 'menu-items',
      labels: { singular: 'Prato', plural: 'Pratos' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'name_en', type: 'text' },
        { name: 'name_es', type: 'text' },
        { name: 'category', type: 'select', options: [
          'entradas-quentes', 'entradas-frias', 'saladas', 
          'iguarias-do-mar', 'peixes', 'camaroes', 
          'trattoria', 'carnes-aves', 'horta-ao-prato',
          'sobremesas', 'bebidas', 'drinks', 'caipirinhas', 'doses'
        ]},
        { name: 'description', type: 'textarea' },
        { name: 'description_en', type: 'textarea' },
        { name: 'description_es', type: 'textarea' },
        { name: 'price', type: 'number' },
        { name: 'price_note', type: 'text' }, // ex: "por kg", "1 unidade"
        { name: 'photo', type: 'upload', relationTo: 'media' },
        { name: 'featured', type: 'checkbox' }, // aparece na home
        { name: 'available', type: 'checkbox', defaultValue: true },
        { name: 'vegan', type: 'checkbox' },
        { name: 'lactose_free', type: 'checkbox' },
        { name: 'serves_two', type: 'checkbox' },
        { name: 'sort_order', type: 'number' },
      ],
    },
    // Blog
    {
      slug: 'posts',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'cover', type: 'upload', relationTo: 'media' },
        { name: 'content', type: 'richText' },
        { name: 'category', type: 'text' },
        { name: 'published_at', type: 'date' },
        { name: 'published', type: 'checkbox' },
      ],
    },
    // Experiências
    {
      slug: 'experiences',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'background_image', type: 'upload', relationTo: 'media' },
        { name: 'cta_label', type: 'text' },
        { name: 'sort_order', type: 'number' },
      ],
    },
    // Configurações do Site
    {
      slug: 'site-settings',
      fields: [
        { name: 'whatsapp', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'text' },
        { name: 'opening_hours', type: 'array', fields: [
          { name: 'days', type: 'text' },
          { name: 'hours', type: 'text' },
        ]},
        { name: 'instagram_url', type: 'text' },
        { name: 'hero_video_url', type: 'text' },
        { name: 'google_maps_url', type: 'text' },
      ],
    },
    // Media
    {
      slug: 'media',
      upload: { staticDir: 'public/media' },
      fields: [{ name: 'alt', type: 'text' }],
    },
    // Admins
    {
      slug: 'admins',
      auth: true,
      fields: [{ name: 'name', type: 'text' }],
    },
  ],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
})
```

---

## MIDDLEWARE

Crie `middleware.ts`:

```typescript
import { auth } from './auth'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware({
  locales: ['pt', 'en', 'es'],
  defaultLocale: 'pt',
  localeDetection: true,
})

export default auth((req) => {
  // Proteger rotas da área do cliente
  if (req.nextUrl.pathname.includes('/cliente/') && 
      !req.nextUrl.pathname.includes('/cliente/login') &&
      !req.auth) {
    return NextResponse.redirect(new URL('/cliente/login', req.nextUrl))
  }
  return intlMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next|admin|.*\\..*).*)'],
}
```

---

## SUPABASE — ROW LEVEL SECURITY (RLS)

Crie o arquivo `supabase/migrations/001_rls.sql` com as políticas:

```sql
-- customers: usuário só vê seus próprios dados
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "customers_own_data" ON customers
  FOR ALL USING (auth.uid() = auth_user_id);

-- reservations: usuário vê suas próprias reservas
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reservations_own_data" ON reservations
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );
-- API pode inserir sem restrição (service role)

-- customer_preferences: usuário vê seus próprios dados
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "preferences_own_data" ON customer_preferences
  FOR ALL USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );
```

---

## ESTRUTURA DE ARQUIVOS ESPERADA

```
porto-cabral/
├── auth.ts
├── payload.config.ts
├── middleware.ts
├── app/
│   ├── api/
│   │   ├── reserva/route.ts
│   │   ├── reviews/route.ts
│   │   ├── cliente/
│   │   │   ├── reservas/route.ts
│   │   │   ├── perfil/route.ts
│   │   │   ├── quiz/route.ts
│   │   │   └── login-event/route.ts
│   │   └── auth/[...nextauth]/route.ts
│   └── (payload)/
│       └── admin/[[...segments]]/page.tsx
├── lib/
│   ├── bcconnect.ts
│   ├── supabase.ts (client + admin)
│   ├── resend.ts
│   └── db/
│       └── schema.ts
├── emails/
│   ├── ReservationConfirmation.tsx
│   └── WelcomeEmail.tsx
└── supabase/
    └── migrations/
        ├── 001_schema.sql
        └── 002_rls.sql
```

---

## CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Instalar todas as dependências: `next-auth@beta`, `@auth/supabase-adapter`, `@supabase/supabase-js`, `drizzle-orm`, `payload`, `resend`, `react-email`, `zod`, `@upstash/ratelimit`, `@upstash/redis`
- [ ] Criar `.env.local` com todas as variáveis
- [ ] Schema Drizzle com migrations Supabase
- [ ] RLS policies no Supabase
- [ ] `lib/bcconnect.ts` — seguir RIGOROSAMENTE o guia (fire-and-forget, sem null, ISO 8601 com Z)
- [ ] Payload CMS configurado e funcional
- [ ] Todas as rotas de API com validação Zod
- [ ] Rate limiting em todas as rotas públicas
- [ ] Templates de email com React Email
- [ ] NextAuth v5 com Google + Credentials
- [ ] Middleware de autenticação + i18n
- [ ] Todos os webhooks BC Connect disparados nos momentos corretos:
  - SIGNUP: cadastro na área do cliente
  - RESERVATION: formulário de reserva (em QUALQUER página)
  - PREFERENCE_UPDATE: quiz completado
  - LOGIN: login na área do cliente

---

## OBSERVAÇÕES CRÍTICAS

1. **BC Connect NUNCA deve bloquear a resposta ao usuário** — sempre fire-and-forget
2. **O campo `occurredAt` DEVE ser** `new Date().toISOString()` — formato ISO 8601 com Z
3. **NUNCA passar null** para campos opcionais do BC Connect — usar undefined ou omitir
4. **Ticket médio estimado** para metadata: R$175 por pessoa (baseado no ticket médio do restaurante R$150-200)
5. **Consentimento LGPD** (`optin_accepted`) deve ser salvo junto com a reserva e passado ao BC Connect
6. **Supabase Service Role Key** apenas no servidor — nunca expor no cliente
7. O BC Connect usa o email como identificador único — se o cliente reservar antes de criar conta, o sistema mescla automaticamente quando ele se cadastrar com o mesmo email
