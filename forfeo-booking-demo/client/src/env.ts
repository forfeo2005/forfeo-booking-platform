export const ENV = {
  // URL du backend (fallback automatique)
  apiBaseUrl:
    import.meta.env.VITE_API_URL ?? window.location.origin,

  // Identité app (OK côté frontend)
  appId: "forfeo-booking-app",
  ownerOpenId: "admin-forfeo",

  // Flags
  isProduction: import.meta.env.PROD,
};
