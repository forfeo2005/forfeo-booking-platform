import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function getPublicBaseUrl(req: Request) {
  const proto =
    (req.headers["x-forwarded-proto"] as string | undefined) ||
    req.protocol ||
    "http";
  const host =
    (req.headers["x-forwarded-host"] as string | undefined) ||
    req.get("host") ||
    "localhost";
  return `${proto}://${host}`;
}

// IMPORTANT: on prend l’ORIGIN du serveur OAuth (pas les paths gRPC)
function getOAuthOrigin() {
  try {
    return new URL(ENV.oAuthServerUrl).origin;
  } catch {
    return ENV.oAuthServerUrl;
  }
}

export function registerOAuthRoutes(app: Express) {
  /**
   * 1) LOGIN => redirige vers la page d’autorisation OAuth
   * GET /api/oauth/login
   */
  app.get("/api/oauth/login", async (req: Request, res: Response) => {
    if (!ENV.oAuthServerUrl || !ENV.appId) {
      res
        .status(500)
        .send("OAuth non configuré: OAUTH_SERVER_URL ou APP_ID manquant.");
      return;
    }

    const baseUrl = getPublicBaseUrl(req);
    const redirectUri = `${baseUrl}/api/oauth/callback`;

    // Ton SDK décode le state via atob(state) pour retrouver redirectUri :contentReference[oaicite:2]{index=2}
    // Donc on encode redirectUri en base64 standard.
    const state = Buffer.from(redirectUri, "utf8").toString("base64");

    // URL d’autorisation (standard “authorize”)
    // NOTE: si ton fournisseur a un autre path, change "/oauth/authorize".
    const authorizeUrl = new URL("/oauth/authorize", getOAuthOrigin());
    authorizeUrl.searchParams.set("clientId", ENV.appId);
    authorizeUrl.searchParams.set("redirectUri", redirectUri);
    authorizeUrl.searchParams.set("responseType", "code");
    authorizeUrl.searchParams.set("state", state);
    // optionnel (au besoin)
    authorizeUrl.searchParams.set("scope", "openid email profile");

    res.redirect(302, authorizeUrl.toString());
  });

  /**
   * 2) CALLBACK => échange code -> token -> userInfo -> cookie session
   * GET /api/oauth/callback
   */
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

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

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  /**
   * 3) LOGOUT => supprime le cookie
   * GET /api/oauth/logout
   */
  app.get("/api/oauth/logout", async (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, cookieOptions);
    res.redirect(302, "/");
  });
}
