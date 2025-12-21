import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

// ⚠️ IMPORTANT : adapte ce chemin selon où est ton schema drizzle
// Dans ton repo, tu as un dossier "drizzle" à la racine de "forfeo-booking-demo".
// Souvent, le bon chemin depuis server/_core/routers est: "../../../drizzle/schema"
import { bookings } from "../../../drizzle/schema";

import { desc } from "drizzle-orm";

export const bookingsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.id));

    return rows;
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(bookings)
        .set({ status: input.status })
        .where(bookings.id, input.id);

      return { ok: true };
    }),
});
