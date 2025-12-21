import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../../drizzle/schema";

const url = process.env.MYSQL_URL || process.env.DATABASE_URL;

if (!url) {
  throw new Error("MYSQL_URL ou DATABASE_URL manquant dans Railway.");
}

const pool = mysql.createPool(url);

export const db = drizzle(pool, { schema, mode: "default" });
