import { pgTable, text, timestamp, uuid, numeric, date, jsonb, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "@/auth-schema";

// Re-export auth schema tables
export * from "@/auth-schema";

export const changelog = pgTable("changelog", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull().defaultNow(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Changelog = typeof changelog.$inferSelect;
export type NewChangelog = typeof changelog.$inferInsert;

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  date: date("date").notNull(),
  rawInput: text("raw_input").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

export const userPreferences = pgTable("user_preferences", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),

  // Budget settings
  monthlyBudget: numeric("monthly_budget", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),

  // Regional settings
  timezone: text("timezone").notNull().default("America/Los_Angeles"),
  language: text("language").notNull().default("en"),
  dateFormat: text("date_format").notNull().default("MM/DD/YYYY"),

  // Category preferences
  enabledCategories: text("enabled_categories").array().notNull().default(sql`ARRAY['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'groceries', 'travel', 'education', 'other']`),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;

export const telegramConnections = pgTable("telegram_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  telegramUserId: text("telegram_user_id").notNull().unique(),
  telegramChatId: text("telegram_chat_id").notNull().unique(),
  telegramUsername: text("telegram_username"),
  telegramFirstName: text("telegram_first_name"),
  telegramLastName: text("telegram_last_name"),
  linkedAt: timestamp("linked_at").notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type TelegramConnection = typeof telegramConnections.$inferSelect;
export type NewTelegramConnection = typeof telegramConnections.$inferInsert;

export const telegramLinkTokens = pgTable("telegram_link_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type TelegramLinkToken = typeof telegramLinkTokens.$inferSelect;
export type NewTelegramLinkToken = typeof telegramLinkTokens.$inferInsert;

export const telegramPendingConfirmations = pgTable("telegram_pending_confirmations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  telegramChatId: text("telegram_chat_id").notNull(),
  telegramMessageId: integer("telegram_message_id"),
  rawInput: text("raw_input").notNull(),
  parsedExpenseJson: jsonb("parsed_expense_json").notNull(),
  editField: text("edit_field"),
  status: text("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type TelegramPendingConfirmation =
  typeof telegramPendingConfirmations.$inferSelect;
export type NewTelegramPendingConfirmation =
  typeof telegramPendingConfirmations.$inferInsert;

export const telegramWebhookEvents = pgTable("telegram_webhook_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  telegramUpdateId: text("telegram_update_id").notNull().unique(),
  updateType: text("update_type").notNull(),
  payloadJson: jsonb("payload_json").notNull(),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type TelegramWebhookEvent = typeof telegramWebhookEvents.$inferSelect;
export type NewTelegramWebhookEvent = typeof telegramWebhookEvents.$inferInsert;
