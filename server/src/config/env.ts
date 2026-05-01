import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanString = z.preprocess((val) => {
  if (typeof val === "string") return val.toLowerCase() === "true" || val === "1";
  return Boolean(val);
}, z.boolean());

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  MONGODB_URI: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  USE_POSTGRES: booleanString.default(false),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  DEV_LOCAL_ADMIN_BYPASS: booleanString.default(false),
  ADMIN_NAME: z.string().default("Platform Admin"),
  ADMIN_EMAIL: z.string().email().default("admin@example.com"),
  ADMIN_PASSWORD: z.string().min(6).default("change-me"),
  AI_PROVIDER: z.enum(["gemini", "ollama", "lmstudio", "deepseek", "none"]).optional(),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().default(15000),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  DEEPSEEK_API_KEY: z.string().optional(),
  DEEPSEEK_MODEL: z.string().default("deepseek-chat"),
  DEEPSEEK_BASE_URL: z.string().default("https://api.deepseek.com/v1"),
  OLLAMA_BASE_URL: z.string().default("http://127.0.0.1:11434"),
  OLLAMA_MODEL: z.string().default("gemma3:4b"),
  LM_STUDIO_BASE_URL: z.string().default("http://127.0.0.1:1234/v1"),
  LM_STUDIO_MODEL: z.string().default("local-model"),
});

export const env = envSchema.parse(process.env);
