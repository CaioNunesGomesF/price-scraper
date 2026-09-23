import {
  pgTable,
  varchar,
  text,
  timestamp,
  pgEnum,
  jsonb,
  uuid,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "IMOVEIS",
  "VEICULOS",
  "JOGOS",
  "ELETRONICOS",
  "OUTROS",
]);

export const platformEnum = pgEnum("platform", [
  "MERCADO_LIVRE",
  "OLX",
  "GGMAX",
  "AMAZON",
  "OUTROS",
]);

export const searchQueriesTable = pgTable("search_queries", {
  id: uuid().primaryKey().defaultRandom(),
  queryHash: varchar("query_hash", { length: 255 }).notNull().unique(),
  query: varchar("query", { length: 255 }).notNull(),
  category: categoryEnum("category").default("OUTROS").notNull(),
  minPrice: numeric("min_price", { precision: 10, scale: 2 }),
  maxPrice: numeric("max_price", { precision: 10, scale: 2 }),
  filters: jsonb("filters"),
  searchCount: integer("search_count").default(1).notNull(),
  lastClientIp: varchar("last_client_ip", { length: 100 }),
  lastOrigin: text("last_origin"),
  lastUserAgent: text("last_user_agent"),
  lastSearchedAt: timestamp("last_searched_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const listingsTable = pgTable("listings", {
  id: uuid().primaryKey().defaultRandom(),
  searchQueryId: uuid("search_query_id").references(() => searchQueriesTable.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  externalId: varchar("external_id", { length: 255 }),
  title: varchar("title", { length: 500 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("BRL").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  reviewsCount: integer("reviews_count"),
  sellerName: varchar("seller_name", { length: 255 }),
  sellerReputation: varchar("seller_reputation", { length: 100 }),
  location: varchar("location", { length: 255 }),
  condition: varchar("condition", { length: 50 }),
  metadata: jsonb("metadata"),
  scrapedAt: timestamp("scraped_at").defaultNow().notNull(),
});
