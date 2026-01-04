# Vercel 部署测试方案

## 部署步骤

### 1. 推送代码到 GitHub（如果自动推送失败）

```bash
# 手动推送（如果上面的自动推送失败）
git push origin main
```

### 2. 部署到 Vercel

#### 方法 A: 通过 Vercel Dashboard（推荐）
1. 访问 https://vercel.com
2. 登录你的账号
3. 如果项目已连接，Vercel 会自动检测到新的 commit 并开始部署
4. 如果没有连接，点击 "Add New Project"，选择你的 GitHub 仓库

#### 方法 B: 通过 Vercel CLI
```bash
# 如果还没有安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署到生产环境
vercel --prod
```

## 测试方案

### 阶段 1: 部署验证 ✅

#### 1.1 检查构建状态
- [ ] 访问 Vercel Dashboard
- [ ] 查看最新的部署状态
- [ ] 确认构建成功（绿色 ✅）
- [ ] 检查构建日志，确认没有错误

#### 1.2 验证环境变量
在 Vercel Dashboard 中确认以下环境变量已设置：
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `ANTHROPIC_API_KEY`
- [ ] `JINA_API_KEY` (可选)

### 阶段 2: 基础功能测试 🌐

#### 2.1 首页测试
访问你的 Vercel URL（例如：`https://your-project.vercel.app`）

- [ ] 页面能正常加载
- [ ] 没有控制台错误（打开浏览器开发者工具）
- [ ] 页面布局正常显示
- [ ] 导航栏显示正确

#### 2.2 路由测试
测试各个页面路由：

- [ ] `/` - 首页加载正常
- [ ] `/chat` - 聊天页面加载正常
- [ ] `/planner` - 规划器页面加载正常
- [ ] `/settings` - 设置页面加载正常

### 阶段 3: 核心功能测试 💬

#### 3.1 聊天功能测试

访问 `/chat` 页面：

**测试用例 1: 基础对话**
- [ ] 输入框可见且可用
- [ ] 输入消息："你好"
- [ ] 点击发送按钮
- [ ] 消息显示在聊天界面
- [ ] 收到 AI 回复
- [ ] 回复内容合理

**测试用例 2: 长对话**
- [ ] 发送多条消息
- [ ] 对话历史正确显示
- [ ] 滚动功能正常
- [ ] 消息格式正确

**测试用例 3: 错误处理**
- [ ] 发送空消息（应该被阻止）
- [ ] 网络错误时显示适当提示
- [ ] 加载状态正确显示

#### 3.2 RAG 功能测试

**测试用例 4: 知识库查询**
- [ ] 发送问题："新加坡买房需要什么条件？"
- [ ] 确认 AI 回复引用了知识库内容
- [ ] 检查回复中的引用标记 [1], [2] 等
- [ ] 验证 Sources 部分显示正确

**测试用例 5: 政策查询（如果配置了 Jina）**
- [ ] 发送包含政府网站 URL 的问题
- [ ] 确认系统尝试抓取网页内容
- [ ] 验证回复中包含最新信息

### 阶段 4: API 端点测试 🔌

#### 4.1 Chat API 测试

使用 curl 或 Postman 测试：

```bash
# 替换为你的 Vercel URL
curl -X POST https://your-project.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "测试消息"
      }
    ],
    "mode": "client"
  }'
```

- [ ] API 返回 200 状态码
- [ ] 返回流式响应
- [ ] 响应头包含 `X-Sources`
- [ ] 响应内容合理

#### 4.2 Scrape API 测试（如果配置了 Jina）

```bash
curl "https://your-project.vercel.app/api/scrape?url=https://www.hdb.gov.sg"
```

- [ ] API 返回 200 状态码
- [ ] 返回 JSON 格式数据
- [ ] 包含 `markdown` 字段
- [ ] 包含 `isGovernmentWebsite` 字段

### 阶段 5: 性能测试 ⚡

#### 5.1 加载性能
- [ ] 首页首次加载时间 < 3 秒
- [ ] 聊天页面加载时间 < 2 秒
- [ ] 使用 Lighthouse 测试性能分数 > 80

#### 5.2 响应性能
- [ ] AI 回复延迟 < 10 秒（取决于问题复杂度）
- [ ] 流式响应流畅，无卡顿
- [ ] 多个并发请求处理正常

### 阶段 6: 移动端测试 📱

#### 6.1 响应式设计
- [ ] 在手机浏览器中打开
- [ ] 布局自适应正常
- [ ] 输入框和按钮大小合适
- [ ] 导航栏显示正常

#### 6.2 触摸交互
- [ ] 按钮点击响应正常
- [ ] 输入框聚焦正常
- [ ] 滚动流畅

### 阶段 7: 错误场景测试 🚨

#### 7.1 网络错误
- [ ] 断开网络后发送消息
- [ ] 确认显示适当的错误提示
- [ ] 恢复网络后能重试

#### 7.2 API 错误
- [ ] 模拟 API 返回错误
- [ ] 确认错误处理正确
- [ ] 用户看到友好的错误信息

#### 7.3 环境变量缺失
- [ ] 如果某个环境变量未设置
- [ ] 确认错误信息清晰
- [ ] 不会导致整个应用崩溃

## 测试检查清单

### 部署前 ✅
- [x] 代码已提交到 Git
- [ ] 代码已推送到 GitHub
- [ ] 环境变量已在 Vercel 中配置

### 部署后 ✅
- [ ] 构建成功
- [ ] 所有页面可访问
- [ ] 基础功能正常
- [ ] API 端点正常
- [ ] 移动端正常

### 功能验证 ✅
- [ ] 聊天功能正常
- [ ] RAG 功能正常
- [ ] 错误处理正常
- [ ] 性能可接受

## 快速测试脚本

创建一个测试脚本 `test-vercel-deployment.sh`：

```bash
#!/bin/bash

# 替换为你的 Vercel URL
VERCEL_URL="https://your-project.vercel.app"

echo "🧪 Testing Vercel Deployment..."
echo "================================"
echo ""

# 测试首页
echo "1. Testing homepage..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $VERCEL_URL)
if [ $STATUS -eq 200 ]; then
  echo "✅ Homepage: OK"
else
  echo "❌ Homepage: Failed (Status: $STATUS)"
fi

# 测试聊天页面
echo "2. Testing chat page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $VERCEL_URL/chat)
if [ $STATUS -eq 200 ]; then
  echo "✅ Chat page: OK"
else
  echo "❌ Chat page: Failed (Status: $STATUS)"
fi

# 测试 API
echo "3. Testing chat API..."
API_RESPONSE=$(curl -s -X POST $VERCEL_URL/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}],"mode":"client"}' \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$API_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Chat API: OK"
else
  echo "❌ Chat API: Failed (Status: $HTTP_CODE)"
fi

echo ""
echo "================================"
echo "Test completed!"
```

## 常见问题排查

### 问题 1: 构建失败
**检查**:
- Vercel Dashboard 中的构建日志
- 环境变量是否都已设置
- Node.js 版本是否正确

### 问题 2: 页面加载失败
**检查**:
- 浏览器控制台错误
- 网络请求是否成功
- 环境变量是否正确

### 问题 3: API 返回错误
**检查**:
- API 日志（Vercel Functions 日志）
- 环境变量是否设置
- API 密钥是否有效

### 问题 4: 功能不正常
**检查**:
- 浏览器控制台错误
- 网络请求状态
- 服务端日志

## 测试报告模板

完成测试后，记录结果：

```
部署日期: [日期]
Vercel URL: [URL]
构建状态: [成功/失败]
测试人员: [姓名]

基础功能:
- 首页: [通过/失败]
- 聊天: [通过/失败]
- API: [通过/失败]

发现问题:
1. [问题描述]
2. [问题描述]

建议:
1. [建议]
2. [建议]
```

