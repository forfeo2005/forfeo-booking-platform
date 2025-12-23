import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { services, organizations } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { db } from "../db";

export const serviceRouter = router({
  // Pour le tableau de bord (Admin)
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.activeOrgId) return [];
    return await db
      .select()
      .from(services)
      .where(eq(services.organizationId, ctx.session.activeOrgId));
  }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      price: z.number(),
      duration: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.activeOrgId) throw new Error("Aucune organisation active");
      
      await db.insert(services).values({
        ...input,
        organizationId: ctx.session.activeOrgId,
        isActive: true,
      });
    }),

  // NOUVEAU : Pour la page publique (Client)
  listByOrgSlug: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      // 1. Trouver l'ID de l'organisation grâce au slug
      const orgs = await db
        .select()
        .from(organizations)
        .where(eq(organizations.slug, input))
        .limit(1);

      if (orgs.length === 0) return [];
      const orgId = orgs[0].id;

      // 2. Récupérer les services de cette organisation
      return await db
        .select()
        .from(services)
        .where(and(eq(services.organizationId, orgId), eq(services.isActive, true)));
    }),
});