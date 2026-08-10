import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  numeric,
  date,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

// ─── Auth.js v5 adapter tables ────────────────────────────────────────────────
// Must match exactly what @auth/drizzle-adapter expects.
// Extended with `password` column for Credentials provider (not in Auth.js default).

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"), // ADDED: required for Credentials provider; nullable for OAuth users
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
)

// ─── App tables ───────────────────────────────────────────────────────────────
// Note: Drizzle returns numeric(10,2) columns as JS `string` at runtime.
// Always parseFloat() before arithmetic (MEM017).

export const budgetPeriods = pgTable(
  "budget_periods",
  {
    id: serial("id").primaryKey(),
    userId: text("userId").notNull(),
    year: integer("year").notNull(),
    month: integer("month").notNull(), // 1–12
    income: numeric("income", { precision: 10, scale: 2 }).notNull().default("0"),
  },
  (bp) => [unique().on(bp.userId, bp.year, bp.month)]
)

export const budgetItems = pgTable("budget_items", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  tier: text("tier").notNull(), // 'essential' | 'financial' | 'lifestyle'
  label: text("label").notNull(),
  allocatedAmount: numeric("allocated_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
})

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  merchant: text("merchant").notNull(),
  category: text("category").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(), // negative=expense, positive=income
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const piggyBankGoals = pgTable("piggy_bank_goals", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  targetAmount: numeric("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: numeric("current_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  createdAt: timestamp("created_at").defaultNow(),
})
