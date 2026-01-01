import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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

