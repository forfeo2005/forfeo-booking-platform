import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { db } from "./db";
import { getSessionFromRequest } from "./auth/session"; // Notre helper créé à l'étape 3
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  orgId: number | null; // ID numérique maintenant (MySQL serial)
  sessionId: string | null;
  db: typeof db;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const { req, res } = opts;

  // Récupère la session depuis la DB via le cookie (cookie-parser doit être actif dans index.ts)
  const sessionData = await getSessionFromRequest(req);

  return {
    req,
    res,
    db,
    user: sessionData ? sessionData.user : null,
    // On attache l'ID de l'organisation active au contexte pour le filtrage multi-tenant
    orgId: sessionData?.session.activeOrgId || null,
    sessionId: sessionData?.session.id || null,
  };
}
