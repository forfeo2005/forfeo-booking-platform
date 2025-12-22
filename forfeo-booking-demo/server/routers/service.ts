import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { services } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export const serviceRouter = router({
  // Lister tous les services de ton entreprise
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(services).where(eq(services.organizationId, ctx.user.organizationId));
  }),

  // Créer un nouveau service
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      price: z.number(),
      duration: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(services).values({
        name: input.name,
        price: input.price,
        duration: input.duration,
        organizationId: ctx.user.organizationId,
      });
      return { success: true };
    }),
});
