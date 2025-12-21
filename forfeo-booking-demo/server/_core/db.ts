import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

// Si tu as un fichier schema Drizzle exporté, tu peux le passer ici.
// Exemple : import * as schema from "../drizzle/schema";
export function makeDb() {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;

  if (!url) {
    // On laisse l’app démarrer même sans DB (mode démo)
    return null;
  }

  const pool = mysql.createPool(url);

  // Optionnel: drizzle(pool, { schema })
  const db = drizzle(pool);

  return db;
}

export type AppDb = ReturnType<typeof makeDb>;
