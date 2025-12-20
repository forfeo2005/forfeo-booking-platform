import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];

export default defineConfig({
  // 👇 C'EST ICI QUE LA MAGIE OPÈRE : ON FORCE LES ADRESSES
  define: {
    "process.env.OAUTH_SERVER_URL": JSON.stringify("https://forfeo-booking-platform-production.up.railway.app"),
    "process.env.BUILT_IN_FORGE_API_URL": JSON.stringify("https://api.forfeo.com"),
    "process.env.OWNER_OPEN_ID": JSON.stringify("admin-forfeo"),
    "process.env.VITE_APP_ID": JSON.stringify("forfeo-booking-app"),
    "process.env.NODE_ENV": JSON.stringify("production"),
    // Sécurité pour éviter les crashs sur les variables optionnelles
    "process.env.BUILT_IN_FORGE_API_KEY": JSON.stringify(""),
    "process.env.JWT_SECRET": JSON.stringify("ignore-me-frontend"),
    "process.env.DATABASE_URL": JSON.stringify("ignore-me-frontend"),
  },

  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
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
    fs: {
      strict: false,
    },
  },
});
