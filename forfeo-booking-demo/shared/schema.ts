import { mysqlTable, serial, varchar, text, int, datetime, boolean, decimal } from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

// 1. Table USERS
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  
  // CORRECTION : Ajout des timestamps complets
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()), 
});

// 2. Table SESSIONS
export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("user_id").notNull(),
  activeOrgId: int("active_org_id"),
  expiresAt: datetime("expires_at").notNull(),
});

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
  slug: varchar("slug", { length: 255 }).unique(),
  ownerId: int("owner_id"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 4. Table SERVICES
export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: int("price"),
  duration: int("duration"),
  organizationId: int("organization_id"),
  isActive: boolean("is_active").default(true),
});