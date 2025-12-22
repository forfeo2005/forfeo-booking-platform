import { router } from "../trpc";
import { authRouter } from "./auth";
import { serviceRouter } from "./service"; // <--- Import du nouveau fichier

export const appRouter = router({
  auth: authRouter,
  service: serviceRouter, // <--- Activation
});

export type AppRouter = typeof appRouter;
