# 快速获取 Supabase 配置

基于你的项目：**awewnxklyvtshyfkuvmd**

## 快速访问链接

- **Dashboard**: https://supabase.com/dashboard/project/awewnxklyvtshyfkuvmd
- **API Settings** (直接访问): https://supabase.com/dashboard/project/awewnxklyvtshyfkuvmd/settings/api

## 获取配置值的步骤

### 方法 1: 通过 Dashboard（推荐）

1. **打开 API Settings 页面**
   - 直接访问：https://supabase.com/dashboard/project/awewnxklyvtshyfkuvmd/settings/api
   - 或：Dashboard → Settings (⚙️) → API

2. **找到 Project URL**
   - 在页面顶部，找到 "Project URL" 或 "API URL"
   - 格式类似：`https://awewnxklyvtshyfkuvmd.supabase.co`
   - **这就是 `NEXT_PUBLIC_SUPABASE_URL`**

3. **找到 anon/public key**
   - 向下滚动到 "Project API keys" 部分
   - 找到标有 **"anon"** 或 **"public"** 的密钥
   - 点击眼睛图标 👁️ 显示完整密钥
   - **这就是 `NEXT_PUBLIC_SUPABASE_ANON_KEY`**

### 方法 2: 通过 Supabase CLI

如果你安装了 Supabase CLI：

```bash
# 登录 Supabase
supabase login

# 链接到项目
supabase link --project-ref awewnxklyvtshyfkuvmd

# 查看配置
supabase status
```

## 配置示例

根据你的项目 ID，你的 `.env.local` 应该包含：

```bash
# 注意：请从 Dashboard 获取实际值，不要使用下面的示例值
NEXT_PUBLIC_SUPABASE_URL=https://awewnxklyvtshyfkuvmd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3ZXdueGtseXZ0c2h5Zmt1dm1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTY3NjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **重要**: 上面的值是示例格式，请从你的 Dashboard 复制实际值。

## 验证配置

运行检查脚本：

```bash
./scripts/check-env.sh
```

或手动测试：

```bash
# 启动开发服务器
npm run dev

# 如果配置正确，应该没有 Supabase 相关的错误
```

## 常见问题

### Q: 找不到 anon key？
A: 在 "Project API keys" 部分，anon key 可能被隐藏。点击眼睛图标 👁️ 或复制图标来显示。

### Q: URL 格式不对？
A: Supabase URL 格式是 `https://[project-ref].supabase.co`，其中 project-ref 可能与项目 ID 不同。请从 Dashboard 复制准确的值。

### Q: 如何确认配置正确？
A: 
1. 检查 `.env.local` 文件是否存在且包含两个变量
2. 运行 `npm run dev`，查看是否有 Supabase 连接错误
3. 访问 http://localhost:3000/chat，尝试发送消息

## 下一步

配置完成后：

1. ✅ 运行数据库迁移（如果还没做）
   - 在 Supabase SQL Editor 运行 `supabase/migrations/` 中的文件

2. ✅ 测试连接
   - 启动开发服务器
   - 访问聊天页面测试

3. ✅ 添加测试数据（可选）
   - 参考 `TESTING_GUIDE.md` 添加知识库测试数据

