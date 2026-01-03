#!/bin/bash

# Script to apply storage bucket migrations to Supabase
# This fixes the "new row violates row-level security policy" error

echo "🚀 Applying Storage Bucket Migrations..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found."
    echo ""
    echo "Please install it first:"
    echo "  npm install -g supabase"
    echo ""
    echo "Or apply migrations manually through the Supabase Dashboard:"
    echo "  1. Go to https://supabase.com/dashboard"
    echo "  2. Navigate to SQL Editor"
    echo "  3. Run the SQL files in migrations/ folder"
    echo ""
    exit 1
fi

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Project not linked to Supabase."
    echo ""
    echo "Please link your project first:"
    echo "  supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    read -p "Enter your project ref: " PROJECT_REF
    supabase link --project-ref "$PROJECT_REF"
fi

echo "📦 Pushing migrations to Supabase..."
supabase db push

echo ""
echo "✅ Migrations applied successfully!"
echo ""
echo "You can now upload recipe images without RLS errors."

