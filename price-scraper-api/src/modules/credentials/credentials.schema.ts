import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const credentialsTable = pgTable("credentials", {
  id: uuid().primaryKey().defaultRandom(),
  serviceName: varchar("service_name", { length: 100 }).notNull().unique(),
  encryptedData: text("encrypted_data").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
