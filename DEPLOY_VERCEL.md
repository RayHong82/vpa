# 部署到 Vercel 指南

## ✅ Vercel 的优势

1. **自动 Node.js 版本管理** - Vercel 会自动使用正确的 Node.js 版本（18+），不会遇到本地版本问题
2. **自动 HTTPS** - 免费 SSL 证书
3. **全球 CDN** - 快速访问
4. **自动部署** - 连接 GitHub 后，每次 push 自动部署
5. **环境变量管理** - 安全的环境变量配置

## 🚀 快速部署步骤

### 方法 1: 通过 Vercel Dashboard（推荐）

#### 步骤 1: 登录 Vercel

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 授权 Vercel 访问你的 GitHub 仓库

#### 步骤 2: 导入项目

1. 点击 **"Add New..."** → **"Project"**
2. 找到并选择 `RayHong82/vpa` 仓库
3. 点击 **"Import"**

#### 步骤 3: 配置项目

Vercel 会自动检测 Next.js 项目，保持默认设置即可：

- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（默认）
- **Output Directory**: `.next`（默认）
- **Install Command**: `npm install --legacy-peer-deps`（已在 vercel.json 配置）

#### 步骤 4: 配置环境变量

在部署前，添加所有环境变量：

点击 **"Environment Variables"** 部分，添加以下变量：

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase Anon Key | Production, Preview, Development |
| `OPENAI_API_KEY` | 你的 OpenAI API Key | Production, Preview, Development |
| `ANTHROPIC_API_KEY` | 你的 Anthropic API Key | Production, Preview, Development |
| `JINA_API_KEY` | 你的 Jina API Key（可选） | Production, Preview, Development |

**重要提示：**
- `NEXT_PUBLIC_*` 变量会暴露给客户端，确保使用安全的密钥
- 其他 API keys 只在服务端使用，更安全
- 建议所有环境都添加（Production, Preview, Development）

#### 步骤 5: 部署

1. 点击 **"Deploy"**
2. 等待构建完成（约 2-5 分钟）
3. 部署成功后，会显示你的应用 URL（如 `vpa.vercel.app`）

### 方法 2: 使用 Vercel CLI

#### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2: 登录

```bash
vercel login
```

#### 步骤 3: 部署

```bash
cd /Users/jinghong/projects/vpa
vercel
```

CLI 会引导你：
1. 设置项目名称
2. 配置环境变量
3. 开始部署

#### 步骤 4: 配置环境变量（CLI）

```bash
# 添加环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add JINA_API_KEY

# 为所有环境添加
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_URL development
```

## 🔧 部署后配置

### 1. 检查部署状态

访问 Vercel Dashboard，查看：
- ✅ 构建是否成功
- ✅ 是否有错误日志
- ✅ 环境变量是否正确设置

### 2. 测试应用

访问你的 Vercel URL（如 `https://vpa.vercel.app`），测试：
- ✅ 页面是否正常加载
- ✅ 聊天功能是否工作
- ✅ API 调用是否正常

### 3. 配置自定义域名（可选）

1. 在 Vercel Dashboard → Settings → Domains
2. 添加你的域名
3. 按照提示配置 DNS

## 🔍 故障排查

### 问题 1: 构建失败

**可能原因：**
- 环境变量未设置
- 依赖安装失败
- TypeScript 错误

**解决方案：**
1. 查看 Vercel 构建日志
2. 检查环境变量是否全部添加
3. 本地运行 `npm run build` 测试

### 问题 2: 运行时错误

**可能原因：**
- API keys 无效
- Supabase 连接失败
- 环境变量格式错误

**解决方案：**
1. 检查 Vercel Dashboard 中的环境变量
2. 查看 Function Logs（Vercel Dashboard → Functions）
3. 验证 API keys 是否有效

### 问题 3: API 路由不工作

**检查：**
1. 确保环境变量已设置
2. 检查 Vercel Function Logs
3. 验证 API 路由路径是否正确

## 📊 监控和日志

### 查看日志

1. **构建日志**: Vercel Dashboard → Deployments → 选择部署 → Build Logs
2. **运行时日志**: Vercel Dashboard → Deployments → 选择部署 → Function Logs
3. **实时日志**: Vercel Dashboard → Logs

### 性能监控

Vercel 自动提供：
- 请求响应时间
- 错误率
- 带宽使用
- Function 执行时间

## 🔄 自动部署

### 连接 GitHub 后

每次 push 到 GitHub 会自动触发部署：
- `main` 分支 → Production 部署
- 其他分支 → Preview 部署
- Pull Request → Preview 部署

### 手动部署

```bash
vercel --prod
```

## 🎯 最佳实践

1. **环境变量管理**
   - 使用 Vercel Dashboard 管理，不要提交到代码
   - 为不同环境设置不同的值（如果需要）

2. **构建优化**
   - Vercel 自动优化 Next.js 构建
   - 使用 `--legacy-peer-deps` 处理依赖冲突

3. **监控**
   - 定期查看 Function Logs
   - 设置错误通知（Vercel Dashboard → Settings → Notifications）

4. **安全**
   - 不要在前端代码中硬编码 API keys
   - 使用环境变量管理敏感信息

## 📝 部署检查清单

部署前：

- [ ] ✅ 代码已推送到 GitHub
- [ ] ✅ 所有环境变量已准备
- [ ] ✅ 本地 `npm run build` 成功
- [ ] ✅ Supabase 数据库迁移已运行
- [ ] ✅ API keys 已验证有效

部署后：

- [ ] ✅ 构建成功
- [ ] ✅ 应用可以访问
- [ ] ✅ 聊天功能正常
- [ ] ✅ API 调用正常
- [ ] ✅ 没有错误日志

## 🚀 快速命令参考

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod

# 查看部署
vercel ls

# 查看日志
vercel logs
```

## 💡 提示

1. **免费额度**: Vercel 免费层包括：
   - 100GB 带宽/月
   - 100 次构建/天
   - 无限预览部署

2. **Node.js 版本**: Vercel 自动使用 Node.js 18+，无需配置

3. **区域选择**: 在 `vercel.json` 中设置了 `sin1`（新加坡），适合亚洲用户

4. **环境变量更新**: 更新环境变量后需要重新部署

---

**准备好部署了吗？访问 https://vercel.com 开始吧！** 🚀

