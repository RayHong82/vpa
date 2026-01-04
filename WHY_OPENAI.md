# 为什么从 Anthropic 切换到 OpenAI

## 原使用 Anthropic 的原因

1. **Claude 3.5 Sonnet 的优势**
   - 长上下文处理能力强
   - 代码理解能力强
   - 安全性较高
   - 在某些任务上表现优秀

2. **项目初始选择**
   - 可能是为了测试不同模型
   - 或者团队偏好

## 切换到 OpenAI 的原因

### 1. **统一 API 管理** ⭐ 主要原因
   - 项目已经使用 OpenAI 做 Embeddings (`text-embedding-ada-002`)
   - 统一使用 OpenAI 可以简化环境变量管理
   - 减少 API key 配置复杂度（只需一个 `OPENAI_API_KEY`）
   - 降低运维成本

### 2. **成本考虑**
   - OpenAI GPT-4 Turbo 在某些场景下可能更经济
   - 统一供应商可能有批量折扣
   - 减少多供应商管理的复杂性

### 3. **生态兼容性**
   - OpenAI API 更成熟稳定
   - 文档和社区支持更丰富
   - 与现有 Embeddings 流程一致
   - `@ai-sdk/openai` 与 `ai` SDK 完美集成

### 4. **功能需求**
   - GPT-4 Turbo 已经足够满足需求
   - 流式响应支持良好
   - 系统提示词支持完善
   - 长上下文支持（128k tokens）

## 迁移说明

### 已完成的更改

1. **代码更改**
   - ✅ 替换 `createAnthropic` → `createOpenAI`
   - ✅ 替换模型 `claude-3-5-sonnet-20241022` → `gpt-4-turbo-preview`
   - ✅ 更新 API key 验证逻辑
   - ✅ 更新日志信息

2. **依赖更新**
   - ✅ 添加 `@ai-sdk/openai` 包
   - ✅ 保留 `@ai-sdk/anthropic`（可选，用于未来切换）

3. **环境变量**
   - ✅ 现在只需要 `OPENAI_API_KEY`（用于 Chat 和 Embeddings）
   - ⚠️ `ANTHROPIC_API_KEY` 不再需要（可以删除）

### 模型选择

**当前使用**: `gpt-4-turbo-preview`
- 支持 128k 上下文
- 流式响应
- 系统提示词
- 性能优秀

**其他可选模型**:
- `gpt-4o` - 最新模型，更快更便宜
- `gpt-4` - 标准版本
- `gpt-3.5-turbo` - 更经济的选择

### 功能保持

✅ 所有现有功能保持不变：
- 流式响应
- RAG 检索增强
- 模式切换（client/agent）
- 引用标注
- 错误处理

### 环境变量更新

**之前需要**:
```bash
OPENAI_API_KEY=sk-...      # Embeddings
ANTHROPIC_API_KEY=sk-ant-... # Chat
```

**现在只需要**:
```bash
OPENAI_API_KEY=sk-...      # Chat + Embeddings
```

### 性能对比

| 指标 | Anthropic Claude | OpenAI GPT-4 Turbo |
|------|------------------|-------------------|
| 响应速度 | 中等 | 快 |
| 上下文长度 | 200k | 128k |
| 成本 | 中等 | 中等-低 |
| 流式支持 | ✅ | ✅ |
| 系统提示词 | ✅ | ✅ |

## 回退方案

如果需要切换回 Anthropic：
1. 恢复 `createAnthropic` 导入
2. 更改模型为 `claude-3-5-sonnet-20241022`
3. 恢复 `ANTHROPIC_API_KEY` 验证
4. 更新环境变量

代码已保留 Anthropic 相关依赖，便于未来切换。

