# 路径别名修复说明

## 问题

Vercel 构建时无法解析 `@/lib/supabase/server` 路径别名，错误信息：
```
Module not found: Can't resolve '@/lib/supabase/server'
```

## 修复方案

### 1. 简化 webpack 配置

使用更简单、更可靠的 `path.join(__dirname)` 方法：

```typescript
webpack: (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.join(__dirname),
  }
  return config
}
```

### 2. 确保 tsconfig.json 配置正确

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 已提交的修复

- Commit: `9a65532` - Simplify webpack alias configuration using path.join
- 已推送到 GitHub

## 验证步骤

1. Vercel 会自动检测新的提交并开始构建
2. 查看构建日志确认路径别名问题已解决
3. 如果构建成功，测试应用功能

## 如果仍然失败

如果问题持续，可能需要：

1. **清除 Vercel 构建缓存**
   - 在 Vercel Dashboard 中清除缓存
   - 重新部署

2. **检查文件是否存在于 Git**
   ```bash
   git ls-files | grep lib/supabase/server
   ```

3. **使用相对路径作为临时方案**
   - 将 `@/lib/supabase/server` 改为 `../../lib/supabase/server`
   - 但这会影响代码可读性

## 相关文件

- `next.config.ts` - Webpack 配置
- `tsconfig.json` - TypeScript 路径配置
- `lib/supabase/server.ts` - 目标文件

