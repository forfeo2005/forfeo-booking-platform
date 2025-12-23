import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export const authRouter = router({
  // Récupérer l'utilisateur connecté
  me: publicProcedure.query(({ ctx }) => {
    return { user: ctx.user };
  }),

  // Se connecter
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // On cherche l'utilisateur par email
      const [user] = await db.select().from(users).where(eq(users.email, input.email));

      // CORRECTION: On vérifie le passwordHash (et non user.password)
      // Note: Pour le moment on compare en texte clair. En prod, utilisez bcrypt.compare()
      if (!user || user.passwordHash !== input.password) {
        throw new Error("Email ou mot de passe incorrect");
      }

      // On enregistre l'utilisateur dans la session
      if (ctx.req.session) {
        ctx.req.session.user = {
          id: user.id,
          email: user.email,
          // CORRECTION: organizationId n'est plus dans la table users, on met null ou on l'enlève
          organizationId: null, 
          name: user.name
        };
        await ctx.req.session.save();
      }

      return { success: true };
    }),

  // Se déconnecter
  logout: protectedProcedure.mutation(({ ctx }) => {
    ctx.req.session.destroy();
    return { success: true };
  }),
});