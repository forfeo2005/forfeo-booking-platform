import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "mysql", // <--- IMPORTANT : on passe de 'pg' à 'mysql'
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
