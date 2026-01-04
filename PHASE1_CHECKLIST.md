# Phase 1 验证清单

## 自动验证

运行验证脚本：
```bash
chmod +x scripts/verify-phase1.sh
./scripts/verify-phase1.sh
```

## 手动检查清单

### ✅ 1. 项目结构检查

- [ ] `app/` 目录存在，包含 layout.tsx, page.tsx
- [ ] `components/` 目录存在，包含 layout/ 和 ui/ 子目录
- [ ] `lib/` 目录存在，包含 supabase/ 和 utils.ts
- [ ] `supabase/migrations/` 目录存在，包含 3 个 SQL 迁移文件

### ✅ 2. 依赖安装

```bash
npm install
```

检查 `node_modules` 目录是否存在，并且没有错误。

### ✅ 3. 环境变量配置

创建 `.env.local` 文件：
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### ✅ 4. 开发服务器启动

```bash
npm run dev
```

应该能够成功启动，没有编译错误。

### ✅ 5. UI 视觉检查

访问 http://localhost:3000，检查：

- [ ] 页面能够正常加载
- [ ] 顶部导航栏显示（毛玻璃效果）
- [ ] 底部 Dock 显示（包含 Chat, Planner, Settings 三个图标）
- [ ] 页面响应式设计正常（可以调整浏览器窗口大小测试）
- [ ] 深色模式切换正常（如果实现了）

### ✅ 6. 路由检查

点击底部 Dock 的各个图标，检查：

- [ ] `/chat` 页面可以访问
- [ ] `/planner` 页面可以访问
- [ ] `/settings` 页面可以访问
- [ ] 导航时 URL 正确更新
- [ ] 活动状态（高亮）正确显示

### ✅ 7. TypeScript 编译检查

```bash
npm run build
```

应该能够成功编译，没有 TypeScript 错误。

### ✅ 8. Lint 检查

```bash
npm run lint
```

应该没有 linting 错误。

### ✅ 9. Supabase 数据库迁移

在 Supabase Dashboard 中：

- [ ] 能够连接到 Supabase 项目
- [ ] 在 SQL Editor 中运行 `20240101000000_initial_schema.sql`
- [ ] 在 SQL Editor 中运行 `20240101000001_rls_policies.sql`
- [ ] 在 SQL Editor 中运行 `20240101000002_vector_search_function.sql`
- [ ] 检查表是否创建成功：
  - `profiles`
  - `kb_chunks`
  - `calculation_history`
- [ ] 检查 RLS 策略是否启用
- [ ] 检查 `match_kb_chunks` 函数是否存在

### ✅ 10. Supabase 连接测试

创建一个测试文件 `app/test-supabase/page.tsx`（临时）：

```typescript
import { supabase } from '@/lib/supabase/client'

export default async function TestSupabase() {
  const { data, error } = await supabase.from('profiles').select('count')
  
  return (
    <div>
      <h1>Supabase Connection Test</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      ) : (
        <p style={{ color: 'green' }}>✅ Connected successfully!</p>
      )}
    </div>
  )
}
```

访问 `/test-supabase`，应该显示连接成功。

## 常见问题排查

### 问题 1: `npm install` 失败
- 检查 Node.js 版本（需要 18+）
- 清除缓存：`npm cache clean --force`
- 删除 `node_modules` 和 `package-lock.json`，重新安装

### 问题 2: 开发服务器启动失败
- 检查端口 3000 是否被占用
- 检查 `.env.local` 文件是否存在
- 查看终端错误信息

### 问题 3: Supabase 连接失败
- 检查 `.env.local` 中的 URL 和 Key 是否正确
- 检查 Supabase 项目是否激活
- 检查网络连接

### 问题 4: 样式不显示
- 检查 `tailwind.config.ts` 配置
- 检查 `app/globals.css` 是否正确导入
- 清除 `.next` 缓存：`rm -rf .next`

## 验证完成标志

当以下所有项都通过时，Phase 1 验证完成：

- ✅ 验证脚本全部通过
- ✅ 开发服务器正常启动
- ✅ UI 组件正常显示
- ✅ 路由导航正常工作
- ✅ TypeScript 编译无错误
- ✅ Supabase 数据库迁移成功
- ✅ Supabase 连接测试通过

