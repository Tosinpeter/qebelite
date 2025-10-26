#!/bin/bash

# Script to fetch database schema from Supabase
# Usage: ./fetch-schema.sh [method]
# Methods: simple (default), cli

set -e

METHOD=${1:-simple}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Fetching database schema from Supabase..."
echo "📁 Working directory: $SCRIPT_DIR"
echo "🔧 Method: $METHOD"

# Check if .env file exists
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo "⚠️  Warning: .env file not found. Make sure your environment variables are set."
    echo "💡 You can copy env.example to .env and fill in your Supabase credentials."
fi

# Check if node_modules exists
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run the appropriate script
case $METHOD in
    "simple")
        echo "🔄 Using Supabase client method..."
        npm run schema:fetch
        ;;
    "cli")
        echo "🔄 Using Supabase CLI method..."
        npm run schema:fetch-cli
        ;;
    *)
        echo "❌ Unknown method: $METHOD"
        echo "💡 Available methods: simple, cli"
        exit 1
        ;;
esac

echo ""
echo "✅ Schema fetch completed!"
echo "📄 Schema saved to: supabase/schema.sql"
echo "📁 Revisions saved to: supabase/revisions/"

