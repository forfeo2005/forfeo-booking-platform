import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  int,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";
import { relations, InferSelectModel, InferInsertModel } from "drizzle-orm";

/* =========================================================
   AUTH & ORGANIZATIONS (MULTI-TENANT)
========================================================= */

export const organizations = mysqlTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("USER"), // "ADMIN" ou "USER"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (t) => ({
  emailIdx: uniqueIndex("email_idx").on(t.email),
}));

export const memberships = mysqlTable("memberships", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(),
  orgId: int("org_id").notNull(),
  role: varchar("role", { length: 50 }).default("MEMBER"), // "OWNER", "ADMIN", "MEMBER"
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  userOrgIdx: index("user_org_idx").on(t.userId, t.orgId),
}));

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(), // Token de session
  userId: int("user_id").notNull(),
  activeOrgId: int("active_org_id"), // L'organisation contextuelle
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================================================
   SERVICES (Scoped by Org)
========================================================= */

export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
  orgId: int("org_id").notNull(), // Multi-tenant link
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  durationMinutes: int("duration_minutes").notNull(),
  priceCents: int("price_cents").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  orgIdx: index("service_org_idx").on(t.orgId),
}));

/* =========================================================
   AVAILABILITY SLOTS
========================================================= */

export const availabilitySlots = mysqlTable("availability_slots", {
  id: serial("id").primaryKey(),
  serviceId: int("service_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isBooked: boolean("is_booked").notNull().default(false),
});

/* =========================================================
   RECURRING SCHEDULES
========================================================= */

export const recurringSchedules = mysqlTable("recurring_schedules", {
  id: serial("id").primaryKey(),
  serviceId: int("service_id").notNull(),
  dayOfWeek: int("day_of_week").notNull(), // 0 = dimanche
  startHour: int("start_hour").notNull(),
  endHour: int("end_hour").notNull(),
});

/* =========================================================
   CUSTOMERS (Scoped by Org)
========================================================= */

export const customers = mysqlTable("customers", {
  id: serial("id").primaryKey(),
  orgId: int("org_id").notNull(), // Multi-tenant link
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  orgIdx: index("customer_org_idx").on(t.orgId),
}));

/* =========================================================
   BOOKINGS (Scoped by Org)
========================================================= */

export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  orgId: int("org_id").notNull(), // Multi-tenant link
  serviceId: int("service_id").notNull(),
  customerId: int("customer_id").notNull(),
  slotId: int("slot_id"), // Nullable si réservation hors slot prédéfini
  status: varchar("status", { length: 50 }).notNull().default("CONFIRMED"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  orgIdx: index("booking_org_idx").on(t.orgId),
}));

/* =========================================================
   REVIEWS ⭐
========================================================= */

export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  serviceId: int("service_id").notNull(),
  customerId: int("customer_id").notNull(),
  rating: int("rating").notNull(), // 1 à 5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================================================
   CHAT MESSAGES 💬
========================================================= */

export const chatMessages = mysqlTable("chat_messages", {
  id: serial("id").primaryKey(),
  orgId: int("org_id").notNull(), // Utile pour récupérer tous les chats d'une org
  bookingId: int("booking_id").notNull(),
  senderId: varchar("sender_id", { length: 255 }).notNull(), // Peut être un User ID ou Customer ID
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================================================
   NOTIFICATION LOGS 🔔
========================================================= */

export const notificationLogs = mysqlTable("notification_logs", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  payload: text("payload"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================================================
   RELATIONS (Drizzle Relations)
========================================================= */

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  sessions: many(sessions),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(memberships),
  services: many(services),
  customers: many(customers),
  bookings: many(bookings),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, { fields: [memberships.userId], references: [users.id] }),
  organization: one(organizations, { fields: [memberships.orgId], references: [organizations.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  organization: one(organizations, { fields: [services.orgId], references: [organizations.id] }),
  bookings: many(bookings),
  slots: many(availabilitySlots),
  reviews: many(reviews),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  organization: one(organizations, { fields: [bookings.orgId], references: [organizations.id] }),
  service: one(services, { fields: [bookings.serviceId], references: [services.id] }),
  customer: one(customers, { fields: [bookings.customerId], references: [customers.id] }),
  messages: many(chatMessages),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  organization: one(organizations, { fields: [customers.orgId], references: [organizations.id] }),
  bookings: many(bookings),
}));

/* =========================================================
   TYPES EXPORTS
========================================================= */

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export type Organization = InferSelectModel<typeof organizations>;
export type InsertOrganization = InferInsertModel<typeof organizations>;

export type Service = InferSelectModel<typeof services>;
export type InsertService = InferInsertModel<typeof services>;

export type Booking = InferSelectModel<typeof bookings>;
export type InsertBooking = InferInsertModel<typeof bookings>;

export type Customer = InferSelectModel<typeof customers>;
export type InsertCustomer = InferInsertModel<typeof customers>;
