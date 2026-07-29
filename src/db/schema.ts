import { pgTable, text, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  isPremium: boolean('is_premium').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const symptoms = pgTable('symptoms', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: timestamp('date').notNull(),
  name: text('name').notNull(),
  severity: integer('severity').notNull(), // 1-10
  duration: integer('duration'), // in minutes
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const diet = pgTable('diet', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: timestamp('date').notNull(),
  food: text('food').notNull(),
  ingredients: text('ingredients'),
  timing: text('timing'), // e.g., "Breakfast", "14:00"
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const environment = pgTable('environment', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: timestamp('date').notNull(),
  factor: text('factor').notNull(), // e.g., "Weather", "Stress", "Sleep"
  value: text('value').notNull(), // e.g., "Rainy", "High", "6 hours"
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const medications = pgTable('medications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: timestamp('date').notNull(),
  medName: text('med_name').notNull(),
  dosage: text('dosage'),
  timing: text('timing'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  txHash: text('tx_hash').notNull().unique(),
  amount: text('amount').notNull(),
  status: text('status').notNull(), // 'pending', 'completed', 'failed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
