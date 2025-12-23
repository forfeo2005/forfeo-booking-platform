import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { organizations } from "@shared/schema";
import { eq, sql } from "drizzle-orm"; // J'ai ajouté sql pour être sûr
import { db } from "../db";

export const organizationRouter = router({
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      console.log(`🔍 RECHERCHE: Je cherche le slug "${input}"`);

      // On nettoie l'input (enlève les espaces et met en minuscules)
      const cleanSlug = input.trim().toLowerCase();

      const result = await db
        .select()
        .from(organizations)
        .where(eq(organizations.slug, cleanSlug))
        .limit(1);

      console.log(`✅ RÉSULTAT: ${result.length} entreprise(s) trouvée(s)`);
      
      if (result.length > 0) {
        console.log(`🏢 NOM: ${result[0].name}`);
      } else {
        console.log("❌ AUCUNE CORRESPONDANCE dans la DB");
      }

      return result[0] || null;
    }),
});