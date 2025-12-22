import { Router } from "express";
import { SignJWT } from "jose";

const oauthRouter = Router();

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  const effective = secret && secret.length > 15 ? secret : "DEV_CHANGE_ME_PLEASE";
  return new TextEncoder().encode(effective);
}

async function signSession(payload: {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
}) {
  // cookie session 7 jours
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());

  return token;
}

function setSessionCookie(res: any, token: string) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("forfeo_session", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearSessionCookie(res: any) {
  res.clearCookie("forfeo_session", { path: "/" });
}

/**
 * ✅ DEV LOGIN RAPIDE (utile immédiatement)
 * Exemple:
 *   /api/oauth/dev-login?email=test@forfeo.com&name=Test&role=ADMIN
 */
oauthRouter.get("/dev-login", async (req, res) => {
  const email = String(req.query.email ?? "dev@forfeo.com");
  const name = String(req.query.name ?? "Forfeo Dev");
  const role = (String(req.query.role ?? "ADMIN").toUpperCase() === "ADMIN"
    ? "ADMIN"
    : "USER") as "ADMIN" | "USER";

  const token = await signSession({
    id: `user-${Buffer.from(email).toString("hex").slice(0, 10)}`,
    email,
    name,
    role,
  });

  setSessionCookie(res, token);
  res.redirect("/");
});

/**
 * ✅ LOGIN (OAuth) — si tu as un serveur OAuth prêt
 * Vars attendues (Railway Variables):
 *   OAUTH_SERVER_URL   ex: https://ton-auth.com
 *   OAUTH_CLIENT_ID
 *   OAUTH_REDIRECT_URL ex: https://ton-app.railway.app/api/oauth/callback
 *
 * Si pas configuré => on envoie vers dev-login
 */
oauthRouter.get("/login", async (req, res) => {
  const base = process.env.OAUTH_SERVER_URL;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const redirectUri = process.env.OAUTH_REDIRECT_URL;

  if (!base || !clientId || !redirectUri) {
    return res.redirect("/api/oauth/dev-login");
  }

  const authorizeUrl =
    `${base.replace(/\/$/, "")}/authorize` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("openid email profile")}`;

  res.redirect(authorizeUrl);
});

/**
 * ✅ CALLBACK OAuth (code -> token -> userinfo)
 * Vars:
 *   OAUTH_SERVER_URL
 *   OAUTH_CLIENT_ID
 *   OAUTH_CLIENT_SECRET
 *   OAUTH_REDIRECT_URL
 */
oauthRouter.get("/callback", async (req, res) => {
  const code = String(req.query.code ?? "");
  if (!code) return res.status(400).send("Missing code");

  const base = process.env.OAUTH_SERVER_URL;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.OAUTH_REDIRECT_URL;

  if (!base || !clientId || !clientSecret || !redirectUri) {
    return res.status(500).send("OAuth env vars missing");
  }

  const tokenUrl = `${base.replace(/\/$/, "")}/token`;
  const userinfoUrl = `${base.replace(/\/$/, "")}/userinfo`;

  // 1) échanger code -> access_token
  const tokenResp = await fetch(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResp.ok) {
    const txt = await tokenResp.text();
    return res.status(500).send(`Token exchange failed: ${txt}`);
  }

  const tokenJson = (await tokenResp.json()) as { access_token?: string };
  const accessToken = tokenJson.access_token;
  if (!accessToken) return res.status(500).send("No access_token");

  // 2) récupérer userinfo
  const meResp = await fetch(userinfoUrl, {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!meResp.ok) {
    const txt = await meResp.text();
    return res.status(500).send(`Userinfo failed: ${txt}`);
  }

  const me = (await meResp.json()) as {
    sub?: string;
    email?: string;
    name?: string;
    role?: string;
  };

  const token = await signSession({
    id: me.sub ?? "user-unknown",
    email: me.email ?? "unknown@forfeo.com",
    name: me.name ?? "Utilisateur",
    role: (String(me.role ?? "USER").toUpperCase() === "ADMIN" ? "ADMIN" : "USER") as
      | "ADMIN"
      | "USER",
  });

  setSessionCookie(res, token);
  res.redirect("/");
});

oauthRouter.post("/logout", async (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

export { oauthRouter };
