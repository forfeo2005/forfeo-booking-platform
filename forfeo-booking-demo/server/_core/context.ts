import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { COOKIE_NAME } from "@shared/const";
import cookie from "cookie";
import type { User } from "../../drizzle/schema";
import { db } from "./db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  db: typeof db;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const rawCookie = opts.req.headers.cookie ?? "";
  const parsed = cookie.parse(rawCookie);

  // ✅ Si cookie dev => connecté
  const isDevLoggedIn = parsed[COOKIE_NAME] === "dev";

  const devUser: User = {
    id: "dev-user-1",
    email: "dev@forfeo.com",
    name: "Forfeo Dev",
    role: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    req: opts.req,
    res: opts.res,
    user: isDevLoggedIn ? devUser : null,
    db,
  };
}
