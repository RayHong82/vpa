#!/bin/bash

# Test script for /api/chat endpoint
# Usage: ./scripts/test-chat-api.sh

BASE_URL="${1:-http://localhost:3000}"

echo "Testing Chat API at $BASE_URL"
echo "================================"
echo ""

# Test 1: Basic chat request
echo "Test 1: Basic chat request"
echo "---------------------------"
curl -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, what can you help me with?"}
    ],
    "mode": "client"
  }' \
  --no-buffer \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s || echo "Request failed"
echo ""

# Test 2: Policy-related query
echo "Test 2: Policy-related query"
echo "---------------------------"
curl -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What are the ABSD rates for Singapore citizens?"}
    ],
    "mode": "client"
  }' \
  --no-buffer \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s || echo "Request failed"
echo ""

# Test 3: Query with URL (should trigger scraping)
echo "Test 3: Query with government website URL"
echo "---------------------------"
curl -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What are the HDB eligibility requirements? https://www.hdb.gov.sg/residential/buying-a-flat/new/eligibility/income-ceiling"}
    ],
    "mode": "client"
  }' \
  --no-buffer \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s || echo "Request failed"
echo ""

echo "Tests complete!"
echo ""
echo "Note: These are streaming responses. You should see text appearing gradually."
echo "Check the response headers for X-Sources to see citation information."

