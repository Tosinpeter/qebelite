# Supabase Schema Management

This directory contains the database schema and revision history for the QEB Elite Admin Dashboard.

## Files

- `schema.sql` - Current complete database schema (tables, storage buckets, and policies)
- `migrations/` - Forward and rollback migrations (see below)
- `generate-schema.ts` - Script to generate schema exports and revisions
- `revisions/` - Directory containing timestamped schema revisions
- `revisions/index.txt` - Log of all schema revisions

## Migrations (Up / Down)

Migrations that create or change tables use paired files:

- **`.up.sql`** – Apply the change (e.g. `CREATE TABLE`). Run this when deploying or updating the schema.
- **`.down.sql`** – Revert the change (e.g. `DROP TABLE`). Run this when you need to roll back.

**Apply (migrate up):** run the `.up.sql` file(s) in the Supabase SQL Editor or via `supabase db push` (ensure only the up migrations you want are in the migration path).

**Revert (migrate down):** run the corresponding `.down.sql` file in the SQL Editor to undo that migration.

## Generating Schema and Revisions

To generate a new schema export and create a revision:

```bash
npm run db:export
```

Or run directly:

```bash
NODE_ENV=development tsx supabase/generate-schema.ts
```

This will:
1. Export the current database schema to `schema.sql`
2. Create a timestamped revision file in `revisions/`
3. Log the revision in `revisions/index.txt`

## What Gets Exported

- All public tables with their columns and data types
- Storage buckets configuration
- Row-Level Security (RLS) policies
- Table constraints and defaults

## When to Generate Revisions

Generate a new revision whenever you:
- Add or modify database tables
- Change column types or constraints
- Add or update storage buckets
- Modify RLS policies
- Make any structural database changes

## Revision File Format

Revision files are named: `revision_YYYY-MM-DD_HH-MM-SS-MMMZ.sql`

Example: `revision_2025-10-05_11-26-45-590Z.sql`
