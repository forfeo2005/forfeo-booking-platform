import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];

export default defineConfig({
  // ON DÉFINIT LES VARIABLES AU CAS OÙ LE FICHIER ENV.TS NE SUFFIRAIT PAS
  define: {
    "process.env.OAUTH_SERVER_URL": JSON.stringify("https://forfeo-booking-platform-production.up.railway.app"),
    "process.env.BUILT_IN_FORGE_API_URL": JSON.stringify("https://api.forfeo.com"),
    "process.env.OWNER_OPEN_ID": JSON.stringify("admin-forfeo"),
    "process.env.VITE_APP_ID": JSON.stringify("forfeo-booking-app"),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"), // Si shared n'existe pas, ça ne plantera pas le build
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: ["all"],
    fs: { strict: false },
  },
});
