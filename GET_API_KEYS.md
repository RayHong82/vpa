# 获取 API Keys 详细指南

本指南将详细说明如何获取 ANTHROPIC_API_KEY 和 JINA_API_KEY。

---

## 1. 获取 ANTHROPIC_API_KEY (Claude AI)

### 步骤 1: 访问 Anthropic Console

打开：https://console.anthropic.com

### 步骤 2: 注册/登录账号

1. 点击右上角 **"Sign up"** 或 **"Log in"**
2. 可以使用邮箱注册，或使用 Google/GitHub 账号登录
3. 完成邮箱验证（如果使用邮箱注册）

### 步骤 3: 添加支付方式

⚠️ **重要**: Anthropic API 是付费服务，需要添加支付方式才能使用

1. 登录后，点击右上角头像
2. 选择 **"Billing"** 或 **"Settings"**
3. 点击 **"Add payment method"** 或 **"Payment Methods"**
4. 添加信用卡信息
5. 设置使用限额（建议设置每月限额，如 $50，避免意外费用）

### 步骤 4: 创建 API Key

1. 在 Anthropic Console 中，点击左侧菜单的 **"API Keys"**
   - 或直接访问：https://console.anthropic.com/settings/keys

2. 点击 **"Create Key"** 或 **"Create API Key"** 按钮

3. 填写密钥信息：
   - **Name**: 输入密钥名称（如 `vpa-project` 或 `sg-prop-agent`）
   - **Description** (可选): 描述用途

4. 点击 **"Create Key"**

5. **立即复制密钥** ⚠️
   - 密钥只显示一次！
   - 格式：`sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - 保存到安全的地方

### 步骤 5: 配置到 .env.local

在 `.env.local` 文件中添加：

```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 价格参考

- **Claude 3.5 Sonnet**:
  - Input: ~$3 per 1M tokens
  - Output: ~$15 per 1M tokens
- **估算**: 1000 次对话约 $1-5（取决于对话长度）

### 快速链接

- **Console**: https://console.anthropic.com
- **API Keys**: https://console.anthropic.com/settings/keys
- **Billing**: https://console.anthropic.com/settings/billing
- **文档**: https://docs.anthropic.com

---

## 2. 获取 JINA_API_KEY (网页抓取)

### 步骤 1: 访问 Jina Reader API

打开：https://jina.ai/reader-api

### 步骤 2: 注册账号

1. 点击 **"Get Started"** 或 **"Sign up"** 按钮
2. 可以选择：
   - **使用邮箱注册**
   - **使用 GitHub 账号登录**（推荐，更快速）
3. 如果使用邮箱，完成邮箱验证

### 步骤 3: 获取 API Key

1. 登录后，进入 **Dashboard** 或 **API Keys** 页面
   - 通常在导航栏有 "API Keys" 或 "Dashboard" 链接

2. 找到 **"API Keys"** 部分

3. 点击 **"Create API Key"** 或 **"Generate Key"** 按钮

4. 填写信息（如果有）：
   - **Name**: 密钥名称（如 `vpa-scraper`）

5. 点击 **"Create"** 或 **"Generate"**

6. **立即复制密钥** ⚠️
   - 密钥可能只显示一次
   - 保存到安全的地方

### 步骤 4: 配置到 .env.local

在 `.env.local` 文件中添加：

```bash
JINA_API_KEY=your-jina-api-key-here
```

### 价格参考

- 检查 Jina Reader 的定价页面了解最新价格
- 通常有免费额度或按使用量计费
- 访问：https://jina.ai/pricing

### 快速链接

- **主页**: https://jina.ai/reader-api
- **文档**: https://jina.ai/reader-api/docs
- **定价**: https://jina.ai/pricing

---

## 配置示例

完整的 `.env.local` 文件应该包含：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://awewnxklyvtshyfkuvmd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI (用于 Embeddings)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Anthropic (用于 Claude AI)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Jina Reader (用于网页抓取)
JINA_API_KEY=your-jina-api-key-here
```

---

## 验证配置

### 方法 1: 使用检查脚本

```bash
./scripts/check-env.sh
```

### 方法 2: 手动检查

```bash
# 查看环境变量（不显示完整密钥）
cat .env.local | grep -E "(ANTHROPIC|JINA)" | sed 's/=.*/=***/'
```

应该看到：
```
ANTHROPIC_API_KEY=***
JINA_API_KEY=***
```

### 方法 3: 启动开发服务器测试

```bash
npm run dev
```

如果配置正确，服务器应该正常启动。如果有缺失的变量，会看到错误信息。

---

## 常见问题

### Q1: Anthropic API Key 格式是什么？

**A**: Anthropic API Key 格式：
- 以 `sk-ant-` 开头
- 例如：`sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- 长度约 50-60 个字符

### Q2: Jina API Key 格式是什么？

**A**: Jina API Key 格式可能不同，通常：
- 是一串随机字符
- 长度可能不同
- 从 Dashboard 复制即可

### Q3: 如果 API Key 丢失了怎么办？

**A**: 
- **Anthropic**: 删除旧密钥，创建新的
- **Jina**: 删除旧密钥，生成新的
- ⚠️ 旧密钥无法恢复，只能创建新的

### Q4: 需要付费吗？

**A**: 
- **Anthropic**: 是付费服务，需要添加支付方式
- **Jina**: 可能有免费额度，检查定价页面

### Q5: 如何设置使用限额？

**A**: 
- **Anthropic**: 在 Billing 设置中设置每月限额
- **Jina**: 检查 Dashboard 中的使用限制设置

### Q6: API Key 安全吗？

**A**: 
- ✅ 不要提交到 Git（已在 `.gitignore` 中）
- ✅ 不要分享给他人
- ✅ 定期轮换密钥
- ✅ 如果泄露，立即删除并创建新的

---

## 下一步

配置完成后：

1. ✅ 运行 `./scripts/check-env.sh` 验证所有环境变量
2. ✅ 启动开发服务器：`npm run dev`
3. ✅ 访问 http://localhost:3000/chat 测试聊天功能
4. ✅ 参考 `TESTING_GUIDE.md` 进行详细测试

---

## 获取帮助

如果遇到问题：

1. 查看各服务的官方文档
2. 检查终端错误信息
3. 查看浏览器控制台错误
4. 确认 API Key 格式正确
5. 确认已添加支付方式（Anthropic）

