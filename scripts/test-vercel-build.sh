#!/bin/bash

# Test script to simulate Vercel build environment

echo "Testing Vercel build simulation..."
echo "=================================="
echo ""

# Clean build
echo "Cleaning previous build..."
rm -rf .next node_modules/.cache

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Run build
echo "Running build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi

