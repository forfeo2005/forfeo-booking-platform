import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { db } from "./db";
import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookie } from "cookie";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  db: typeof db;
};

async function getUserFromSessionToken(sessionToken: string): Promise<User | null> {
  const anySdk = sdk as any;

  // ✅ On essaye plusieurs fonctions possibles (selon ton sdk)
  const verifier =
    anySdk.verifySessionToken ||
    anySdk.getSessionFromToken ||
    anySdk.decodeSessionToken;

  if (!verifier) {
    // Si ton SDK a un autre nom, remplace ici par ta vraie fonction
    // ex: const session = await sdk.readSessionToken(sessionToken)
    return null;
  }

  const session = await verifier.call(anySdk, sessionToken);

  // On essaye de deviner où est l'openId
  const openId =
    session?.openId ||
    session?.sub ||
    session?.userId ||
    session?.id;

  if (!openId) return null;

  const now = new Date();

  // On essaye d'obtenir des infos utiles
  const name = session?.name ?? session?.user?.name ?? "Utilisateur";
  const email = session?.email ?? session?.user?.email ?? null;

  // ⚠️ role: on default "USER"
  const roleRaw = String(session?.role ?? session?.user?.role ?? "USER").toUpperCase();
  const role = (roleRaw === "ADMIN" ? "ADMIN" : "USER") as "ADMIN" | "USER";

  const user: User = {
    id: String(openId),
    email,
    name,
    role,
    createdAt: now,
    updatedAt: now,
  };

  return user;
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const header = opts.req.headers.cookie;
  const cookies = header ? parseCookie(header) : {};
  const sessionToken = cookies[COOKIE_NAME];

  let user: User | null = null;

  if (sessionToken) {
    try {
      user = await getUserFromSessionToken(sessionToken);
    } catch (e) {
      // token invalide / expiré
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    db,
  };
}
