import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@shared/schema";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

async function migrateToSupabase() {
  console.log("Starting migration to Supabase...");
  
  const neonClient = postgres(process.env.DATABASE_URL!, { 
    prepare: false, 
    ssl: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10
  });
  const neonDb = drizzle(neonClient, { schema });

  const supabaseClient = postgres(process.env.SUPABASE_DB_CONNECTION_STRING!, { 
    prepare: false, 
    ssl: 'require',
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10
  });
  const supabaseDb = drizzle(supabaseClient, { schema });

  try {
    console.log("Creating home_banners table in Supabase...");
    
    await supabaseClient`
      CREATE TABLE IF NOT EXISTS home_banners (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        position INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        redirect_url TEXT NOT NULL
      )`;
    
    console.log("✅ Table created successfully.");
    
    console.log("\nMigrating existing banners from Neon...");
    const banners = await neonDb.select().from(schema.homeBanners);
    console.log(`Found ${banners.length} banners to migrate`);
    
    if (banners.length > 0) {
      for (const banner of banners) {
        await supabaseDb.insert(schema.homeBanners).values(banner).onConflictDoNothing();
        console.log(`  ✓ Migrated banner at position ${banner.position}`);
      }
    }
    
    console.log("\nAdding 5th banner...");
    const fifthBanner = {
      position: 4,
      imageUrl: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2",
      redirectUrl: "https://qebelite.com/join"
    };
    
    await supabaseDb.insert(schema.homeBanners).values(fifthBanner).onConflictDoNothing();
    console.log("  ✓ Added 5th banner");
    
    const finalBanners = await supabaseDb.select().from(schema.homeBanners);
    console.log(`\n✅ Migration completed! Total banners in Supabase: ${finalBanners.length}`);
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await neonClient.end();
    await supabaseClient.end();
  }
}

migrateToSupabase();
