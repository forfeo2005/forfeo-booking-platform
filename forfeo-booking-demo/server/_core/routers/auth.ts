import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '../../db'; // Ajuste import
import { users, organizations, memberships } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createSession, destroySession, setSessionCookie, clearSessionCookie, updateSessionOrg } from '../auth/session';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  // --- SIGNUP ---
  signup: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
      orgName: z.string().min(2), // Nom de la première entreprise
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Check user exists
      const existingUser = await db.select().from(users).where(eq(users.email, input.email));
      if (existingUser.length > 0) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Email déjà utilisé' });
      }

      // 2. Hash password
      const passwordHash = await bcrypt.hash(input.password, 10);

      // 3. Create User, Org, Membership (Transaction idéale ici, on fait séquentiel pour simplifier Drizzle MySQL sans driver transactionnel complexe)
      const [userRes] = await db.insert(users).values({
        email: input.email,
        passwordHash,
        name: input.name,
        role: 'ADMIN', // Premier user est ADMIN par défaut pour simplifier, ou USER
      }).$returningId();
      
      const userId = userRes.id; // Adapté selon ta version Drizzle/MySQL (si insertId ne marche pas, select last)

      const [orgRes] = await db.insert(organizations).values({
        name: input.orgName,
      }).$returningId();
      const orgId = orgRes.id;

      await db.insert(memberships).values({
        userId,
        orgId,
        role: 'OWNER',
      });

      // 4. Create Session
      const token = await createSession(userId, orgId);
      setSessionCookie(ctx.res, token);

      return { success: true };
    }),

  // --- LOGIN ---
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const usersFound = await db.select().from(users).where(eq(users.email, input.email));
      if (usersFound.length === 0) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Identifiants invalides' });
      
      const user = usersFound[0];
      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Identifiants invalides' });

      // Create session (auto-select first org)
      const token = await createSession(user.id);
      setSessionCookie(ctx.res, token);

      return { success: true };
    }),

  // --- LOGOUT ---
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.sessionId) await destroySession(ctx.sessionId);
    clearSessionCookie(ctx.res);
    return { success: true };
  }),

  // --- ME (Session Info) ---
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    
    // Fetch user's orgs for switching
    const userOrgs = await db
        .select({
            orgId: organizations.id,
            name: organizations.name,
            role: memberships.role
        })
        .from(memberships)
        .innerJoin(organizations, eq(memberships.orgId, organizations.id))
        .where(eq(memberships.userId, ctx.user.id));

    return {
      user: ctx.user,
      activeOrgId: ctx.orgId,
      organizations: userOrgs
    };
  }),

  // --- SWITCH ORG ---
  switchOrg: protectedProcedure
    .input(z.object({ orgId: z.number() }))
    .mutation(async ({ ctx, input }) => {
        // Vérifier membership
        const mem = await db.select().from(memberships)
            .where(and(eq(memberships.userId, ctx.user.id), eq(memberships.orgId, input.orgId)));
        
        if (mem.length === 0) throw new TRPCError({ code: 'FORBIDDEN' });

        await updateSessionOrg(ctx.sessionId, input.orgId);
        return { success: true };
    })
});
