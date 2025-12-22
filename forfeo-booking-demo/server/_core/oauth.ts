import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import * as db from "../db";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function getCookieParam(req: Request, key: string): string | undefined {
  const header = req.headers.cookie || "";
  const match = header.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(res: Response, name: string, value: string, req: Request, maxAgeMs: number) {
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(name, value, { ...cookieOptions, maxAge: maxAgeMs });
}

export function registerOAuthRoutes(app: Express) {
  /**
   * ✅ LOGIN: ton front fait window.location.href = "/api/oauth/login"
   * Ici on génère un "state", on le stocke en cookie, puis on redirige vers l'URL OAuth.
   */
  app.get("/api/oauth/login", async (req: Request, res: Response) => {
    try {
      const state = crypto.randomUUID();

      // garde le state 10 minutes (anti-CSRF)
      setCookie(res, "oauth_state", state, req, 10 * 60 * 1000);

      // ⚠️ Selon ton sdk, la fonction peut s'appeler différemment.
      // On essaye plusieurs noms sans faire planter TS.
      const anySdk = sdk as any;
      const getAuthUrl =
        anySdk.getAuthorizationUrl ||
        anySdk.getAuthorizeUrl ||
        anySdk.getLoginUrl ||
        anySdk.getAuthUrl;

      if (!getAuthUrl) {
        return res.status(500).send("SDK OAuth: aucune fonction pour générer l'URL d'autorisation (getAuthorizationUrl/getAuthorizeUrl/...)");
      }

      const url: string = await getAuthUrl.call(anySdk, state);
      return res.redirect(302, url);
    } catch (error) {
      console.error("[OAuth] Login failed", error);
      return res.status(500).send("OAuth login failed");
    }
  });

  /**
   * ✅ CALLBACK: ton code actuel, avec un check de state en plus
   */
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    // ✅ Vérifie que le state match celui qu'on a mis en cookie au /login
    const expectedState = getCookieParam(req, "oauth_state");
    if (expectedState && expectedState !== state) {
      res.status(400).json({ error: "invalid state" });
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

      // ✅ Cookie session (1 an)
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // ✅ on peut nettoyer oauth_state
      res.clearCookie("oauth_state", { path: "/" });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  /**
   * ✅ LOGOUT: supprime la session
   */
  app.post("/api/oauth/logout", async (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
    return res.json({ ok: true });
  });
}
