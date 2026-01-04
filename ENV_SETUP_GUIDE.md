# 环境变量配置指南

本指南将帮助你获取和配置所有必需的 API 密钥和 Supabase 连接信息。

## 快速开始

1. 在项目根目录创建 `.env.local` 文件
2. 按照下面的步骤获取每个 API Key
3. 将密钥添加到 `.env.local` 文件中
4. 重启开发服务器

## 必需的环境变量

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (用于 Embeddings)
OPENAI_API_KEY=your_openai_api_key

# Anthropic (用于 Claude AI)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Jina Reader (用于网页抓取)
JINA_API_KEY=your_jina_api_key
```

---

## 1. Supabase 配置

### 步骤 1: 创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "Start your project" 或 "Sign in"
3. 使用 GitHub 账号登录（推荐）或创建新账号
4. 点击 "New Project"
5. 填写项目信息：
   - **Name**: 项目名称（如 `vpa`）
   - **Database Password**: 设置数据库密码（**重要：保存好这个密码**）
   - **Region**: 选择离你最近的区域（如 `Southeast Asia (Singapore)`）
6. 点击 "Create new project"
7. 等待项目创建完成（约 2 分钟）

### 步骤 2: 获取 Supabase 连接信息

1. 在项目 Dashboard 中，点击左侧菜单的 **Settings** (⚙️)
2. 点击 **API**
3. 找到以下信息：

   **Project URL** (这就是 `NEXT_PUBLIC_SUPABASE_URL`)
   ```
   格式：https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key** (这就是 `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   ```
   格式：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 步骤 3: 运行数据库迁移

1. 在 Supabase Dashboard 中，点击左侧菜单的 **SQL Editor**
2. 点击 **New query**
3. 按顺序运行以下迁移文件的内容：
   - `supabase/migrations/20240101000000_initial_schema.sql`
   - `supabase/migrations/20240101000001_rls_policies.sql`
   - `supabase/migrations/20240101000002_vector_search_function.sql`

4. 每个文件运行后，应该看到 "Success. No rows returned"

### 步骤 4: 验证配置

在 `.env.local` 中添加：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 2. OpenAI API Key 配置

### 步骤 1: 创建 OpenAI 账号

1. 访问 https://platform.openai.com
2. 点击 "Sign up" 创建账号或 "Log in" 登录
3. 完成邮箱验证

### 步骤 2: 添加支付方式

⚠️ **重要**: OpenAI API 是付费服务，需要添加支付方式

1. 登录后，点击右上角头像
2. 选择 **Billing**
3. 点击 **Add payment method**
4. 添加信用卡信息
5. 设置使用限额（建议设置每月限额以避免意外费用）

### 步骤 3: 创建 API Key

1. 在 OpenAI Dashboard，点击左侧菜单的 **API keys**
2. 点击 **Create new secret key**
3. 输入密钥名称（如 `vpa-project`）
4. 点击 **Create secret key**
5. **立即复制密钥**（只显示一次！）
6. 保存到安全的地方

### 步骤 4: 验证配置

在 `.env.local` 中添加：

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**注意**: 
- 密钥以 `sk-` 开头
- 如果丢失，需要删除旧密钥并创建新的

---

## 3. Anthropic API Key 配置

### 步骤 1: 创建 Anthropic 账号

1. 访问 https://console.anthropic.com
2. 点击 "Sign up" 创建账号
3. 完成邮箱验证

### 步骤 2: 添加支付方式

⚠️ **重要**: Anthropic API 是付费服务

1. 登录后，点击右上角头像
2. 选择 **Billing** 或 **Settings**
3. 添加支付方式
4. 设置使用限额

### 步骤 3: 创建 API Key

1. 在 Anthropic Console，点击左侧菜单的 **API Keys**
2. 点击 **Create Key**
3. 输入密钥名称（如 `vpa-claude`）
4. 点击 **Create Key**
5. **立即复制密钥**（只显示一次！）

### 步骤 4: 验证配置

在 `.env.local` 中添加：

```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**注意**: 
- 密钥以 `sk-ant-` 开头
- 如果丢失，需要删除旧密钥并创建新的

---

## 4. Jina Reader API Key 配置

### 步骤 1: 访问 Jina Reader

1. 访问 https://jina.ai/reader-api
2. 点击 "Get Started" 或 "Sign up"

### 步骤 2: 注册账号

1. 使用邮箱注册或 GitHub 登录
2. 完成邮箱验证

### 步骤 3: 获取 API Key

1. 登录后，进入 Dashboard
2. 找到 **API Keys** 部分
3. 点击 **Create API Key** 或 **Generate Key**
4. **复制密钥**

### 步骤 4: 验证配置

在 `.env.local` 中添加：

```bash
JINA_API_KEY=your-jina-api-key-here
```

**注意**: 
- Jina Reader 可能有免费额度
- 检查定价页面了解使用限制

---

## 完整的 .env.local 文件示例

创建 `.env.local` 文件（在项目根目录）：

```bash
# ============================================
# Supabase Configuration
# ============================================
# 从 Supabase Dashboard > Settings > API 获取
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTg3NjgwMCwiZXhwIjoxOTYxNDUyODAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# OpenAI Configuration (用于 Embeddings)
# ============================================
# 从 https://platform.openai.com/api-keys 获取
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# Anthropic Configuration (用于 Claude AI)
# ============================================
# 从 https://console.anthropic.com 获取
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# Jina Reader Configuration (用于网页抓取)
# ============================================
# 从 https://jina.ai/reader-api 获取
JINA_API_KEY=your-jina-api-key-here
```

---

## 验证配置

### 方法 1: 使用验证脚本

```bash
# 检查环境变量是否设置
node -e "require('dotenv').config({ path: '.env.local' }); console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'); console.log('OpenAI Key:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing'); console.log('Anthropic Key:', process.env.ANTHROPIC_API_KEY ? '✓ Set' : '✗ Missing'); console.log('Jina Key:', process.env.JINA_API_KEY ? '✓ Set' : '✗ Missing');"
```

### 方法 2: 手动检查

```bash
# 查看 .env.local 文件（不显示完整密钥）
cat .env.local | sed 's/=.*/=***/' 
```

应该看到所有 5 个变量都已设置。

### 方法 3: 启动开发服务器

```bash
npm run dev
```

如果配置正确，服务器应该正常启动。如果有缺失的变量，会看到错误信息。

---

## 安全注意事项

### ⚠️ 重要安全提示

1. **永远不要提交 `.env.local` 到 Git**
   - 文件已在 `.gitignore` 中
   - 检查 `git status` 确认没有被跟踪

2. **不要分享 API Key**
   - API Key 就像密码，泄露后应立即删除并创建新的

3. **使用环境变量管理工具**（生产环境）
   - Vercel: 在项目设置中添加环境变量
   - 其他平台: 使用各自的环境变量管理功能

4. **定期轮换 API Key**
   - 建议每 3-6 个月更换一次
   - 删除旧密钥前确保新密钥已测试

5. **设置使用限额**
   - 在 OpenAI 和 Anthropic 控制台设置每月使用限额
   - 监控使用情况，避免意外费用

---

## 成本估算

### OpenAI (Embeddings)
- **模型**: text-embedding-ada-002
- **价格**: ~$0.0001 per 1K tokens
- **估算**: 1000 次查询约 $0.10

### Anthropic (Claude)
- **模型**: Claude 3.5 Sonnet
- **价格**: ~$3 per 1M input tokens, $15 per 1M output tokens
- **估算**: 1000 次对话约 $1-5（取决于对话长度）

### Jina Reader
- 检查 https://jina.ai/pricing 了解最新价格
- 可能有免费额度

### Supabase
- **免费层**: 500MB 数据库，2GB 带宽
- **付费**: 从 $25/月起

---

## 故障排查

### 问题 1: "Missing Supabase environment variables"

**解决方案:**
- 检查 `.env.local` 文件是否存在
- 确认变量名正确（注意 `NEXT_PUBLIC_` 前缀）
- 重启开发服务器

### 问题 2: "OPENAI_API_KEY is not set"

**解决方案:**
- 检查 `.env.local` 中是否有 `OPENAI_API_KEY`
- 确认没有多余的空格或引号
- 重启开发服务器

### 问题 3: API Key 无效

**可能原因:**
- Key 已过期或被删除
- Key 复制不完整（有空格或换行）
- Key 格式错误

**解决方案:**
- 重新生成 API Key
- 仔细复制，确保完整
- 检查是否有隐藏字符

### 问题 4: 环境变量不生效

**解决方案:**
1. 确认文件名为 `.env.local`（不是 `.env`）
2. 确认文件在项目根目录
3. 重启开发服务器（`Ctrl+C` 然后 `npm run dev`）
4. 清除 Next.js 缓存：`rm -rf .next`

---

## 下一步

配置完成后：

1. **运行数据库迁移**（如果还没做）
   - 在 Supabase SQL Editor 运行迁移文件

2. **测试配置**
   - 运行 `npm run dev`
   - 访问 http://localhost:3000/chat
   - 尝试发送消息

3. **查看测试指南**
   - 参考 `TESTING_GUIDE.md` 进行详细测试

---

## 获取帮助

如果遇到问题：

1. 检查本文档的"故障排查"部分
2. 查看各服务的官方文档
3. 检查终端错误信息
4. 查看浏览器控制台错误

