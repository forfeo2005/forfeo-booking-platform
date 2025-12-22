import { z } from "zod";
import { desc, eq, and } from "drizzle-orm"; // "and" est nécessaire pour les filtres combinés
import { TRPCError } from "@trpc/server";

// ⚠️ Chemin depuis: server/_core/routers/bookings.ts
import { bookings, customers, services } from "../../../drizzle/schema";

import { router, protectedProcedure } from "../trpc";

export const bookingsRouter = router({
  // Liste des réservations (Scopée par OrgId)
  list: protectedProcedure.query(async ({ ctx }) => {
    // Si l'utilisateur n'a pas d'organisation active, on retourne rien (ou erreur)
    if (!ctx.orgId) return [];

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
      // ✅ SÉCURITÉ : Filtre strict sur l'organisation active
      .where(eq(bookings.orgId, ctx.orgId))
      .orderBy(desc(bookings.createdAt))
      .limit(100);

    return rows;
  }),

  // Update Status (Sécurisé par OrgId)
  updateStatus: protectedProcedure
    .input(
      z.object({
        bookingId: z.number(), // ✅ Changé de string() à number() car ID serial
        status: z.enum(["CONFIRMED", "CANCELLED", "PENDING"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Aucune organisation active" });
      }

      const result = await ctx.db
        .update(bookings)
        .set({ status: input.status })
        .where(
          and(
            eq(bookings.id, input.bookingId),
            // ✅ SÉCURITÉ : On vérifie que la réservation appartient bien à l'org active
            // Impossible de modifier une réservation d'une autre entreprise même en devinant l'ID
            eq(bookings.orgId, ctx.orgId)
          )
        );

      return { ok: true };
    }),
});
