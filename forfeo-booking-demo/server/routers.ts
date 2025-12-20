import { router, publicProcedure } from "./_core/trpc";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";

/**
 * Router principal de l'application
 */
export const appRouter = router({
  /**
   * AUTH
   */
  auth: router({
    /**
     * Toujours retourner un user en DEV
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

export type AppRouter = typeof appRouter;
