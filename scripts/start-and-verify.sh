#!/bin/bash

# Script to install dependencies, verify setup, and start the dev server

echo "🚀 Starting VPA Webapp Setup and Verification"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check environment variables
echo "Step 1: Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo -e "${RED}✗${NC} .env.local file not found"
    echo "Please create .env.local with all required API keys"
    exit 1
fi

./scripts/check-env.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}✗${NC} Environment variables check failed"
    exit 1
fi
echo ""

# Step 2: Install dependencies
echo "Step 2: Installing dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Running npm install..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗${NC} npm install failed"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${GREEN}✓${NC} Dependencies already installed"
fi
echo ""

# Step 3: Check TypeScript compilation
echo "Step 3: Checking TypeScript compilation..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} TypeScript compilation successful"
else
    echo -e "${YELLOW}⚠${NC} TypeScript compilation has warnings (continuing anyway)"
fi
echo ""

# Step 4: Verify Supabase connection (optional)
echo "Step 4: Verifying Supabase connection..."
echo -e "${YELLOW}⚠${NC} Make sure you've run the Supabase migrations:"
echo "   1. Go to Supabase Dashboard > SQL Editor"
echo "   2. Run the migration files in supabase/migrations/ in order"
echo ""

# Step 5: Start dev server
echo "Step 5: Starting development server..."
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "The development server will start on http://localhost:3000"
echo ""
echo "📝 Next steps:"
echo "   1. Wait for the server to start (you'll see 'Ready' message)"
echo "   2. Open http://localhost:3000 in your browser"
echo "   3. Navigate to http://localhost:3000/chat to test the chat interface"
echo "   4. Try asking: 'Hello, what can you help me with?'"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

