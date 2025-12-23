import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { organizations } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "../db";

export const organizationRouter = router({
  // Cette fonction permet à TOUT LE MONDE de trouver une entreprise par son slug
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(organizations)
        .where(eq(organizations.slug, input))
        .limit(1);

      return result[0] || null;
    }),
});