#!/bin/bash

echo "🔍 Phase 1 Verification Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
PASSED=0
FAILED=0

check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

echo "1. Checking project structure..."
[ -d "app" ] && check "app/ directory exists"
[ -d "components" ] && check "components/ directory exists"
[ -d "lib" ] && check "lib/ directory exists"
[ -d "supabase/migrations" ] && check "supabase/migrations/ directory exists"
[ -f "package.json" ] && check "package.json exists"
[ -f "tsconfig.json" ] && check "tsconfig.json exists"
[ -f "tailwind.config.ts" ] && check "tailwind.config.ts exists"
[ -f "next.config.ts" ] && check "next.config.ts exists"
echo ""

echo "2. Checking key files..."
[ -f "app/layout.tsx" ] && check "app/layout.tsx exists"
[ -f "app/globals.css" ] && check "app/globals.css exists"
[ -f "components/layout/top-nav.tsx" ] && check "TopNav component exists"
[ -f "components/layout/bottom-dock.tsx" ] && check "BottomDock component exists"
[ -f "lib/supabase/client.ts" ] && check "Supabase client exists"
[ -f "lib/supabase/server.ts" ] && check "Supabase server exists"
echo ""

echo "3. Checking database migrations..."
[ -f "supabase/migrations/20240101000000_initial_schema.sql" ] && check "Initial schema migration exists"
[ -f "supabase/migrations/20240101000001_rls_policies.sql" ] && check "RLS policies migration exists"
[ -f "supabase/migrations/20240101000002_vector_search_function.sql" ] && check "Vector search function migration exists"
echo ""

echo "4. Checking dependencies in package.json..."
grep -q "@supabase/supabase-js" package.json && check "Supabase client in dependencies"
grep -q "framer-motion" package.json && check "Framer Motion in dependencies"
grep -q "lucide-react" package.json && check "Lucide React in dependencies"
grep -q "tailwindcss" package.json && check "Tailwind CSS in dependencies"
echo ""

echo "5. Checking environment variables..."
if [ -f ".env.local" ]; then
    grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && check "NEXT_PUBLIC_SUPABASE_URL is set"
    grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local && check "NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
else
    echo -e "${YELLOW}⚠${NC} .env.local not found (create it with Supabase credentials)"
fi
echo ""

echo "6. Checking if node_modules exists..."
if [ -d "node_modules" ]; then
    check "Dependencies installed (node_modules exists)"
else
    echo -e "${YELLOW}⚠${NC} node_modules not found (run: npm install)"
fi
echo ""

echo "================================"
echo "Summary: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Phase 1 verification complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm install (if not done)"
    echo "2. Create .env.local with Supabase credentials"
    echo "3. Run: npm run dev"
    echo "4. Open http://localhost:3000 and verify UI"
else
    echo -e "${RED}❌ Some checks failed. Please review the errors above.${NC}"
fi

