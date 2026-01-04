# Vercel 部署故障排查

## 当前问题

Vercel 构建失败，错误信息：`Module not found: Can't resolve '@/lib/supabase/server'`

## 查看详细错误

### 方法 1: Vercel Dashboard（推荐）

1. 访问：https://vercel.com/rayhong82s-projects/vpa
2. 点击最新的部署（状态为 "Error"）
3. 查看 **"Build Logs"** 标签页
4. 滚动到底部查看完整错误信息

### 方法 2: Vercel CLI

```bash
# 查看最新部署
vercel ls

# 查看特定部署的详细信息
vercel inspect <deployment-url>
```

## 可能的原因和解决方案

### 原因 1: 路径别名解析问题

**问题**: Next.js 15 在 Vercel 上可能无法正确解析 `@/` 路径别名

**解决方案**: 检查 `tsconfig.json` 和 `next.config.ts` 配置

当前配置：
- `tsconfig.json` 中已配置 `"@/*": ["./*"]`
- `next.config.ts` 中已添加 webpack alias

### 原因 2: 文件未提交

**检查**:
```bash
git status
git ls-files | grep lib/supabase
```

### 原因 3: 构建缓存问题

**解决方案**: 在 Vercel Dashboard 中清除构建缓存

1. 进入项目设置
2. 找到 "Build & Development Settings"
3. 清除构建缓存
4. 重新部署

## 快速修复步骤

### 步骤 1: 查看详细错误

访问 Vercel Dashboard 并查看构建日志，复制完整的错误信息。

### 步骤 2: 验证本地构建

```bash
# 清理并重新构建
rm -rf .next node_modules/.cache
npm install --legacy-peer-deps
npm run build
```

### 步骤 3: 检查文件完整性

```bash
# 确保所有文件都已提交
git add -A
git status
git commit -m "Ensure all files committed"
git push origin main
```

### 步骤 4: 重新部署

```bash
vercel --prod
```

## 备用方案

如果路径别名问题持续存在，可以考虑：

1. **使用相对路径**（临时方案）
   - 将 `@/lib/supabase/server` 改为相对路径
   - 但这会影响代码可读性

2. **检查 Next.js 版本兼容性**
   - 确保 Next.js 15 与 Vercel 完全兼容

3. **联系 Vercel 支持**
   - 如果问题持续，可以在 Vercel Dashboard 中提交支持请求

## 有用的链接

- **Vercel Dashboard**: https://vercel.com/rayhong82s-projects/vpa
- **最新部署**: https://vpa-mgz9utq6v-rayhong82s-projects.vercel.app
- **项目设置**: https://vercel.com/rayhong82s-projects/vpa/settings

## 下一步

1. ✅ 访问 Vercel Dashboard 查看详细错误
2. ✅ 复制完整的错误信息
3. ✅ 根据错误信息进行修复
4. ✅ 重新部署测试

---

**提示**: 本地构建成功说明代码本身没问题，问题可能出在 Vercel 的构建环境配置上。

