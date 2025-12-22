import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { services } from "@shared/schema";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";

// VERSION_MySQL_FINAL_V2008_RAW_SQL 🚀
export const serviceRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      price: z.coerce.number(),
      duration: z.coerce.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // On récupère l'ID 1 par défaut si l'utilisateur n'en a pas
      const orgId = ctx.user?.organizationId || 1;

      // Utilisation d'une requête SQL brute pour ignorer totalement la colonne 'id'
      // Cela évite l'envoi du mot 'default' qui fait planter MySQL
      await db.execute(sql`
        INSERT INTO services (name, price, duration, organization_id) 
        VALUES (${input.name}, ${input.price}, ${input.duration}, ${orgId})
      `);
      
      return { success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const orgId = ctx.user?.organizationId || 1;
    
    return await db.select()
      .from(services)
      .where(eq(services.organizationId, orgId));
  }),
});