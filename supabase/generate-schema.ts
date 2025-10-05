import postgres from "postgres";
import { writeFileSync } from "fs";
import { join } from "path";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

async function generateSchema() {
  console.log("📊 Generating Supabase schema...");
  
  const supabaseClient = postgres(process.env.SUPABASE_DB_CONNECTION_STRING!, { 
    prepare: false, 
    ssl: 'require',
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10
  });

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const revisionTimestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
    
    console.log("Fetching table schemas...");
    
    const tables = await supabaseClient`
      SELECT 
        table_name,
        table_schema
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name`;
    
    let schemaSQL = `-- Supabase Schema Export
-- Generated: ${new Date().toISOString()}
-- Database: QEB Elite Admin Dashboard

`;

    for (const table of tables) {
      console.log(`  📋 Exporting table: ${table.table_name}`);
      
      const columns = await supabaseClient`
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          column_default,
          is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = ${table.table_name}
        ORDER BY ordinal_position`;
      
      schemaSQL += `-- Table: ${table.table_name}\n`;
      schemaSQL += `CREATE TABLE IF NOT EXISTS ${table.table_name} (\n`;
      
      const columnDefs = columns.map((col: any) => {
        let def = `  ${col.column_name} ${col.data_type}`;
        
        if (col.character_maximum_length) {
          def += `(${col.character_maximum_length})`;
        }
        
        if (col.column_default) {
          def += ` DEFAULT ${col.column_default}`;
        }
        
        if (col.is_nullable === 'NO') {
          def += ' NOT NULL';
        }
        
        return def;
      });
      
      schemaSQL += columnDefs.join(',\n');
      schemaSQL += `\n);\n\n`;
    }

    console.log("Fetching storage buckets...");
    
    const buckets = await supabaseClient`
      SELECT id, name, public
      FROM storage.buckets`;
    
    if (buckets.length > 0) {
      schemaSQL += `-- Storage Buckets\n`;
      for (const bucket of buckets) {
        schemaSQL += `-- Bucket: ${bucket.name} (${bucket.public ? 'public' : 'private'})\n`;
        schemaSQL += `INSERT INTO storage.buckets (id, name, public)\n`;
        schemaSQL += `VALUES ('${bucket.id}', '${bucket.name}', ${bucket.public})\n`;
        schemaSQL += `ON CONFLICT (id) DO NOTHING;\n\n`;
      }
    }

    console.log("Fetching storage policies...");
    
    const policies = await supabaseClient`
      SELECT 
        policyname,
        tablename,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE schemaname = 'storage'`;
    
    if (policies.length > 0) {
      schemaSQL += `-- Storage Policies\n`;
      for (const policy of policies) {
        schemaSQL += `-- Policy: ${policy.policyname} on ${policy.tablename}\n`;
        const command = policy.cmd === '*' ? 'ALL' : policy.cmd;
        schemaSQL += `CREATE POLICY IF NOT EXISTS "${policy.policyname}"\n`;
        schemaSQL += `ON storage.${policy.tablename} FOR ${command}\n`;
        if (policy.qual) {
          schemaSQL += `USING (${policy.qual})\n`;
        }
        if (policy.with_check) {
          schemaSQL += `WITH CHECK (${policy.with_check})\n`;
        }
        schemaSQL += `;\n\n`;
      }
    }

    const schemaPath = join(process.cwd(), 'supabase', 'schema.sql');
    writeFileSync(schemaPath, schemaSQL);
    console.log(`✅ Schema saved to: ${schemaPath}`);

    const revisionPath = join(process.cwd(), 'supabase', 'revisions', `revision_${revisionTimestamp}.sql`);
    writeFileSync(revisionPath, schemaSQL);
    console.log(`✅ Revision saved to: ${revisionPath}`);

    const revisionIndex = join(process.cwd(), 'supabase', 'revisions', 'index.txt');
    const revisionEntry = `${revisionTimestamp} - Schema revision\n`;
    
    try {
      const { readFileSync } = await import('fs');
      const existing = readFileSync(revisionIndex, 'utf8');
      writeFileSync(revisionIndex, existing + revisionEntry);
    } catch {
      writeFileSync(revisionIndex, revisionEntry);
    }
    
    console.log(`✅ Revision logged to index`);
    console.log(`\n📦 Summary:`);
    console.log(`   Tables exported: ${tables.length}`);
    console.log(`   Storage buckets: ${buckets.length}`);
    console.log(`   Storage policies: ${policies.length}`);
    
  } catch (error) {
    console.error("❌ Failed:", error);
    throw error;
  } finally {
    await supabaseClient.end();
  }
}

generateSchema();
