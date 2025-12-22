import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { services } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

// VERSION_MySQL_FINAL_V2007_FORCE_ORG 🚀
export const serviceRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      price: z.coerce.number(),
      duration: z.coerce.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // On récupère l'ID de l'organisation de l'utilisateur.
      // S'il est manquant (votre cas actuel), on force l'ID 1 pour permettre l'ajout.
      const orgId = ctx.user?.organizationId || 1;

      // Insertion propre compatible MySQL sans le mot-clé 'default'
      await db.insert(services).values({
        name: input.name,
        price: input.price,
        duration: input.duration,
        organizationId: orgId,
      });
      
      return { success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    // On utilise également le fallback ici pour voir les services de l'org 1
    const orgId = ctx.user?.organizationId || 1;
    
    return await db.select()
      .from(services)
      .where(eq(services.organizationId, orgId));
  }),
});