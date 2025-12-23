import { type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { sessions, users } from "@shared/schema";
import { randomBytes } from "crypto";

const SESSION_COOKIE_NAME = "sid";
const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;

// --- 1. LECTURE ---
export async function getSessionFromRequest(req: Request) {
  const sessionId = req.cookies?.[SESSION_COOKIE_NAME] || req.headers["x-session-id"];
  
  if (!sessionId) return null;

  const result = await db
    .select()
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (result.length === 0) return null;

  const { sessions: session, users: user } = result[0];
  return { session, user };
}

// --- 2. ÉCRITURE (CORRIGÉE) ---

// On accepte soit l'objet user, soit juste l'ID numérique
export async function createSession(input: { id: number } | number) {
  const sessionId = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ONE_WEEK_MS);

  // Détection intelligente : est-ce un nombre ou un objet ?
  const userId = typeof input === "number" ? input : input.id;

  if (!userId) {
    throw new Error("Impossible de créer une session : ID utilisateur manquant");
  }

  await db.insert(sessions).values({
    id: sessionId,
    userId: userId, // On utilise l'ID sécurisé
    expiresAt: expiresAt,
    activeOrgId: null 
  });

  return sessionId;
}

export async function destroySession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function updateSessionOrg(sessionId: string, orgId: number) {
  await db.update(sessions)
    .set({ activeOrgId: orgId })
    .where(eq(sessions.id, sessionId));
}

// --- 3. COOKIES ---

export function setSessionCookie(res: Response, sessionId: string) {
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + ONE_WEEK_MS),
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
}