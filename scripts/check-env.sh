#!/bin/bash

# Script to check if all required environment variables are set
# Usage: ./scripts/check-env.sh

echo "🔍 Checking environment variables..."
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}✗${NC} .env.local file not found"
    echo ""
    echo "Please create .env.local file with the following variables:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - OPENAI_API_KEY"
    echo "  - ANTHROPIC_API_KEY"
    echo "  - JINA_API_KEY"
    echo ""
    echo "You can copy .env.local.example as a template:"
    echo "  cp .env.local.example .env.local"
    exit 1
fi

echo -e "${GREEN}✓${NC} .env.local file exists"
echo ""

# Load environment variables
set -a
source .env.local
set +a

# Check each variable
MISSING=0

check_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}✗${NC} $var_name is not set"
        MISSING=$((MISSING + 1))
    else
        # Show first and last few characters for security
        local masked=$(echo "$var_value" | sed 's/\(.\{4\}\).*\(.\{4\}\)/\1...\2/')
        echo -e "${GREEN}✓${NC} $var_name is set ($masked)"
    fi
}

echo "Checking required variables:"
echo "---------------------------"
check_var "NEXT_PUBLIC_SUPABASE_URL"
check_var "NEXT_PUBLIC_SUPABASE_ANON_KEY"
check_var "OPENAI_API_KEY"
check_var "ANTHROPIC_API_KEY"
check_var "JINA_API_KEY"

echo ""
echo "===================================="

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ All environment variables are set!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Make sure you've run the Supabase migrations"
    echo "2. Start the dev server: npm run dev"
    echo "3. Visit http://localhost:3000/chat to test"
    exit 0
else
    echo -e "${RED}❌ Missing $MISSING environment variable(s)${NC}"
    echo ""
    echo "Please check ENV_SETUP_GUIDE.md for instructions on how to get each API key."
    exit 1
fi

