#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Script to fetch the current database schema from Supabase
 * This script will:
 * 1. Use Supabase CLI to dump the current schema
 * 2. Save it to the supabase/schema.sql file
 * 3. Generate a timestamped revision
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

function fetchSchemaWithCLI() {
  try {
    console.log('🔄 Fetching schema using Supabase CLI...');
    
    // Check if Supabase CLI is installed
    try {
      execSync('supabase --version', { stdio: 'pipe' });
    } catch (error) {
      throw new Error('Supabase CLI is not installed. Please install it first: npm install -g supabase');
    }

    // Check if project is linked
    try {
      execSync('supabase status', { stdio: 'pipe' });
    } catch (error) {
      console.log('⚠️  Project not linked. Attempting to link...');
      if (!process.env.SUPABASE_PROJECT_REF) {
        throw new Error('SUPABASE_PROJECT_REF environment variable is required for linking');
      }
      execSync(`supabase link --project-ref ${process.env.SUPABASE_PROJECT_REF}`, { stdio: 'inherit' });
    }

    // Fetch the schema
    const schemaOutput = execSync('supabase db dump --schema-only', { 
      encoding: 'utf8',
      cwd: SCHEMA_DIR
    });

    return schemaOutput;
  } catch (error) {
    console.error('❌ Failed to fetch schema with CLI:', error.message);
    return null;
  }
}

function fetchSchemaWithDirectConnection() {
  try {
    console.log('🔄 Attempting direct database connection...');
    
    if (!process.env.DATABASE_URL && !process.env.SUPABASE_DB_CONNECTION_STRING) {
      throw new Error('DATABASE_URL or SUPABASE_DB_CONNECTION_STRING environment variable is required');
    }

    const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_CONNECTION_STRING;
    
    // Use pg_dump if available
    const schemaOutput = execSync(`pg_dump "${dbUrl}" --schema-only --no-owner --no-privileges`, { 
      encoding: 'utf8'
    });

    return schemaOutput;
  } catch (error) {
    console.error('❌ Failed to fetch schema with direct connection:', error.message);
    return null;
  }
}

function saveSchema(schemaContent) {
  const timestamp = generateTimestamp();
  const revisionFile = path.join(REVISIONS_DIR, `revision_${timestamp}.sql`);
  
  // Add header to schema
  const header = `-- Supabase Schema Export
-- Generated: ${new Date().toISOString()}
-- Database: HuddleHub Admin Dashboard
-- Fetched via schema fetch script

`;
  
  const fullSchema = header + schemaContent;
  
  // Save to main schema file
  fs.writeFileSync(SCHEMA_FILE, fullSchema);
  console.log(`✅ Schema saved to: ${SCHEMA_FILE}`);
  
  // Save to revisions
  fs.writeFileSync(revisionFile, fullSchema);
  console.log(`✅ Revision saved to: ${revisionFile}`);
  
  // Update index file
  const indexFile = path.join(REVISIONS_DIR, 'index.txt');
  const indexEntry = `${timestamp}: revision_${timestamp}.sql\n`;
  fs.appendFileSync(indexFile, indexEntry);
  console.log(`✅ Index updated: ${indexFile}`);
}

function main() {
  console.log('🚀 Starting schema fetch...');
  console.log(`📁 Schema directory: ${SCHEMA_DIR}`);
  
  let schemaContent = null;
  
  // Try CLI first
  schemaContent = fetchSchemaWithCLI();
  
  // Fallback to direct connection
  if (!schemaContent) {
    schemaContent = fetchSchemaWithDirectConnection();
  }
  
  if (!schemaContent) {
    console.error('❌ Failed to fetch schema using both methods');
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Install Supabase CLI: npm install -g supabase');
    console.log('2. Link your project: supabase link --project-ref YOUR_PROJECT_REF');
    console.log('3. Set DATABASE_URL or SUPABASE_DB_CONNECTION_STRING environment variable');
    console.log('4. Ensure you have pg_dump installed for direct connection');
    process.exit(1);
  }
  
  saveSchema(schemaContent);
  console.log('\n🎉 Schema fetch completed successfully!');
}

if (require.main === module) {
  main();
}

module.exports = { fetchSchemaWithCLI, fetchSchemaWithDirectConnection, saveSchema };

