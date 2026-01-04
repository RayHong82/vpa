# Vercel 环境变量状态

## 更新时间
2026-01-04

## 环境变量更新

### ✅ OPENAI_API_KEY
- **状态**: 已更新到所有环境
- **环境**: Production, Preview, Development
- **用途**: Chat API + Embeddings
- **格式**: OpenAI API key (sk-proj-...)

### ⚠️ ANTHROPIC_API_KEY
- **状态**: 仍存在但不再使用
- **建议**: 可以在 Vercel Dashboard 中删除
- **原因**: 已切换到 OpenAI API

## 当前环境变量列表

### Production 环境
- ✅ `OPENAI_API_KEY` - 已更新
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - 已设置
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 已设置
- ✅ `JINA_API_KEY` - 已设置（可选）
- ⚠️ `ANTHROPIC_API_KEY` - 不再使用（可删除）

### Preview 环境
- ✅ 所有变量同上

### Development 环境
- ✅ 所有变量同上

## 验证部署

最新部署 URL: https://vpa-k3896939k-rayhong82s-projects.vercel.app

测试步骤：
1. 访问聊天页面
2. 发送测试消息
3. 确认收到回复
4. 检查 Vercel 日志

