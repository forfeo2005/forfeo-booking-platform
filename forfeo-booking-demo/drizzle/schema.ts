import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

/* =========================================================
   USERS
========================================================= */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("USER"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

/* =========================================================
   COMPANIES
========================================================= */
export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: text("owner_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Company = InferSelectModel<typeof companies>;
export type InsertCompany = InferInsertModel<typeof companies>;

/* =========================================================
   SERVICES (expériences / forfaits)
========================================================= */
export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  priceCents: integer("price_cents").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Service = InferSelectModel<typeof services>;
export type InsertService = InferInsertModel<typeof services>;

/* =========================================================
   AVAILABILITY SLOTS (créneaux précis)
========================================================= */
export const availabilitySlots = pgTable("availability_slots", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceId: uuid("service_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isBooked: boolean("is_booked").notNull().default(false),
});

export type AvailabilitySlot = InferSelectModel<typeof availabilitySlots>;
export type InsertAvailabilitySlot =
  InferInsertModel<typeof availabilitySlots>;

/* =========================================================
   RECURRING SCHEDULES (horaires récurrents)
========================================================= */
export const recurringSchedules = pgTable("recurring_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceId: uuid("service_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = dimanche
  startHour: integer("start_hour").notNull(), // ex: 9
  endHour: integer("end_hour").notNull(),     // ex: 17
});

export type RecurringSchedule =
  InferSelectModel<typeof recurringSchedules>;
export type InsertRecurringSchedule =
  InferInsertModel<typeof recurringSchedules>;

/* =========================================================
   CUSTOMERS
========================================================= */
export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Customer = InferSelectModel<typeof customers>;
export type InsertCustomer = InferInsertModel<typeof customers>;

/* =========================================================
   BOOKINGS (réservations)
========================================================= */
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceId: uuid("service_id").notNull(),
  customerId: uuid("customer_id").notNull(),
  slotId: uuid("slot_id"),
  status: text("status").notNull().default("CONFIRMED"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Booking = InferSelectModel<typeof bookings>;
export type InsertBooking = InferInsertModel<typeof bookings>;
