import { router } from "./_core/trpc";
import { authRouter } from "./_core/routers/auth";
import { bookingsRouter } from "./_core/routers/bookings";

// C'est ici qu'on assemble les "briques" de ton API
export const appRouter = router({
  auth: authRouter,         // Active les routes trpc.auth.login, signup, me...
  bookings: bookingsRouter, // Active les routes trpc.bookings.list...
});

export type AppRouter = typeof appRouter;
