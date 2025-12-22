import { router } from "../trpc";
import { authRouter } from "./auth";
import { serviceRouter } from "./service"; 

export const appRouter = router({
  auth: authRouter,
  service: serviceRouter, 
});

export type AppRouter = typeof appRouter;

// FORCER LE DEPLOIEMENT FINAL 🚀
