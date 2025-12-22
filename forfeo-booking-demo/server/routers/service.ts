import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { services } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

// VERSION_MySQL_FINAL_V2006 🚀
export const serviceRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      price: z.coerce.number(),
      duration: z.coerce.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Vérification de sécurité pour l'ID d'organisation
      const orgId = ctx.user?.organizationId;
      
      if (!orgId) {
        throw new Error("L'utilisateur n'est pas lié à une organisation.");
      }

      // Insertion propre sans le mot-clé 'default'
      await db.insert(services).values({
        name: input.name,
        price: input.price,
        duration: input.duration,
        organizationId: orgId,
      });
      
      return { success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.select()
      .from(services)
      .where(eq(services.organizationId, ctx.user.organizationId));
  }),
});