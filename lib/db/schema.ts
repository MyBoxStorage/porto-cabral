import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  auth_user_id: uuid('auth_user_id').unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  whatsapp: text('whatsapp'),
  birth_date: date('birth_date'),
  city_of_origin: text('city_of_origin'),
  allergies: text('allergies'),
  special_notes: text('special_notes'),
  optin_accepted: boolean('optin_accepted').default(false),
  optin_accepted_at: timestamp('optin_accepted_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const customerPreferences = pgTable('customer_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  customer_id: uuid('customer_id')
    .notNull()
    .unique()
    .references(() => customers.id, { onDelete: 'cascade' }),
  occasion_type: text('occasion_type'),
  visit_frequency: text('visit_frequency'),
  food_preferences: text('food_preferences').array(),
  drink_preferences: text('drink_preferences').array(),
  group_size: text('group_size'),
  how_found: text('how_found'),
  quiz_completed_at: timestamp('quiz_completed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  customer_id: uuid('customer_id').references(() => customers.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  whatsapp: text('whatsapp').notNull(),
  reservation_date: date('reservation_date').notNull(),
  reservation_time: text('reservation_time').notNull(),
  party_size: integer('party_size').notNull(),
  occasion_type: text('occasion_type'),
  observations: text('observations'),
  allergies: text('allergies'),
  status: text('status').notNull().default('pending'),
  optin_accepted: boolean('optin_accepted').default(false),
  bc_connect_sent: boolean('bc_connect_sent').default(false),
  bc_connect_sent_at: timestamp('bc_connect_sent_at', { withTimezone: true }),
  confirmation_email_sent: boolean('confirmation_email_sent').default(false),
  confirmation_email_sent_at: timestamp('confirmation_email_sent_at', {
    withTimezone: true,
  }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Conteúdo editável do site (hero, pratos, história, pilares, localização, etc.)
export const siteContent = pgTable('site_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),   // ex: 'hero', 'dishes', 'history', 'pillars', 'location', 'site_info'
  value: jsonb('value').notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  updated_by: text('updated_by'),
})

export const googleReviewsCache = pgTable('google_reviews_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  place_id: text('place_id').notNull().unique(),
  reviews: jsonb('reviews').notNull(),
  rating: numeric('rating', { precision: 2, scale: 1 }),
  total_reviews: integer('total_reviews'),
  cached_at: timestamp('cached_at', { withTimezone: true }).defaultNow().notNull(),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
})
