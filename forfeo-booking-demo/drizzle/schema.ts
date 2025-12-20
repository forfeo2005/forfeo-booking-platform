import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  index,
} from "drizzle-orm/mysql-core";

/* =====================================================
   USERS
===================================================== */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
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

/* =====================================================
   RESERVATIONS (ÉTAPE 4)
===================================================== */
export const reservations = mysqlTable(
  "reservations",
  {
    id: int("id").autoincrement().primaryKey(),

    userId: int("userId")
      .notNull()
      .references(() => users.id),

    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
    time: varchar("time", { length: 5 }).notNull(), // HH:MM

    status: mysqlEnum("status", [
      "confirmed",
      "cancelled",
    ]).default("confirmed"),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("reservation_user_idx").on(table.userId),
    dateIdx: index("reservation_date_idx").on(table.date),
  })
);

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = typeof reservations.$inferInsert;
