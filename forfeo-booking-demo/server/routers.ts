import { router } from "./_core/trpc";
import { authRouter } from "./_core/routers/auth";
import { bookingsRouter } from "./_core/routers/bookings";
// AJOUTE CETTE LIGNE CI-DESSOUS 👇
import { serviceRouter } from "./routers/service";

// C'est ici qu'on assemble les "briques" de ton API
export const appRouter = router({
  auth: authRouter,
  bookings: bookingsRouter,
  // AJOUTE CETTE LIGNE CI-DESSOUS 👇
  service: serviceRouter, 
});

export type AppRouter = typeof appRouter;