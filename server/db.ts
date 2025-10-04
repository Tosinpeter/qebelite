import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const databaseUrl = process.env.SUPABASE_DB_CONNECTION_STRING;

if (!databaseUrl) {
  throw new Error(
    "SUPABASE_DB_CONNECTION_STRING must be set. Did you forget to add it to secrets?",
  );
}

export const client = postgres(databaseUrl, { 
  prepare: false,
  ssl: false
});

export const db = drizzle(client, { schema });
