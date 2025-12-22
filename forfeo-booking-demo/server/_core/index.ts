import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser"; // <--- AJOUT IMPORTANT
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
// import { registerOAuthRoutes } from "./oauth"; // <--- SUPPRIMÉ (On remplace par Auth interne)
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();

  // ✅ IMPORTANT sur Railway/Reverse Proxy : permet à Express de lire correctement https + IP
  // (sinon cookies secure/samesite peuvent mal se comporter)
  app.set("trust proxy", 1);

  const server = createServer(app);

  // Initialize Socket.io for real-time chat
  const { initializeSocketIO } = await import("../chat/socket");
  initializeSocketIO(server);

  // Stripe webhook MUST be registered BEFORE express.json() middleware
  // to allow raw body access for signature verification
  const { handleStripeWebhook } = await import("../stripe/webhook");
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
  );

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // ✅ AJOUT COOKIE PARSER ICI
  app.use(cookieParser());

  // OAuth callback under /api/oauth/callback + /api/oauth/login + /api/oauth/logout
  // registerOAuthRoutes(app); // <--- DÉSACTIVÉ (Remplacé par authRouter tRPC)

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000", 10);
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
