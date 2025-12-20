export const ENV = {
  // --- CONFIGURATION PUBLIQUE (Corrigée "en dur" pour éviter le crash) ---

  // L'adresse officielle de votre application sur Railway
  oAuthServerUrl: "https://forfeo-booking-platform-production.up.railway.app",

  // L'adresse de l'API Forge
  forgeApiUrl: "https://api.forfeo.com",
  
  // Clé API (Laisser vide côté client par sécurité)
  forgeApiKey: "", 

  // Vos identifiants de projet Forfeo
  appId: "forfeo-booking-app",
  ownerOpenId: "admin-forfeo",

  // --- CONFIGURATION SYSTÈME ---
  
  // Secret pour les cookies (On garde la variable ou une valeur par défaut pour éviter les erreurs)
  cookieSecret: process.env.JWT_SECRET || "default_secret_placeholder",
  
  // URL de la base de données (Gérée par le serveur, on laisse process.env)
  databaseUrl: process.env.DATABASE_URL || "",

  // On force le mode production pour optimiser le site
  isProduction: true,
};
