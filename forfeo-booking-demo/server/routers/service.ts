import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { services } from "@shared/schema";
import { db } from "../db";

// VERSION_FINALE_SQL_PROPRE 🚀
export const serviceRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.coerce.number(),
      duration: z.coerce.number(),
      category: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // On force l'insertion sans AUCUNE mention de l'ID ou de valeurs par défaut
      await db.insert(services).values({
        name: input.name,
        description: input.description || "",
        price: input.price,
        duration: input.duration,
        category: input.category || "Général",
        organizationId: ctx.user.organizationId,
      } as any); // Le 'as any' permet d'outrepasser les blocages de type si nécessaire
      
      return { success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const { eq } = await import("drizzle-orm");
    return await db.select()
      .from(services)
      .where(eq(services.organizationId, ctx.user.organizationId));
  }),
});