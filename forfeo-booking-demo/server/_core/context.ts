import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { db } from "./db";
import { jwtVerify } from "jose";
import cookie from "cookie";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user?: User | null;
  db: typeof db;
};

const COOKIE_NAME = "forfeo_session";

async function getUserFromRequest(req: CreateExpressContextOptions["req"]) {
  const header = req.headers.cookie;
  if (!header) return null;

  const parsed = cookie.parse(header);
  const token = parsed[COOKIE_NAME];
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    const userId = payload.sub;
    if (!userId) return null;

    // Ajuste ici si ton drizzle schema utilise un autre nom (users / user / etc.)
    // Exemple (si tu as une table users):
    // const user = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, String(userId)) });
    // return user ?? null;

    // TEMP: si tu n’as pas encore la table users branchée, retourne null
    // (et tu brancheras la query juste après)
    return null;
  } catch {
    return null;
  }
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // ✅ Bypass DEV optionnel (pratique au début)
  const devBypass = process.env.DEV_AUTH_BYPASS === "1";
  if (devBypass) {
    const fakeUser = {
      id: "dev-user-1",
      email: "dev@forfeo.com",
      name: "Forfeo Dev",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    return { req: opts.req, res: opts.res, user: fakeUser, db };
  }

  const user = await getUserFromRequest(opts.req);
  return { req: opts.req, res: opts.res, user, db };
}
