import { db } from '../../db'; 
import { sessions, users, memberships } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import type { Request, Response } from 'express';

const SESSION_COOKIE_NAME = 'auth_session';
const EXPIRE_DAYS = 30;

export async function createSession(userId: number, orgId?: number) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + EXPIRE_DAYS);

  let activeOrgId = orgId;
  if (!activeOrgId) {
    const mems = await db.select().from(memberships).where(eq(memberships.userId, userId)).limit(1);
    if (mems.length > 0) activeOrgId = mems[0].orgId;
  }

  await db.insert(sessions).values({
    id: token,
    userId,
    activeOrgId,
    expiresAt,
  });

  return token;
}

export async function getSessionFromRequest(req: Request) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  if (!token) return null;

  // --- DEBUT DU REMPLACEMENT ---
  const result = await db
    .select({
      sessionId: sessions.id,
      sessionUserId: sessions.userId,
      activeOrgId: sessions.activeOrgId,
      expiresAt: sessions.expiresAt,
      userName: users.name,
      userEmail: users.email,
      userId: users.id
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, token))
    .limit(1);

  if (result.length === 0) return null;

  const row = result[0];
  const session = { 
    id: row.sessionId, 
    userId: row.sessionUserId, 
    activeOrgId: row.activeOrgId, 
    expiresAt: row.expiresAt as Date 
  };
  const user = { 
    id: row.userId, 
    name: row.userName, 
    email: row.userEmail 
  };
  // --- FIN DU REMPLACEMENT ---

  // Check expiration
  if (new Date() > session.expiresAt) {
    await destroySession(token);
    return null;
  }

  return { session, user };
}

export async function destroySession(token: string) {
  await db.delete(sessions).where(eq(sessions.id, token));
}

export async function updateSessionOrg(token: string, orgId: number) {
    await db.update(sessions).set({ activeOrgId: orgId }).where(eq(sessions.id, token));
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * EXPIRE_DAYS, 
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
}