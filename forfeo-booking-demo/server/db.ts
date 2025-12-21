import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";

// ⚠️ NE PAS importer migrate en prod
// import { migrate } from "drizzle-orm/mysql2/migrator";

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL!,
});

export const db = drizzle(connection, {
  schema,
  mode: "default",
});

/**
 * ⚠️ IMPORTANT
 * Les migrations Drizzle sont DÉSACTIVÉES en production
 * pour éviter les DROP TABLE automatiques.
 *
 * Si tu veux migrer :
 * → fais-le en local / staging seulement
 */
// if (process.env.NODE_ENV !== "production") {
//   await migrate(db, { migrationsFolder: "drizzle" });
// }
