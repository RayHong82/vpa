#!/bin/bash

# Script to add environment variables to Vercel
# Usage: ./scripts/add-vercel-env.sh

echo "Adding environment variables to Vercel..."
echo "=========================================="
echo ""

# Read from .env.local
source .env.local

# Add each environment variable for all environments
echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "$NEXT_PUBLIC_SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development

echo "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development

echo "Adding OPENAI_API_KEY..."
echo "$OPENAI_API_KEY" | vercel env add OPENAI_API_KEY production preview development

echo "Adding ANTHROPIC_API_KEY..."
echo "$ANTHROPIC_API_KEY" | vercel env add ANTHROPIC_API_KEY production preview development

echo "Adding JINA_API_KEY..."
echo "$JINA_API_KEY" | vercel env add JINA_API_KEY production preview development

echo ""
echo "✅ All environment variables added!"
echo ""
echo "Next step: Run 'vercel --prod' to deploy to production"

