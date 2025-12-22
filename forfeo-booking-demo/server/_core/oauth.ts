import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { getSessionCookieOptions } from "./cookies";

export function registerOAuthRoutes(app: Express) {
  /**
   * ✅ LOGIN DEV (LOCAL)
   * - Ne dépend pas de db ni de sdk
   * - Pose un cookie de session "dev"
   */
  app.get("/api/oauth/login", async (req: Request, res: Response) => {
    try {
      const cookieOptions = getSessionCookieOptions(req);

      // Cookie ultra simple pour dev/staging
      res.cookie(COOKIE_NAME, "dev", { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return res.redirect(302, "/");
    } catch (err) {
      console.error("[OAuth] DEV login failed", err);
      return res.status(500).send("Login failed");
    }
  });

  /**
   * ✅ LOGOUT
   */
  app.get("/api/oauth/logout", async (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, cookieOptions);
    return res.redirect(302, "/");
  });

  /**
   * (OPTION) Callback OAuth réel — on le laisse en 501 pour l'instant
   * Quand tu branches un vrai provider OAuth, on complète ça.
   */
  app.get("/api/oauth/callback", async (_req: Request, res: Response) => {
    return res.status(501).send("OAuth callback not configured yet.");
  });
}
