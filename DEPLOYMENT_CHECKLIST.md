# Vercel 部署检查清单

## 部署前检查

### 1. 环境变量配置 ✅
确保在 Vercel Dashboard 中配置了以下环境变量：

**必需变量：**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 匿名密钥
- `OPENAI_API_KEY` - OpenAI API 密钥（用于 embeddings）
- `ANTHROPIC_API_KEY` - Anthropic API 密钥（用于 Claude）

**可选变量：**
- `JINA_API_KEY` - Jina Reader API 密钥（用于网页抓取，可选）

### 2. 代码配置 ✅
- ✅ `next.config.ts` - 已配置路径别名
- ✅ `tsconfig.json` - 已配置 baseUrl 和 paths
- ✅ `vercel.json` - 已配置构建命令和函数超时
- ✅ `package.json` - 已指定 Node.js 版本要求

### 3. 文件完整性
确保所有文件都已提交到 Git：
```bash
git status
git add -A
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 部署步骤

### 方法 1: 通过 Vercel Dashboard
1. 访问 https://vercel.com
2. 导入你的 GitHub 仓库
3. 配置环境变量（见上方）
4. 点击 "Deploy"

### 方法 2: 通过 Vercel CLI
```bash
# 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 登录
vercel login

# 部署到生产环境
vercel --prod
```

## 常见问题排查

### 问题 1: 构建失败 - "Module not found: Can't resolve '@/lib/supabase/server'"
**解决方案：**
- ✅ 已修复：更新了 `next.config.ts` 和 `tsconfig.json` 配置
- 如果仍然失败，检查文件是否已提交到 Git

### 问题 2: 构建失败 - "Missing environment variables"
**解决方案：**
- 在 Vercel Dashboard 中检查环境变量是否已设置
- 确保变量名正确（注意大小写）
- 重新部署

### 问题 3: 运行时错误 - "OPENAI_API_KEY is not set"
**解决方案：**
- 检查 Vercel Dashboard 中的环境变量
- 确保变量已添加到 Production、Preview 和 Development 环境
- 重新部署

### 问题 4: Node.js 版本不兼容
**解决方案：**
- ✅ 已修复：在 `package.json` 中指定了 Node.js 版本要求
- Vercel 会自动使用正确的版本

## 验证部署

部署成功后，访问你的 Vercel URL 并测试：
1. 访问首页 - 应该正常加载
2. 访问 `/chat` - 应该显示聊天界面
3. 发送一条消息 - 应该收到 AI 回复

## 有用的链接

- **Vercel Dashboard**: https://vercel.com/dashboard
- **项目设置**: https://vercel.com/[your-project]/settings
- **环境变量**: https://vercel.com/[your-project]/settings/environment-variables

