#!/bin/bash

echo "🚀 Setting up Supabase Database..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and fill in your Supabase credentials."
    exit 1
fi

# Load environment variables
source .env

# Check if Supabase URL and key are set
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ Error: VITE_SUPABASE_URL not set in .env"
    exit 1
fi

echo "📋 Supabase Project URL: $VITE_SUPABASE_URL"
echo ""

# Extract project ref from URL
PROJECT_REF=$(echo $VITE_SUPABASE_URL | sed -E 's|https://([^.]+)\.supabase\.co|\1|')

echo "🔗 Linking to Supabase project: $PROJECT_REF"
echo ""

# Link to Supabase project
supabase link --project-ref $PROJECT_REF

if [ $? -ne 0 ]; then
    echo "❌ Failed to link to Supabase project"
    echo "You may need to run: supabase login"
    exit 1
fi

echo ""
echo "📤 Pushing database migrations..."
supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup complete!"
    echo ""
    echo "Your package_licenses table has been created with:"
    echo "  - Unique constraint on (package_name, package_version)"
    echo "  - Indexes for fast lookups"
    echo "  - Row Level Security policies"
    echo "  - Automatic timestamp updates"
else
    echo ""
    echo "❌ Failed to push migrations"
    echo ""
    echo "Alternative: Copy the SQL from supabase/schema.sql and run it manually in Supabase Dashboard"
fi
