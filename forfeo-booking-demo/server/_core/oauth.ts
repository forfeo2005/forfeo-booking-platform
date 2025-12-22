import { randomUUID } from "crypto";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getBaseUrl(req: Request) {
  // Avec app.set("trust proxy", 1) dans index.ts, req.protocol devrait être "https" sur Railway
  const proto = req.header("x-forwarded-proto") ?? req.protocol;
  const host = req.header("x-forwarded-host") ?? req.get("host");
  return `${proto}://${host}`;
}

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function registerOAuthRoutes(app: Express) {
  /**
   * ✅ LOGIN
   * /api/oauth/login -> redirect vers le vrai serveur OAuth (OAUTH_SERVER_URL)
   */
  app.get("/api/oauth/login", async (req: Request, res: Response) => {
    try {
      // IMPORTANT: doit être un domaine externe (pas ton app)
      const oauthServerUrl = mustEnv("OAUTH_SERVER_URL");

      // Ton clientId (dans ta capture c’est "forfeo-booking-app")
      const clientId =
        process.env.OAUTH_CLIENT_ID ??
        process.env.APP_ID ??
        "forfeo-booking-app";

      // Callback vers ton app
      const redirectUri = `${getBaseUrl(req)}/api/oauth/callback`;

      // État (anti-CSRF). On le garde en cookie.
      const state = randomUUID();

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie("oauth_state", state, {
        ...cookieOptions,
        maxAge: 10 * 60 * 1000, // 10 min
      });

      // ✅ URL d’autorisation (EXTERNE)
      const authorizeUrl =
        `${oauthServerUrl.replace(/\/$/, "")}/oauth/authorize` +
        `?clientId=${encodeURIComponent(clientId)}` +
        `&redirectUri=${encodeURIComponent(redirectUri)}` +
        `&state=${encodeURIComponent(state)}`;

      return res.redirect(302, authorizeUrl);
    } catch (error) {
      console.error("[OAuth] Login failed", error);
      return res.status(500).send("OAuth login failed");
    }
  });

  /**
   * ✅ CALLBACK
   * Le provider renvoie ici avec ?code=...&state=...
   */
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = typeof req.query.code === "string" ? req.query.code : undefined;
    const state = typeof req.query.state === "string" ? req.query.state : undefined;

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      // retour home
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  /**
   * (optionnel) LOGOUT
   */
  app.get("/api/oauth/logout", async (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, cookieOptions);
    res.redirect(302, "/");
  });
}
