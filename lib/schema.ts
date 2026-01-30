import { pgTable, text, timestamp, uuid, numeric } from "drizzle-orm/pg-core";

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
  date: timestamp("date").notNull(),
  rawInput: text("raw_input").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

