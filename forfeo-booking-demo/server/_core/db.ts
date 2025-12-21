import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

// Singleton (évite de recréer un pool à chaque requête)
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;

  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  if (!url) return null; // mode démo si pas de DB

  const pool = mysql.createPool(url);
  _db = drizzle(pool);

  return _db;
}
