#!/bin/bash

# Script to help get Supabase configuration
# Based on project: awewnxklyvtshyfkuvmd

echo "🔍 Supabase Configuration Helper"
echo "=================================="
echo ""
echo "Project ID: awewnxklyvtshyfkuvmd"
echo ""

echo "📋 Step-by-Step Instructions:"
echo "-----------------------------"
echo ""
echo "1. Go to your Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/awewnxklyvtshyfkuvmd"
echo ""
echo "2. Click on 'Settings' (⚙️ icon) in the left sidebar"
echo ""
echo "3. Click on 'API' in the settings menu"
echo ""
echo "4. You will see two important values:"
echo ""
echo "   a) Project URL:"
echo "      Look for 'Project URL' or 'API URL'"
echo "      Format: https://[project-ref].supabase.co"
echo "      This is your NEXT_PUBLIC_SUPABASE_URL"
echo ""
echo "   b) anon/public key:"
echo "      Look for 'Project API keys' section"
echo "      Find the 'anon' or 'public' key"
echo "      This is your NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "5. Copy these values to your .env.local file:"
echo ""
echo "   NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo ""

# Try to infer the URL (common pattern)
PROJECT_REF="awewnxklyvtshyfkuvmd"
INFERRED_URL="https://${PROJECT_REF}.supabase.co"

echo "💡 Based on your project ID, your URL might be:"
echo "   $INFERRED_URL"
echo ""
echo "⚠️  However, please verify this in your Supabase Dashboard"
echo "   as the project reference might be different."
echo ""
echo "📝 Quick Access Links:"
echo "   - Dashboard: https://supabase.com/dashboard/project/awewnxklyvtshyfkuvmd"
echo "   - Settings > API: https://supabase.com/dashboard/project/awewnxklyvtshyfkuvmd/settings/api"
echo ""

