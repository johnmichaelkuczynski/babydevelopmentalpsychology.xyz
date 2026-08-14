import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// One row per unique anonymous visitor id (generated client-side, stored in
// localStorage, sent on every request via the X-Anon-Id header).
export const visitorsTable = pgTable("visitors", {
  id: serial("id").primaryKey(),
  anonId: text("anon_id").notNull().unique(),
  visitCount: integer("visit_count").notNull().default(1),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
});

// Cumulative AI-generated character usage for anonymous (not signed-in)
// visitors. Once charsGenerated crosses the free limit, further AI-consuming
// endpoints require sign-in.
export const anonAiUsageTable = pgTable("anon_ai_usage", {
  id: serial("id").primaryKey(),
  anonId: text("anon_id").notNull().unique(),
  charsGenerated: integer("chars_generated").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Visitor = typeof visitorsTable.$inferSelect;
export type AnonAiUsage = typeof anonAiUsageTable.$inferSelect;
