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

  // Si pas d'orgId spécifié, on essaie d'en trouver un par défaut
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

  const result = await db
    .select({
      session: {
        id: sessions.id,
        userId: sessions.userId,
        activeOrgId: sessions.activeOrgId,
        expiresAt: sessions.expiresAt,
        createdAt: sessions.createdAt,
      },
      user: {
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, token))
    .limit(1);

  if (result.length === 0) return null;

  const { session, user } = result[0];

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
    maxAge: 1000 * 60 * 60 * 24 * EXPIRE_DAYS, // 30 jours
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
}
