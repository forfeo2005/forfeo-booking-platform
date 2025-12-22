import { mysqlTable, serial, varchar, int, text, timestamp } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// 1. Table des UTILISATEURS
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  organizationId: int("organization_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Table des ORGANISATIONS
export const organizations = mysqlTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
});

// 3. Table des SERVICES (Mise à jour avec description)
export const services = mysqlTable("services", {
  id: serial("id").primaryKey(), // Assure l'AUTO_INCREMENT
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"), // Ajouté pour forcer la mise à jour
  price: int("price").notNull(),
  duration: int("duration").notNull(),
  organizationId: int("organization_id").notNull(),
});

// 4. Relations
export const servicesRelations = relations(services, ({ one }) => ({
  organization: one(organizations, {
    fields: [services.organizationId],
    references: [organizations.id],
  }),
}));