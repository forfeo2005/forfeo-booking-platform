import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Companies/Businesses offering experiences
 */
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  logo: varchar("logo", { length: 512 }),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  
  // Policies
  cancellationPolicy: mysqlEnum("cancellationPolicy", ["flexible", "moderate", "strict", "custom"]).default("flexible"),
  cancellationHours: int("cancellationHours").default(24),
  cancellationFeePercent: int("cancellationFeePercent").default(50),
  noShowFeePercent: int("noShowFeePercent").default(100),
  maxNoShowsBeforeBlock: int("maxNoShowsBeforeBlock").default(2),
  
  // Stripe Connect
  stripeAccountId: varchar("stripeAccountId", { length: 255 }),
  stripeOnboardingComplete: boolean("stripeOnboardingComplete").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  ownerIdx: index("owner_idx").on(table.ownerId),
}));

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Services/Experiences offered by companies
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull().references(() => companies.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  duration: int("duration").notNull(), // minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  
  // Media
  images: text("images"), // JSON array of image URLs
  
  // Details
  included: text("included"), // JSON array
  notIncluded: text("notIncluded"), // JSON array
  
  // Ratings
  ambassadorTested: boolean("ambassadorTested").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("reviewCount").default(0),
  
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  companyIdx: index("company_idx").on(table.companyId),
}));

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Recurring weekly schedule for services
 */
export const recurringSchedules = mysqlTable("recurring_schedules", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: int("serviceId").notNull().references(() => services.id),
  dayOfWeek: int("dayOfWeek").notNull(), // 0 = Sunday, 6 = Saturday
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:MM format
  endTime: varchar("endTime", { length: 5 }).notNull(), // HH:MM format
  capacity: int("capacity").default(3),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  serviceIdx: index("service_idx").on(table.serviceId),
}));

export type RecurringSchedule = typeof recurringSchedules.$inferSelect;
export type InsertRecurringSchedule = typeof recurringSchedules.$inferInsert;

/**
 * Specific availability slots (overrides recurring schedule)
 */
export const availabilitySlots = mysqlTable("availability_slots", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: int("serviceId").notNull().references(() => services.id),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  time: varchar("time", { length: 5 }).notNull(), // HH:MM
  capacity: int("capacity").notNull(),
  booked: int("booked").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  serviceIdx: index("service_idx").on(table.serviceId),
  dateIdx: index("date_idx").on(table.date),
  uniqueSlot: index("unique_slot").on(table.serviceId, table.date, table.time),
}));

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = typeof availabilitySlots.$inferInsert;

/**
 * Customer information (deduplicated)
 */
export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id), // Optional link to registered user
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  noShowCount: int("noShowCount").default(0),
  isBlocked: boolean("isBlocked").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
}));

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

/**
 * Bookings/Reservations
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  confirmationNumber: varchar("confirmationNumber", { length: 50 }).notNull().unique(),
  
  serviceId: int("serviceId").notNull().references(() => services.id),
  slotId: int("slotId").notNull().references(() => availabilitySlots.id),
  customerId: int("customerId").notNull().references(() => customers.id),
  
  date: varchar("date", { length: 10 }).notNull(),
  time: varchar("time", { length: 5 }).notNull(),
  
  status: mysqlEnum("status", ["confirmed", "completed", "cancelled", "no_show"]).default("confirmed"),
  
  // Gift information
  isGift: boolean("isGift").default(false),
  recipientName: varchar("recipientName", { length: 255 }),
  recipientEmail: varchar("recipientEmail", { length: 320 }),
  giftMessage: text("giftMessage"),
  
  // Special requests
  specialMessage: text("specialMessage"),
  internalNotes: text("internalNotes"),
  
  // Payment
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "succeeded", "failed", "refunded"]).default("pending"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  serviceIdx: index("service_idx").on(table.serviceId),
  customerIdx: index("customer_idx").on(table.customerId),
  dateIdx: index("date_idx").on(table.date),
  statusIdx: index("status_idx").on(table.status),
}));

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Reviews for services
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: int("serviceId").notNull().references(() => services.id),
  bookingId: int("bookingId").references(() => bookings.id),
  customerId: int("customerId").notNull().references(() => customers.id),
  
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  ambassadorBadge: boolean("ambassadorBadge").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  serviceIdx: index("service_idx").on(table.serviceId),
}));

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Chat messages between customers and companies
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull().references(() => bookings.id),
  senderId: int("senderId").notNull(), // Can be user or customer
  senderType: mysqlEnum("senderType", ["customer", "company", "bot"]).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  bookingIdx: index("booking_idx").on(table.bookingId),
}));

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Notification log for tracking sent emails/notifications
 */
export const notificationLogs = mysqlTable("notification_logs", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").references(() => bookings.id),
  type: mysqlEnum("type", ["confirmation", "reminder_24h", "reminder_2h", "cancellation", "gift"]).notNull(),
  recipient: varchar("recipient", { length: 320 }).notNull(),
  status: mysqlEnum("status", ["sent", "failed"]).notNull(),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
}, (table) => ({
  bookingIdx: index("booking_idx").on(table.bookingId),
}));

export type NotificationLog = typeof notificationLogs.$inferSelect;
export type InsertNotificationLog = typeof notificationLogs.$inferInsert;