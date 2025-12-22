import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  // On pointe maintenant sur le bon fichier que vous modifiez
  schema: "./shared/schema.ts",
  out: "./drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
