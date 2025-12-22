import { router } from "../trpc";
// On inverse l'ordre des imports pour forcer la mise à jour
import { serviceRouter } from "./service"; 
import { authRouter } from "./auth";

export const appRouter = router({
  // On met 'service' en premier pour être sûr qu'il est vu
  service: serviceRouter, 
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

// FORCAGE MAJEUR DU DEPLOIEMENT - VERSION FINALE
