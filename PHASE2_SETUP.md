# Phase 2 配置指南

Phase 2 已实现 RAG 检索流水线和 AI 聊天功能。以下是配置和使用说明。

## 环境变量配置

在 `.env.local` 文件中添加以下环境变量：

```bash
# Supabase (Phase 1)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (用于 Embeddings)
OPENAI_API_KEY=your_openai_api_key

# Anthropic (用于 Claude 3.5 Sonnet)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Jina Reader (用于网页抓取)
JINA_API_KEY=your_jina_api_key
```

## API 密钥获取

### 1. OpenAI API Key
- 访问 https://platform.openai.com/api-keys
- 创建新的 API Key
- 用于生成文本嵌入向量（text-embedding-ada-002）

### 2. Anthropic API Key
- 访问 https://console.anthropic.com/
- 创建新的 API Key
- 用于 Claude 3.5 Sonnet 流式对话

### 3. Jina Reader API Key
- 访问 https://jina.ai/reader-api
- 注册并获取 API Key
- 用于抓取 HDB/URA 等政府网站内容

## 功能说明

### RAG 检索流水线

系统实现了完整的 RAG（Retrieval-Augmented Generation）流程：

1. **向量库查询**
   - 用户提问时，系统自动生成查询的 embedding
   - 在 Supabase 向量数据库中搜索相似内容（相似度 > 0.75）
   - 返回前 4 条最相关的结果

2. **政策检测与网页抓取**
   - 检测查询是否涉及政策、程序等关键词
   - 如果查询中包含政府网站 URL（HDB、URA 等），自动抓取最新内容
   - 使用 Jina Reader API 将网页转换为 Markdown 格式

3. **AI 流式回答**
   - 使用 Claude 3.5 Sonnet 进行流式回答
   - 结合向量库和网页抓取的内容作为上下文
   - 支持引用标注（[1], [2] 等）

### API 端点

#### POST /api/chat
流式聊天接口

**请求体：**
```json
{
  "messages": [
    { "role": "user", "content": "What is ABSD?" }
  ],
  "mode": "client" // 或 "agent"
}
```

**响应：** 流式文本响应，包含 X-Sources 头部（引用来源）

#### GET /api/scrape
网页抓取接口

**查询参数：**
- `url`: 要抓取的 URL

**响应：**
```json
{
  "url": "https://...",
  "markdown": "...",
  "isGovernmentWebsite": true
}
```

## 使用流程

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   创建 `.env.local` 并添加所有必需的 API 密钥

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问聊天界面**
   打开 http://localhost:3000/chat

5. **测试功能**
   - 提问一般问题：系统会从向量库搜索
   - 提问政策问题并包含 URL：系统会自动抓取网页
   - 查看回答底部的引用来源

## 测试示例

### 测试向量搜索
```
提问：What are the ABSD rates for Singapore citizens?
```
系统会从知识库中搜索相关内容。

### 测试网页抓取
```
提问：What is the latest HDB policy? https://www.hdb.gov.sg/...
```
系统会检测到政府网站 URL，自动抓取并整合到回答中。

### 测试政策检测
```
提问：What are the procedures for buying a HDB flat?
```
系统会检测到 "procedures" 关键词，触发政策相关处理。

## 注意事项

1. **API 限制**
   - OpenAI: 注意 rate limits
   - Anthropic: 注意 token 使用量
   - Jina Reader: 注意请求频率限制

2. **性能优化**
   - 向量搜索已优化（使用索引）
   - 流式响应确保低延迟
   - 网页抓取有内容长度限制（4000 字符）

3. **错误处理**
   - 所有 API 调用都有错误处理
   - 如果某个服务失败，系统会继续使用其他可用资源

## 下一步

- [ ] 实现知识库文档上传和向量化（/api/ingest）
- [ ] 优化首字响应时间（TTFT < 800ms）
- [ ] 添加缓存机制减少重复查询
- [ ] 实现更智能的 URL 发现（自动搜索相关政府页面）

