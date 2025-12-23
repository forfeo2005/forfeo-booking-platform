import { mysqlTable, serial, varchar, text, int, datetime, boolean, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// 1. Table USERS (Utilisateurs)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  createdAt: datetime("created_at").default(new Date()).notNull(),
});

// 2. Table SESSIONS (Celle qui causait l'erreur rouge !)
export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("user_id").notNull(),
  activeOrgId: int("active_org_id"), // La colonne qui manquait
  expiresAt: datetime("expires_at").notNull(),
});

// Relations Sessions -> Users
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// 3. Table ORGANIZATIONS
export const organizations = mysqlTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique(), // Vu dans tes logs
  ownerId: int("owner_id"),
  createdAt: datetime("created_at").default(new Date()),
});

// 4. Table SERVICES (Vu dans tes logs)
export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: int("price"), // ou decimal selon ton choix
  duration: int("duration"),
  organizationId: int("organization_id"),
  isActive: boolean("is_active").default(true),
});