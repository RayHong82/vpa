#!/bin/bash

# Quick start script with Node.js version check

echo "🚀 Starting VPA Webapp"
echo "======================"
echo ""

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check Node.js version
CURRENT_NODE=$(node --version 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$CURRENT_NODE" ] || [ "$CURRENT_NODE" -lt 18 ]; then
    echo "⚠️  Node.js version is too old (need 18+)"
    echo "Installing Node.js 20..."
    nvm install 20
    nvm use 20
fi

echo "Node.js version: $(node --version)"
echo ""

# Start the server
echo "Starting development server..."
npm run dev

