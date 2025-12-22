import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Middleware: Vérifie que l'utilisateur est connecté.
 * Ajoute `user`, `sessionId` et `orgId` au contexte de la requête suivante.
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.sessionId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Connexion requise" });
  }

  return next({
    ctx: {
      // On force le type à "non null" pour les procédures protégées
      user: ctx.user,
      sessionId: ctx.sessionId,
      orgId: ctx.orgId,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Middleware: Vérifie que l'utilisateur a le rôle global "ADMIN".
 */
const isAdmin = t.middleware(async ({ ctx, next }) => {
  // Note: ctx.user est garanti ici car on utilise 'protectedProcedure' avant ou on check manuellement
  if (!ctx.user || ctx.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès administrateur requis" });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// adminProcedure hérite de protectedProcedure (donc authed) + check admin
export const adminProcedure = protectedProcedure.use(isAdmin);
