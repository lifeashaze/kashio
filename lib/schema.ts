import { pgTable, text, timestamp, uuid, numeric, date } from "drizzle-orm/pg-core";
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
