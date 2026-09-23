import { pgTable, varchar, numeric, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { usersTable } from "../auth/auth.schema.js";

export const favoritesTable = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  platform: varchar("platform", { length: 100 }).notNull(),
  externalId: varchar("external_id", { length: 255 }),
  title: varchar("title", { length: 500 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("BRL").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  reviewsCount: integer("reviews_count"),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
