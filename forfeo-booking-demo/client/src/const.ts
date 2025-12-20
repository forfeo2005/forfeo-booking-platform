export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Generate login URL safely (no Invalid URL possible)
 */
export const getLoginUrl = () => {
  const oauthPortalUrl =
    import.meta.env.VITE_OAUTH_PORTAL_URL ??
    window.location.origin;

  const appId =
    import.meta.env.VITE_APP_ID ?? "forfeo-booking-app";

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  // ✅ SAFE: always absolute
  const url = new URL("/app-auth", oauthPortalUrl);

  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
