import { mysqlTable, serial, varchar, int, text, boolean, timestamp } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// 1. Table des UTILISATEURS (Déjà utilisée pour ton login)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  organizationId: int("organization_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Table des ORGANISATIONS (Ton entreprise)
export const organizations = mysqlTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
});

// 3. Table des SERVICES (Celle qui manquait !)
export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: int("price").notNull(),     // Prix en cents ou entier
  duration: int("duration").notNull(), // Durée en minutes
  organizationId: int("organization_id").notNull(),
});

// 4. Relations (Pour dire "Un service appartient à une organisation")
export const servicesRelations = relations(services, ({ one }) => ({
  organization: one(organizations, {
    fields: [services.organizationId],
    references: [organizations.id],
  }),
}));
