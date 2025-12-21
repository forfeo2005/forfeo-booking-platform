import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// ⚠️ Chemin depuis server/_core/db.ts -> drizzle/schema.ts
import * as schema from "../../drizzle/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL manquant dans les variables d'environnement.");
}

// Railway/Render/etc. utilisent souvent SSL en prod
const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

export const db = drizzle(pool, { schema });
