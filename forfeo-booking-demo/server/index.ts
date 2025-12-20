import express from "express";
import cookieParser from "cookie-parser";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import { appRouter } from "./routers";
import { createContext } from "./context";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  /* -------------------------------------------------
     MIDDLEWARES (IMPORTANT)
  ------------------------------------------------- */
  app.use(cookieParser());
  app.use(express.json());

  /* -------------------------------------------------
     tRPC API (DOIT ÊTRE AVANT LE FRONTEND)
  ------------------------------------------------- */
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  /* -------------------------------------------------
     STATIC FRONTEND FILES
  ------------------------------------------------- */
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  /* -------------------------------------------------
     FRONTEND ROUTING FALLBACK
  ------------------------------------------------- */
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);
