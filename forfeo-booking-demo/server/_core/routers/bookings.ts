import { z } from "zod";
import { desc, eq } from "drizzle-orm";

// ⚠️ Chemin depuis: server/_core/routers/bookings.ts  ->  drizzle/schema.ts
import { bookings, customers, services } from "../../../drizzle/schema";

// ⚠️ Ajuste ces imports si chez toi les noms diffèrent (trpc.ts)
import { router, protectedProcedure } from "../trpc";

export const bookingsRouter = router({
  // Liste des réservations (pour alimenter /bookings)
  list: protectedProcedure.query(async ({ ctx }) => {
    // Si tu n’as pas encore branché ctx.db, retourne une liste vide
    if (!ctx.db) return [];

    const rows = await ctx.db
      .select({
        id: bookings.id,
        status: bookings.status,
        createdAt: bookings.createdAt,
        serviceId: bookings.serviceId,
        customerId: bookings.customerId,
        serviceTitle: services.title,
        customerName: customers.name,
        customerEmail: customers.email,
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .leftJoin(customers, eq(bookings.customerId, customers.id))
      .orderBy(desc(bookings.createdAt))
      .limit(100);

    return rows;
  }),

  // Confirmer / Annuler (boutons dans la table)
  updateStatus: protectedProcedure
    .input(
      z.object({
        bookingId: z.string().min(1),
        status: z.enum(["CONFIRMED", "CANCELLED", "PENDING"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new Error("DB non configurée");

      await ctx.db
        .update(bookings)
        .set({ status: input.status })
        .where(eq(bookings.id, input.bookingId));

      return { ok: true };
    }),
});
