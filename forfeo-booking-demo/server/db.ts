import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
// CORRECTION ICI : On pointe vers le dossier shared, pas drizzle
import * as schema from "../shared/schema";

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL!,
});

export const db = drizzle(connection, {
  schema,
  mode: "default",
});