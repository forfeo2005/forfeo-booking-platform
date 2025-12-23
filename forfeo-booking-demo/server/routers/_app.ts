import { router } from "../_core/trpc";
import { authRouter } from "./auth";
import { serviceRouter } from "./service";
import { organizationRouter } from "./organization"; // Import du nouveau fichier

export const appRouter = router({
  auth: authRouter,
  services: serviceRouter,         // Notez le 's' ici, c'est important pour le frontend
  organizations: organizationRouter, // Notez le 's' ici aussi
});

export type AppRouter = typeof appRouter;