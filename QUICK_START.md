# 快速启动指南

所有 API keys 已配置完成！按照以下步骤启动和测试 webapp。

## 🚀 一键启动（推荐）

运行启动脚本：

```bash
./scripts/start-and-verify.sh
```

这个脚本会：
1. ✅ 检查环境变量
2. ✅ 安装依赖（如果需要）
3. ✅ 检查 TypeScript 编译
4. ✅ 启动开发服务器

## 📋 手动启动步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 验证环境变量

```bash
./scripts/check-env.sh
```

应该看到所有 ✅ 标记。

### 3. 检查 Supabase 迁移

⚠️ **重要**: 确保已运行 Supabase 数据库迁移

1. 打开 Supabase Dashboard: https://supabase.com/dashboard/project/awewnxklyvtshyfkuvmd
2. 进入 **SQL Editor**
3. 按顺序运行以下文件的内容：
   - `supabase/migrations/20240101000000_initial_schema.sql`
   - `supabase/migrations/20240101000001_rls_policies.sql`
   - `supabase/migrations/20240101000002_vector_search_function.sql`

### 4. 启动开发服务器

```bash
npm run dev
```

等待看到：
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

### 5. 打开浏览器测试

访问：http://localhost:3000

## 🧪 测试步骤

### 测试 1: 基础 UI

1. 打开 http://localhost:3000
2. 检查：
   - ✅ 顶部导航栏显示（毛玻璃效果）
   - ✅ 底部 Dock 显示（Chat, Planner, Settings）
   - ✅ 页面加载正常

### 测试 2: 聊天功能

1. 点击底部 Dock 的 **Chat** 图标
2. 或直接访问：http://localhost:3000/chat
3. 输入测试消息：`Hello, what can you help me with?`
4. 检查：
   - ✅ 消息发送成功
   - ✅ AI 回复流式显示（逐字出现）
   - ✅ 界面响应正常

### 测试 3: 向量搜索（需要测试数据）

如果知识库中有数据：

1. 提问：`What are the ABSD rates for Singapore citizens?`
2. 检查：
   - ✅ AI 回答包含相关信息
   - ✅ 底部显示 Sources（如果有）

### 测试 4: 网页抓取（如果配置了 Jina）

1. 提问并包含政府网站 URL：
   ```
   What are the HDB requirements? https://www.hdb.gov.sg/...
   ```
2. 检查：
   - ✅ AI 回答包含抓取的内容
   - ✅ Sources 显示抓取的 URL

## 🔍 故障排查

### 问题 1: npm install 失败

**解决方案：**
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题 2: 开发服务器启动失败

**检查：**
- 端口 3000 是否被占用
- 查看终端错误信息
- 检查 `.env.local` 文件格式

**解决方案：**
```bash
# 使用不同端口
PORT=3001 npm run dev

# 或杀死占用端口的进程
lsof -ti:3000 | xargs kill -9
```

### 问题 3: Supabase 连接错误

**检查：**
- `NEXT_PUBLIC_SUPABASE_URL` 是否正确
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 是否正确
- 是否运行了数据库迁移

### 问题 4: AI 聊天不工作

**检查：**
- `ANTHROPIC_API_KEY` 是否正确
- `OPENAI_API_KEY` 是否正确（用于 embeddings）
- 查看浏览器控制台错误
- 查看终端错误信息

### 问题 5: 页面空白或样式错误

**解决方案：**
```bash
# 清除 Next.js 缓存
rm -rf .next

# 重新启动
npm run dev
```

## 📊 验证清单

启动前检查：

- [ ] ✅ 所有环境变量已配置（运行 `./scripts/check-env.sh`）
- [ ] ✅ 依赖已安装（`node_modules` 存在）
- [ ] ✅ Supabase 迁移已运行
- [ ] ✅ 开发服务器正常启动
- [ ] ✅ 浏览器可以访问 http://localhost:3000
- [ ] ✅ 聊天界面可以打开
- [ ] ✅ 可以发送消息并收到回复

## 🎯 下一步

测试通过后：

1. **添加知识库数据**（可选）
   - 在 Supabase 中插入测试数据
   - 运行 `npx tsx scripts/generate-test-embeddings.ts` 生成 embeddings

2. **测试完整流程**
   - 参考 `TESTING_GUIDE.md` 进行详细测试

3. **开始使用**
   - 添加更多知识库内容
   - 测试不同的查询场景

## 💡 提示

- 开发服务器支持热重载，修改代码会自动刷新
- 查看终端日志了解 API 调用情况
- 使用浏览器开发者工具（F12）查看网络请求和错误
- 所有 API 调用都有错误处理，查看终端了解详情

---

**准备好了吗？运行 `./scripts/start-and-verify.sh` 开始吧！** 🚀

