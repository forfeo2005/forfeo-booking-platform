import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { db } from "./db";
import { parse as parseCookie } from "cookie";
import { jwtVerify } from "jose";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null; // ✅ plus de fakeUser obligatoire
  db: typeof db;
};

type SessionPayload = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
};

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  // ⚠️ En prod, JWT_SECRET doit être défini dans Railway
  const effective = secret && secret.length > 15 ? secret : "DEV_CHANGE_ME_PLEASE";
  return new TextEncoder().encode(effective);
}

async function readUserFromSessionCookie(
  req: CreateExpressContextOptions["req"]
): Promise<User | null> {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = parseCookie(cookieHeader);
  const token = cookies["forfeo_session"];
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    const p = payload as unknown as SessionPayload;

    if (!p?.id || !p?.email || !p?.name || !p?.role) return null;

    // ✅ On reconstruit un User minimal compatible avec ton type User
    const now = new Date();
    const user: User = {
      id: p.id,
      email: p.email,
      name: p.name,
      role: p.role, // "ADMIN" ou "USER"
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
  // ✅ "DEV_AUTH_BYPASS=1" permet de bypass login en dev (facultatif)
  const bypass = process.env.DEV_AUTH_BYPASS === "1";
  if (bypass) {
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

  const user = await readUserFromSessionCookie(opts.req);
  return {
    req: opts.req,
    res: opts.res,
    user,
    db,
  };
}
