#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Simple script to fetch database schema information from Supabase
 * This script queries the information_schema to get table structures
 */

const SCHEMA_DIR = path.join(__dirname, '..', 'supabase');
const SCHEMA_FILE = path.join(SCHEMA_DIR, 'schema.sql');
const REVISIONS_DIR = path.join(SCHEMA_DIR, 'revisions');

// Ensure directories exist
if (!fs.existsSync(SCHEMA_DIR)) {
  fs.mkdirSync(SCHEMA_DIR, { recursive: true });
}
if (!fs.existsSync(REVISIONS_DIR)) {
  fs.mkdirSync(REVISIONS_DIR, { recursive: true });
}

function generateTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function fetchSchemaWithSupabaseClient() {
  try {
    console.log('🔄 Connecting to Supabase...');
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are required');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Query to get all tables and their columns
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      throw new Error(`Failed to fetch tables: ${tablesError.message}`);
    }

    console.log(`📋 Found ${tables.length} tables`);

    let schemaContent = `-- Supabase Schema Export
-- Generated: ${new Date().toISOString()}
-- Database: HuddleHub Admin Dashboard
-- Fetched via Supabase client

`;

    // Get columns for each table
    for (const table of tables) {
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default, character_maximum_length')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name)
        .order('ordinal_position');

      if (columnsError) {
        console.warn(`⚠️  Failed to fetch columns for ${table.table_name}: ${columnsError.message}`);
        continue;
      }

      schemaContent += `-- Table: ${table.table_name}\n`;
      schemaContent += `CREATE TABLE IF NOT EXISTS ${table.table_name} (\n`;
      
      const columnDefs = columns.map(col => {
        let def = `  ${col.column_name} ${col.data_type}`;
        
        if (col.character_maximum_length) {
          def += `(${col.character_maximum_length})`;
        }
        
        if (col.is_nullable === 'NO') {
          def += ' NOT NULL';
        }
        
        if (col.column_default) {
          def += ` DEFAULT ${col.column_default}`;
        }
        
        return def;
      });
      
      schemaContent += columnDefs.join(',\n');
      schemaContent += '\n);\n\n';
    }

    // Get storage buckets
    const { data: buckets, error: bucketsError } = await supabase
      .from('storage.buckets')
      .select('*');

    if (!bucketsError && buckets && buckets.length > 0) {
      schemaContent += '-- Storage Buckets\n';
      buckets.forEach(bucket => {
        schemaContent += `-- Bucket: ${bucket.name} (${bucket.public ? 'public' : 'private'})\n`;
        schemaContent += `INSERT INTO storage.buckets (id, name, public)\n`;
        schemaContent += `VALUES ('${bucket.id}', '${bucket.name}', ${bucket.public})\n`;
        schemaContent += `ON CONFLICT (id) DO NOTHING;\n\n`;
      });
    }

    return schemaContent;
  } catch (error) {
    console.error('❌ Failed to fetch schema with Supabase client:', error.message);
    return null;
  }
}

function saveSchema(schemaContent) {
  const timestamp = generateTimestamp();
  const revisionFile = path.join(REVISIONS_DIR, `revision_${timestamp}.sql`);
  
  // Save to main schema file
  fs.writeFileSync(SCHEMA_FILE, schemaContent);
  console.log(`✅ Schema saved to: ${SCHEMA_FILE}`);
  
  // Save to revisions
  fs.writeFileSync(revisionFile, schemaContent);
  console.log(`✅ Revision saved to: ${revisionFile}`);
  
  // Update index file
  const indexFile = path.join(REVISIONS_DIR, 'index.txt');
  const indexEntry = `${timestamp}: revision_${timestamp}.sql\n`;
  fs.appendFileSync(indexFile, indexEntry);
  console.log(`✅ Index updated: ${indexFile}`);
}

async function main() {
  console.log('🚀 Starting schema fetch with Supabase client...');
  console.log(`📁 Schema directory: ${SCHEMA_DIR}`);
  
  const schemaContent = await fetchSchemaWithSupabaseClient();
  
  if (!schemaContent) {
    console.error('❌ Failed to fetch schema');
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
    console.log('2. Ensure your Supabase project is accessible');
    console.log('3. Check your network connection');
    process.exit(1);
  }
  
  saveSchema(schemaContent);
  console.log('\n🎉 Schema fetch completed successfully!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fetchSchemaWithSupabaseClient, saveSchema };

