import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/src/db/schema/index.ts",
  out: "./server/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
