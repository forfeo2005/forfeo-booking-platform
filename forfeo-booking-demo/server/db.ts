import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  companies, InsertCompany,
  services, InsertService,
  availabilitySlots, InsertAvailabilitySlot,
  recurringSchedules, InsertRecurringSchedule,
  customers, InsertCustomer,
  bookings, InsertBooking,
  reviews, InsertReview,
  chatMessages, InsertChatMessage,
  notificationLogs, InsertNotificationLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== COMPANIES ==========

export async function createCompany(company: InsertCompany) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(companies).values(company) as any;
  return Number(result.insertId);
}

export async function getCompanyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result[0];
}

export async function getCompaniesByOwner(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(companies).where(eq(companies.ownerId, ownerId));
}

export async function updateCompany(id: number, data: Partial<InsertCompany>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(companies).set(data).where(eq(companies.id, id));
}

// ========== SERVICES ==========

export async function createService(service: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(services).values(service) as any;
  return Number(result.insertId);
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result[0];
}

export async function getServicesByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(services).where(eq(services.companyId, companyId));
}

export async function updateService(id: number, data: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(services).set(data).where(eq(services.id, id));
}

// ========== AVAILABILITY SLOTS ==========

export async function createAvailabilitySlot(slot: InsertAvailabilitySlot) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(availabilitySlots).values(slot) as any;
  return Number(result.insertId);
}

export async function getAvailabilitySlots(serviceId: number, startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(availabilitySlots)
    .where(
      and(
        eq(availabilitySlots.serviceId, serviceId),
        gte(availabilitySlots.date, startDate),
        lte(availabilitySlots.date, endDate),
        eq(availabilitySlots.isActive, true)
      )
    )
    .orderBy(availabilitySlots.date, availabilitySlots.time);
}

export async function getAvailabilitySlotById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(availabilitySlots).where(eq(availabilitySlots.id, id)).limit(1);
  return result[0];
}

export async function updateAvailabilitySlot(id: number, data: Partial<InsertAvailabilitySlot>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(availabilitySlots).set(data).where(eq(availabilitySlots.id, id));
}

export async function incrementSlotBooked(slotId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(availabilitySlots)
    .set({ booked: sql`${availabilitySlots.booked} + 1` })
    .where(eq(availabilitySlots.id, slotId));
}

// ========== RECURRING SCHEDULES ==========

export async function createRecurringSchedule(schedule: InsertRecurringSchedule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(recurringSchedules).values(schedule) as any;
  return Number(result.insertId);
}

export async function getRecurringSchedulesByService(serviceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(recurringSchedules).where(eq(recurringSchedules.serviceId, serviceId));
}

export async function updateRecurringSchedule(id: number, data: Partial<InsertRecurringSchedule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(recurringSchedules).set(data).where(eq(recurringSchedules.id, id));
}

// ========== CUSTOMERS ==========

export async function createCustomer(customer: InsertCustomer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customers).values(customer) as any;
  return Number(result.insertId);
}

export async function getCustomerByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
  return result[0];
}

export async function getCustomerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result[0];
}

export async function updateCustomer(id: number, data: Partial<InsertCustomer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(customers).set(data).where(eq(customers.id, id));
}

// ========== BOOKINGS ==========

export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(bookings).values(booking) as any;
  return Number(result.insertId);
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result[0];
}

export async function getBookingByConfirmationNumber(confirmationNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(bookings).where(eq(bookings.confirmationNumber, confirmationNumber)).limit(1);
  return result[0];
}

export async function getBookingsByService(serviceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(bookings)
    .where(eq(bookings.serviceId, serviceId))
    .orderBy(desc(bookings.createdAt));
}

export async function getBookingsByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(bookings)
    .where(eq(bookings.customerId, customerId))
    .orderBy(desc(bookings.createdAt));
}

export async function updateBooking(id: number, data: Partial<InsertBooking>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(bookings).set(data).where(eq(bookings.id, id));
}

// ========== REVIEWS ==========

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(reviews).values(review) as any;
  return Number(result.insertId);
}

export async function getReviewsByService(serviceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(reviews)
    .where(eq(reviews.serviceId, serviceId))
    .orderBy(desc(reviews.createdAt));
}

// ========== CHAT MESSAGES ==========

export async function createChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(chatMessages).values(message) as any;
  return Number(result.insertId);
}

export async function getChatMessagesByBooking(bookingId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(chatMessages)
    .where(eq(chatMessages.bookingId, bookingId))
    .orderBy(chatMessages.createdAt);
}

export async function markMessagesAsRead(bookingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(chatMessages)
    .set({ isRead: true })
    .where(eq(chatMessages.bookingId, bookingId));
}

// ========== NOTIFICATION LOGS ==========

export async function createNotificationLog(log: InsertNotificationLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(notificationLogs).values(log) as any;
  return Number(result.insertId);
}

export async function getNotificationLogsByBooking(bookingId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(notificationLogs)
    .where(eq(notificationLogs.bookingId, bookingId))
    .orderBy(desc(notificationLogs.sentAt));
}

// ========== UTILITY FUNCTIONS ==========

export function generateConfirmationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FORFEO-${year}-${random}`;
}
