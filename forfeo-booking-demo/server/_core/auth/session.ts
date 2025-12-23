import { type Request } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db"; // On remonte de 2 crans : _core -> server -> db
import { sessions, users } from "@shared/schema";

export async function getSessionFromRequest(req: Request) {
  // 1. On cherche le cookie de session (souvent nommé 'sid' ou 'connect.sid')
  // Note: Assurez-vous d'avoir cookie-parser activé dans index.ts, sinon req.cookies sera vide
  const sessionId = req.cookies?.sid || req.headers["x-session-id"];

  if (!sessionId) {
    return null;
  }

  // 2. LA REQUÊTE CORRIGÉE (MySQL)
  // On joint la table sessions et users proprement
  const result = await db
    .select()
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  // 3. On retourne les données formatées
  const { sessions: session, users: user } = result[0];
  return { session, user };
}