import { router, publicProcedure } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { bookingsRouter } from "./_core/routers/bookings";

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(({ ctx }) => {
      return ctx.user; // ✅ null si pas connecté
    }),
  }),

  system: systemRouter,
  bookings: bookingsRouter,
});

export type AppRouter = typeof appRouter;
