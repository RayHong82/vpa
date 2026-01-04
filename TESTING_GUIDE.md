# Phase 2 测试指南

本指南将帮助你测试 RAG 检索流水线和 AI 聊天功能。

## 前置准备

### 1. 检查环境变量

确保 `.env.local` 文件包含所有必需的 API 密钥：

```bash
# 检查环境变量文件
cat .env.local
```

应该包含：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `JINA_API_KEY`

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

服务器应该在 http://localhost:3000 启动。

## 测试步骤

### 测试 1: 基础聊天功能

**目标：** 验证 Claude 3.5 Sonnet 流式对话是否正常工作

1. 访问 http://localhost:3000/chat
2. 输入简单问题：`Hello, what can you help me with?`
3. **预期结果：**
   - 消息应该流式显示（逐字出现）
   - 收到 AI 回复
   - 界面响应正常

**如果失败：**
- 检查 `ANTHROPIC_API_KEY` 是否正确
- 查看浏览器控制台和终端错误信息

---

### 测试 2: 向量搜索功能

**目标：** 验证向量数据库搜索是否正常工作

**前提条件：** 需要先在 Supabase 中插入一些测试数据

#### 2.1 准备测试数据

在 Supabase SQL Editor 中运行：

```sql
-- 插入测试知识库数据
INSERT INTO kb_chunks (team_id, content, metadata)
VALUES 
  (
    NULL,
    'ABSD (Additional Buyer''s Stamp Duty) rates for Singapore Citizens: First property: 0%, Second property: 20%, Third and subsequent properties: 30%.',
    '{"type": "internal", "source_url": "https://www.iras.gov.sg/taxes/stamp-duty/for-property/additional-buyers-stamp-duty-(absd)"}'
  ),
  (
    NULL,
    'TDSR (Total Debt Servicing Ratio) limits monthly debt repayments to 55% of gross monthly income for property loans.',
    '{"type": "internal", "source_url": "https://www.mas.gov.sg/regulation/explainers/total-debt-servicing-ratio"}'
  ),
  (
    NULL,
    'MSR (Mortgage Servicing Ratio) applies only to HDB and EC properties, limiting monthly repayments to 30% of gross monthly income.',
    '{"type": "hdb", "source_url": "https://www.hdb.gov.sg/residential/buying-a-flat/new/eligibility/income-ceiling"}'
  );
```

#### 2.2 生成 Embeddings

需要为这些数据生成 embeddings。创建一个临时脚本：

```bash
# 创建测试脚本
cat > scripts/generate-test-embeddings.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '../lib/ai/embeddings'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function main() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // 获取所有没有 embedding 的记录
  const { data: chunks, error } = await supabase
    .from('kb_chunks')
    .select('id, content')
    .is('embedding', null)
  
  if (error) {
    console.error('Error fetching chunks:', error)
    return
  }
  
  console.log(`Found ${chunks?.length || 0} chunks without embeddings`)
  
  for (const chunk of chunks || []) {
    try {
      const embedding = await generateEmbedding(chunk.content)
      
      const { error: updateError } = await supabase
        .from('kb_chunks')
        .update({ embedding })
        .eq('id', chunk.id)
      
      if (updateError) {
        console.error(`Error updating chunk ${chunk.id}:`, updateError)
      } else {
        console.log(`✓ Generated embedding for chunk ${chunk.id}`)
      }
    } catch (error) {
      console.error(`Error processing chunk ${chunk.id}:`, error)
    }
  }
}

main()
EOF
```

运行脚本（需要配置 tsx 或 ts-node）：
```bash
npx tsx scripts/generate-test-embeddings.ts
```

#### 2.3 测试向量搜索

在聊天界面提问：
```
What are the ABSD rates for Singapore citizens?
```

**预期结果：**
- AI 回答应该包含 ABSD 相关信息
- 底部应该显示来源（Sources）
- 来源应该包含知识库中的内容

---

### 测试 3: 网页抓取功能

**目标：** 验证 Jina Reader 网页抓取是否正常工作

#### 3.1 测试 /api/scrape 端点

在浏览器或使用 curl：

```bash
curl "http://localhost:3000/api/scrape?url=https://www.hdb.gov.sg/residential/buying-a-flat/new/eligibility/income-ceiling"
```

**预期结果：**
- 返回 JSON，包含 `markdown` 字段
- `isGovernmentWebsite` 应该为 `true`

#### 3.2 测试聊天中的自动抓取

在聊天界面提问（包含政府网站 URL）：
```
What are the latest HDB eligibility requirements? https://www.hdb.gov.sg/residential/buying-a-flat/new/eligibility/income-ceiling
```

**预期结果：**
- AI 回答应该包含从网页抓取的内容
- 底部 Sources 应该显示抓取的 URL
- 来源标记为 "(Live)"

---

### 测试 4: 政策检测

**目标：** 验证政策关键词检测是否正常工作

在聊天界面提问：
```
What are the procedures for buying a HDB flat?
```

**预期结果：**
- 系统应该检测到 "procedures" 关键词
- 如果查询中包含政府网站 URL，应该触发抓取

---

### 测试 5: 引用系统

**目标：** 验证引用和来源显示是否正常

提问任何会触发 RAG 的问题，然后检查：

**预期结果：**
- AI 回答中包含 [1], [2] 等引用标记
- 聊天界面底部显示 "Sources" 区域
- 每个来源都有编号和 URL（如果有）
- 可以点击 URL 打开原网页

---

### 测试 6: 模式切换

**目标：** 验证 agent/client 模式是否正常工作

修改 `app/chat/page.tsx` 中的 mode：

```typescript
// 测试 agent 模式
<ChatInterface mode="agent" />

// 测试 client 模式
<ChatInterface mode="client" />
```

**预期结果：**
- agent 模式：更专业的回答，适合中介使用
- client 模式：更通俗易懂的回答，适合客户使用

---

## 调试技巧

### 1. 查看终端日志

开发服务器终端会显示：
- API 请求日志
- 错误信息
- 向量搜索结果

### 2. 浏览器开发者工具

打开浏览器控制台（F12），查看：
- 网络请求（Network tab）
- 控制台错误（Console tab）
- API 响应

### 3. 检查 API 响应

在 Network tab 中：
- 找到 `/api/chat` 请求
- 查看 Response Headers 中的 `X-Sources`
- 检查流式响应是否正常

### 4. 测试单个模块

#### 测试 Embedding 生成

```typescript
// 在临时文件中测试
import { generateEmbedding } from '@/lib/ai/embeddings'

const embedding = await generateEmbedding("test query")
console.log('Embedding length:', embedding.length) // 应该是 1536
```

#### 测试向量搜索

```typescript
import { searchKnowledgeBase } from '@/lib/ai/vector-search'

const results = await searchKnowledgeBase("ABSD rates")
console.log('Search results:', results)
```

#### 测试网页抓取

```typescript
import { scrapeWithJina } from '@/lib/ai/scraper'

const markdown = await scrapeWithJina("https://www.hdb.gov.sg/...")
console.log('Scraped content:', markdown.substring(0, 200))
```

---

## 常见问题排查

### 问题 1: "Missing Supabase environment variables"

**解决方案：**
- 检查 `.env.local` 文件是否存在
- 确认变量名正确（NEXT_PUBLIC_ 前缀）
- 重启开发服务器

### 问题 2: "OPENAI_API_KEY is not set"

**解决方案：**
- 在 `.env.local` 中添加 `OPENAI_API_KEY=your_key`
- 重启开发服务器

### 问题 3: 向量搜索返回空结果

**可能原因：**
- 知识库中没有数据
- 数据没有生成 embeddings
- 相似度阈值太高（默认 0.75）

**解决方案：**
- 检查 `kb_chunks` 表是否有数据
- 运行 embedding 生成脚本
- 尝试降低相似度阈值

### 问题 4: 网页抓取失败

**可能原因：**
- Jina API Key 无效
- URL 格式错误
- 网站阻止抓取

**解决方案：**
- 检查 `JINA_API_KEY` 是否正确
- 确认 URL 格式正确
- 查看终端错误信息

### 问题 5: 流式响应不工作

**可能原因：**
- Anthropic API Key 无效
- 网络问题
- 浏览器不支持流式响应

**解决方案：**
- 检查 `ANTHROPIC_API_KEY`
- 查看浏览器控制台错误
- 尝试不同的浏览器

---

## 性能测试

### 测试首字响应时间 (TTFT)

目标：< 800ms

1. 打开浏览器开发者工具
2. 切换到 Network tab
3. 提问并记录第一个数据包到达时间
4. 检查是否 < 800ms

### 测试流式响应速度

观察消息流式显示是否流畅，没有明显卡顿。

---

## 自动化测试脚本

创建测试脚本 `scripts/test-phase2.sh`：

```bash
#!/bin/bash

echo "Testing Phase 2 APIs..."

# Test scrape endpoint
echo "Testing /api/scrape..."
curl -s "http://localhost:3000/api/scrape?url=https://www.hdb.gov.sg" | jq .

# Test chat endpoint (需要 POST，这里只是示例)
echo "Testing /api/chat..."
# 使用 Postman 或 curl 发送 POST 请求

echo "Tests complete!"
```

运行：
```bash
chmod +x scripts/test-phase2.sh
./scripts/test-phase2.sh
```

---

## 下一步

测试通过后，可以：
1. 添加更多知识库数据
2. 优化相似度阈值
3. 实现 `/api/ingest` 端点用于批量上传
4. 添加缓存机制提升性能

