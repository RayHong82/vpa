#!/bin/bash

# Vercel 部署测试脚本
# 使用方法: ./scripts/test-vercel-deployment.sh [VERCEL_URL]

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取 Vercel URL
if [ -z "$1" ]; then
  echo -e "${YELLOW}⚠️  Please provide your Vercel URL${NC}"
  echo "Usage: ./scripts/test-vercel-deployment.sh https://your-project.vercel.app"
  exit 1
fi

VERCEL_URL=$1

echo "🧪 Testing Vercel Deployment..."
echo "================================"
echo "URL: $VERCEL_URL"
echo ""

# 计数器
PASSED=0
FAILED=0

# 测试函数
test_endpoint() {
  local name=$1
  local url=$2
  local method=${3:-GET}
  local data=$4
  
  if [ "$method" = "POST" ]; then
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$url" \
      -H "Content-Type: application/json" \
      -d "$data")
  else
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  fi
  
  if [ "$STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅${NC} $name: OK (Status: $STATUS)"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}❌${NC} $name: Failed (Status: $STATUS)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# 测试 1: 首页
echo "1. Testing homepage..."
test_endpoint "Homepage" "$VERCEL_URL"

# 测试 2: 聊天页面
echo "2. Testing chat page..."
test_endpoint "Chat page" "$VERCEL_URL/chat"

# 测试 3: 规划器页面
echo "3. Testing planner page..."
test_endpoint "Planner page" "$VERCEL_URL/planner"

# 测试 4: 设置页面
echo "4. Testing settings page..."
test_endpoint "Settings page" "$VERCEL_URL/settings"

# 测试 5: Chat API
echo "5. Testing chat API..."
test_endpoint "Chat API" "$VERCEL_URL/api/chat" "POST" '{"messages":[{"role":"user","content":"test"}],"mode":"client"}'

# 测试 6: Manifest
echo "6. Testing manifest..."
test_endpoint "Manifest" "$VERCEL_URL/manifest.json"

echo ""
echo "================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}Failed: $FAILED${NC}"
else
  echo -e "${GREEN}Failed: $FAILED${NC}"
fi
echo "================================"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please check the errors above.${NC}"
  exit 1
fi

