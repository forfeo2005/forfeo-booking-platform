import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getDb } from "./db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User;
  db: ReturnType<typeof getDb>;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // 🔐 AUTH DEV SIMULÉE
  const fakeUser: User = {
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
    user: fakeUser,
    db: getDb(),
  };
}
