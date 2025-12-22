import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { db } from "./db";

import cookie from "cookie";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@shared/const";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  db: typeof db;
};

async function getUserFromCookie(
  req: CreateExpressContextOptions["req"]
): Promise<User | null> {
  try {
    const rawCookie = req.headers.cookie;
    if (!rawCookie) return null;

    const parsed = cookie.parse(rawCookie);
    const token = parsed[COOKIE_NAME];
    if (!token) return null;

    const secretStr = process.env.JWT_SECRET;
    if (!secretStr) return null; // sans secret, on ne peut pas vérifier

    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jwtVerify(token, secret);

    const id =
      typeof payload.sub === "string"
        ? payload.sub
        : typeof (payload as any).openId === "string"
          ? (payload as any).openId
          : null;

    if (!id) return null;

    const name =
      typeof (payload as any).name === "string" ? (payload as any).name : "Utilisateur";
    const email =
      typeof (payload as any).email === "string" ? (payload as any).email : null;

    // ✅ Version simple (user minimal). Plus tard: tu peux fetch le vrai user DB ici.
    const now = new Date();
    const user: User = {
      id,
      email,
      name,
      role: "ADMIN", // ou "USER" si tu veux
      createdAt: now,
      updatedAt: now,
    };

    return user;
  } catch {
    return null;
  }
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // ✅ DEV optionnel: force connecté en local seulement
  // (IMPORTANT: ne mets PAS DEV_FAKE_USER=1 sur Railway)
  if (process.env.DEV_FAKE_USER === "1") {
    const now = new Date();
    const fakeUser: User = {
      id: "dev-user-1",
      email: "dev@forfeo.com",
      name: "Forfeo Dev",
      role: "ADMIN",
      createdAt: now,
      updatedAt: now,
    };

    return { req: opts.req, res: opts.res, user: fakeUser, db };
  }

  const user = await getUserFromCookie(opts.req);
  return { req: opts.req, res: opts.res, user, db };
}
