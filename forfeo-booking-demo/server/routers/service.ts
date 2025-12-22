import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { services } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export const serviceRouter = router({
  // C'est cette fonction "create" que ton site cherche !
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.coerce.number(),
      duration: z.coerce.number(),
      category: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // On insère le service lié à l'organisation de l'utilisateur
      const [service] = await db.insert(services).values({
        ...input,
        organizationId: ctx.user.organizationId,
        isActive: true,
      }).returning();
      
      return service;
    }),

  // Pour lister les services (utile pour l'affichage)
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.select()
      .from(services)
      .where(eq(services.organizationId, ctx.user.organizationId));
  }),
});