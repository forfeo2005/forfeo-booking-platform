import { router, publicProcedure } from "./trpc";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";

/**
 * Router principal de l'application
 */
export const appRouter = router({
  /**
   * AUTH
   */
  auth: router({
    /**
     * Retourne toujours un utilisateur
     * (mode DEV sécurisé)
     */
    me: publicProcedure.query(({ ctx }) => {
      return (
        ctx.user ?? {
          id: "dev-user-1",
          email: "dev@forfeo.com",
          name: "Forfeo Dev",
          role: "ADMIN",
        }
      );
    }),

    /**
     * Logout
     */
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
  }),
});

/**
 * Type tRPC exporté pour le frontend
 */
export type AppRouter = typeof appRouter;
