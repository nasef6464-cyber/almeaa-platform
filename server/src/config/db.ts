import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectToMongo() {
  if (!env.MONGODB_URI) {
    console.warn("MONGODB_URI not set — skipping MongoDB connection");
    return;
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI);
  console.log("MongoDB connected");
}

export async function connectToDatabase() {
  if (env.USE_POSTGRES && env.DATABASE_URL) {
    console.log("Using PostgreSQL (Supabase)");
    // PostgreSQL connection handled lazily via drizzle in db/connection.ts
    return;
  }

  await connectToMongo();
}
