import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { services } from "@shared/schema";
import { db } from "../db";
import { sql } from "drizzle-orm";

// VERSION_MySQL_FIX_V2005 🚀
export const serviceRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      price: z.coerce.number(),
      duration: z.coerce.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Utilisation d'une insertion brute pour éviter le mot-clé 'default'
      // qui fait planter ta base MySQL actuelle.
      await db.execute(sql`
        INSERT INTO services (name, price, duration, organization_id) 
        VALUES (${input.name}, ${input.price}, ${input.duration}, ${ctx.user.organizationId})
      `);
      
      return { success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const { eq } = await import("drizzle-orm");
    return await db.select()
      .from(services)
      .where(eq(services.organizationId, ctx.user.organizationId));
  }),
});