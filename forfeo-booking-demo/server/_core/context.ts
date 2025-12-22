import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { db } from "./db";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null; // ✅ maintenant: peut être null si pas connecté
  db: typeof db;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // ✅ VRAI login: lit le cookie + vérifie la session + charge l'user en DB
    user = await sdk.authenticateRequest(opts.req);
  } catch (err) {
    // Pas de cookie / cookie invalide / user pas trouvé => pas connecté
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    db,
  };
}
