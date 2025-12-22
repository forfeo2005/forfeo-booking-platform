import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { services } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

// VERSION_SQLITE_COMPATIBLE_V2002 🚀
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
      // On liste uniquement les colonnes de données. 
      // On ne mentionne PAS 'id' pour laisser l'auto-incrément fonctionner.
      await db.insert(services).values({
        name: input.name,
        description: input.description || "",
        price: input.price,
        duration: input.duration,
        category: input.category || "Général",
        organizationId: ctx.user.organizationId,
        isActive: true,
      });
      
      return { success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.select()
      .from(services)
      .where(eq(services.organizationId, ctx.user.organizationId));
  }),
});