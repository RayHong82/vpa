# Anthropic → OpenAI 迁移总结

## ✅ 已完成的更改

### 1. 代码更改

**文件**: `app/api/chat/route.ts`

- ✅ 导入更改: `createAnthropic` → `createOpenAI`
- ✅ 函数更改: `experimental_streamText` → `streamText`
- ✅ 模型更改: `claude-3-5-sonnet-20241022` → `gpt-4o`
- ✅ API key 验证: `sk-ant-` → `sk-`
- ✅ 日志更新: 所有日志信息已更新

### 2. 依赖更新

**文件**: `package.json`

- ✅ 添加: `@ai-sdk/openai@^3.0.2`
- ✅ 更新: `ai@^3.0.21` (最新版本)
- ✅ 保留: `@ai-sdk/anthropic` (可选，用于未来切换)

### 3. 环境变量更改

**之前需要**:
```bash
OPENAI_API_KEY=sk-...      # 仅用于 Embeddings
ANTHROPIC_API_KEY=sk-ant-... # 用于 Chat
```

**现在只需要**:
```bash
OPENAI_API_KEY=sk-...      # 用于 Chat + Embeddings
```

## 🔄 调用流程对比

### 之前 (Anthropic)
```
用户输入 → ChatInterface → /api/chat
  → createAnthropic() → Claude 3.5 Sonnet
  → 流式响应
```

### 现在 (OpenAI)
```
用户输入 → ChatInterface → /api/chat
  → createOpenAI() → GPT-4o
  → 流式响应
```

## 📊 功能对比

| 功能 | Anthropic Claude | OpenAI GPT-4o |
|------|------------------|---------------|
| 模型 | Claude 3.5 Sonnet | GPT-4o |
| 上下文长度 | 200k tokens | 128k tokens |
| 响应速度 | 中等 | 快 |
| 成本 | 中等 | 低-中等 |
| 流式响应 | ✅ | ✅ |
| 系统提示词 | ✅ | ✅ |
| API 稳定性 | 高 | 非常高 |

## 🎯 为什么选择 OpenAI

### 主要原因

1. **统一 API 管理** ⭐
   - 项目已使用 OpenAI 做 Embeddings
   - 只需一个 API key (`OPENAI_API_KEY`)
   - 简化环境变量配置
   - 降低运维复杂度

2. **成本优化**
   - GPT-4o 性价比更高
   - 统一供应商可能有折扣
   - 减少多供应商管理成本

3. **生态成熟**
   - OpenAI API 更成熟稳定
   - 文档和社区支持更丰富
   - 与现有 Embeddings 流程一致

## ⚠️ 需要注意的事项

### 1. Vercel 环境变量更新

**必须操作**:
1. 访问 Vercel Dashboard
2. 进入项目设置 → Environment Variables
3. 确认 `OPENAI_API_KEY` 已设置（用于 Chat + Embeddings）
4. 可以删除 `ANTHROPIC_API_KEY`（不再需要）

### 2. 模型行为差异

- **Claude**: 可能在某些长文本任务上表现更好
- **GPT-4o**: 响应更快，成本更低，通用性能优秀

### 3. API 调用格式

代码已完全兼容，无需修改前端或其他组件。

## 🧪 测试建议

迁移后，建议测试：

1. ✅ 基础对话功能
2. ✅ 流式响应
3. ✅ RAG 检索功能
4. ✅ 引用标注
5. ✅ 错误处理

## 📝 回退方案

如果需要切换回 Anthropic：

1. 恢复 `createAnthropic` 导入
2. 更改模型为 `claude-3-5-sonnet-20241022`
3. 恢复 `ANTHROPIC_API_KEY` 验证
4. 在 Vercel 中重新设置 `ANTHROPIC_API_KEY`

所有 Anthropic 相关依赖已保留，便于快速切换。

