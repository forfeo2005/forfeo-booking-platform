import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
// CORRECTION : On remonte d'un cran pour trouver db
import { db } from "../db";
import { getSessionFromRequest } from "./auth/session";
// CORRECTION : On pointe vers le bon schéma partagé
import type { users } from "@shared/schema";

// On utilise le type déduit de la table users
type User = typeof users.$inferSelect;

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  orgId: number | null;
  sessionId: string | null;
  db: typeof db;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const { req, res } = opts;

  // Récupère la session depuis la DB via le cookie
  const sessionData = await getSessionFromRequest(req);

  return {
    req,
    res,
    db,
    user: sessionData ? sessionData.user : null,
    // On gère le cas où activeOrgId est null
    orgId: sessionData?.session.activeOrgId || null,
    sessionId: sessionData?.session.id || null,
  };
}
