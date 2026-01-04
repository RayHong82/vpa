# 不使用 Jina Reader 的配置指南

你可以选择不使用 Jina Reader 进行网页抓取，系统会完全依赖：
1. **向量数据库**（知识库检索）
2. **LLM 的知识**（Claude 的训练数据）

## 配置方式

### 方法 1: 不设置 JINA_API_KEY（推荐）

**最简单的方式**：只需不在 `.env.local` 中添加 `JINA_API_KEY`

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
# JINA_API_KEY=  # 不设置这一行
```

系统会自动检测到 Jina Reader 未配置，并跳过网页抓取步骤。

### 方法 2: 显式禁用抓取

如果你想在代码中显式控制，可以修改 `app/api/chat/route.ts`：

```typescript
const enableScraping = false  // 强制禁用
```

## 工作流程（不使用 Jina）

当不使用 Jina Reader 时，系统的工作流程：

1. **用户提问** → 生成 embedding
2. **向量搜索** → 从知识库检索相关内容（相似度 > 0.75）
3. **LLM 回答** → Claude 3.5 Sonnet 基于：
   - 知识库检索结果
   - 自身的训练知识（关于新加坡房产政策）
4. **引用显示** → 显示知识库来源

## 优势

✅ **无需额外 API Key** - 减少配置复杂度  
✅ **降低成本** - 不需要 Jina Reader 的费用  
✅ **更快响应** - 跳过网页抓取步骤，响应更快  
✅ **更稳定** - 不依赖外部网页抓取服务  

## 限制

⚠️ **无法获取实时网页内容** - 如果用户提供政府网站 URL，系统无法抓取最新内容  
⚠️ **依赖知识库** - 需要确保知识库中有足够的数据  
⚠️ **LLM 知识可能过时** - Claude 的训练数据可能有时间限制  

## 最佳实践

### 1. 丰富知识库内容

确保向量数据库中有足够的相关信息：

```sql
-- 在 Supabase 中插入更多知识库数据
INSERT INTO kb_chunks (team_id, content, metadata)
VALUES 
  (NULL, 'ABSD rates for Singapore Citizens...', '{"type": "internal", "source_url": "https://..."}'),
  (NULL, 'HDB eligibility requirements...', '{"type": "hdb", "source_url": "https://..."}'),
  -- 更多数据...
```

然后运行 embedding 生成脚本：

```bash
npx tsx scripts/generate-test-embeddings.ts
```

### 2. 优化 System Prompt

系统已经增强了 prompt，让 LLM 能够：
- 优先使用知识库内容
- 在知识库不足时，使用训练知识但明确标注
- 提供准确的引用

### 3. 用户提示

在 UI 中可以提示用户：
- "基于知识库和 AI 知识回答"
- "如需最新政策，请提供具体 URL 或联系相关部门"

## 测试

### 测试向量搜索

```bash
# 提问会触发向量搜索
"What are the ABSD rates for Singapore citizens?"
```

### 测试 LLM 知识

```bash
# 提问可能不在知识库中，LLM 会使用训练知识
"What is the general process for buying a HDB flat?"
```

## 混合模式（可选）

你也可以实现混合模式：
- 有 Jina Key 时：使用网页抓取
- 无 Jina Key 时：仅使用知识库 + LLM

当前代码已经支持这种模式，会自动检测 `JINA_API_KEY` 是否存在。

## 性能对比

| 模式 | 响应时间 | 实时性 | 成本 |
|------|---------|--------|------|
| 使用 Jina | ~2-5秒 | ✅ 最新 | 需要 Jina 费用 |
| 不使用 Jina | ~1-2秒 | ⚠️ 依赖知识库 | 仅 LLM 费用 |

## 总结

**不使用 Jina Reader 是完全可行的**，系统会：
1. ✅ 自动检测配置
2. ✅ 使用向量数据库检索
3. ✅ 利用 LLM 的知识补充
4. ✅ 提供准确的引用

只需要确保知识库中有足够的数据，系统就能很好地工作。

