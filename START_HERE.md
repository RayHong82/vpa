# 🚀 启动和测试指南

所有配置已完成！按照以下步骤启动 webapp。

## ⚠️ Node.js 版本提示

检测到你的 Node.js 版本是 16.20.1，建议升级到 18+ 以获得最佳体验。

**检查版本：**
```bash
node --version
```

**升级 Node.js（推荐使用 nvm）：**
```bash
# 安装 nvm (如果还没有)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装并使用 Node.js 20
nvm install 20
nvm use 20
```

不过，即使使用 Node 16，项目也应该可以运行（已使用 --legacy-peer-deps）。

## ✅ 快速启动

### 方法 1: 使用启动脚本（推荐）

```bash
./scripts/start-and-verify.sh
```

### 方法 2: 手动启动

```bash
# 1. 验证环境变量
./scripts/check-env.sh

# 2. 启动开发服务器
npm run dev
```

## 📋 启动前检查清单

- [x] ✅ 所有 API keys 已配置（已验证）
- [x] ✅ 依赖已安装
- [ ] ⚠️ **Supabase 数据库迁移**（重要！）
  - 打开：https://supabase.com/dashboard/project/awewnxklyvtshyfkuvmd/sql/new
  - 运行 `supabase/migrations/` 中的 3 个 SQL 文件

## 🧪 测试步骤

### 1. 启动服务器

```bash
npm run dev
```

等待看到：
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

### 2. 打开浏览器

访问：http://localhost:3000

**检查：**
- ✅ 页面正常加载
- ✅ 顶部导航栏显示
- ✅ 底部 Dock 显示（Chat, Planner, Settings）

### 3. 测试聊天功能

1. 点击 **Chat** 图标或访问：http://localhost:3000/chat
2. 输入测试消息：`Hello, what can you help me with?`
3. **检查：**
   - ✅ 消息发送成功
   - ✅ AI 回复流式显示（逐字出现）
   - ✅ 没有错误信息

### 4. 测试向量搜索（可选，需要数据）

如果已在 Supabase 中添加知识库数据：

1. 提问：`What are the ABSD rates for Singapore citizens?`
2. **检查：**
   - ✅ AI 回答包含相关信息
   - ✅ 底部显示 Sources（如果有匹配）

## 🔍 如果遇到问题

### 问题 1: 端口被占用

```bash
# 使用不同端口
PORT=3001 npm run dev
```

### 问题 2: Supabase 连接错误

**检查：**
1. 是否运行了数据库迁移？
2. `.env.local` 中的 Supabase URL 和 Key 是否正确？

### 问题 3: AI 聊天不工作

**检查：**
1. 浏览器控制台（F12）是否有错误？
2. 终端是否有错误信息？
3. API keys 是否正确？

### 问题 4: 页面空白

```bash
# 清除缓存
rm -rf .next
npm run dev
```

## 📊 验证清单

启动后验证：

- [ ] ✅ 开发服务器正常启动
- [ ] ✅ 浏览器可以访问 http://localhost:3000
- [ ] ✅ UI 组件正常显示
- [ ] ✅ 可以打开聊天页面
- [ ] ✅ 可以发送消息
- [ ] ✅ 收到 AI 回复（流式显示）

## 🎯 下一步

测试通过后：

1. **添加知识库数据**（可选）
   ```sql
   -- 在 Supabase SQL Editor 中插入测试数据
   INSERT INTO kb_chunks (team_id, content, metadata)
   VALUES (NULL, 'ABSD rates...', '{"type": "internal"}');
   ```
   
   然后生成 embeddings：
   ```bash
   npx tsx scripts/generate-test-embeddings.ts
   ```

2. **测试完整功能**
   - 参考 `TESTING_GUIDE.md` 进行详细测试

3. **开始使用**
   - 添加更多知识库内容
   - 测试不同的查询场景

---

**准备好了吗？运行 `npm run dev` 开始吧！** 🚀

