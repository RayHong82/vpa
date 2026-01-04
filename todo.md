# SG Prop-Agent Assistant - 任务清单

## Phase 1: Foundation (Day 1)

### 1.1 Next.js 15 初始化 & Shadcn 定制
- [ ] 初始化 Next.js 15 项目（使用 App Router）
- [ ] 配置 TypeScript
- [ ] 安装并配置 Tailwind CSS
- [ ] 安装 Shadcn/UI 并初始化
- [ ] 配置 Shadcn/UI 使用 Apple Design Language 主题
- [ ] 设置 Framer Motion 动画库
- [ ] 配置项目基础目录结构（app/, components/, lib/, types/）
- [ ] 设置环境变量管理（.env.local）

### 1.2 Supabase DB Schema 迁移
- [ ] 创建 Supabase 项目并获取连接信息
- [ ] 安装 Supabase CLI 并配置本地开发环境
- [ ] 创建 profiles 表（包含 id, full_name, role, team_id, created_at）
- [ ] 创建 kb_chunks 表（包含 id, team_id, content, metadata, embedding）
- [ ] 创建 calculation_history 表（包含 id, user_id, input_data, results, created_at）
- [ ] 配置 pgvector 扩展用于向量搜索
- [ ] 创建必要的索引（team_id, user_id, embedding 向量索引）
- [ ] 设置 Row Level Security (RLS) 策略
  - [ ] profiles 表 RLS 策略
  - [ ] kb_chunks 表 RLS 策略（确保团队数据隔离）
  - [ ] calculation_history 表 RLS 策略
- [ ] 创建数据库迁移文件
- [ ] 测试数据库连接和查询

### 1.3 苹果风格 Layout 与侧边栏/Dock 实现
- [ ] 设计并实现主 Layout 组件
- [ ] 实现苹果风格色彩系统（Light/Dark 模式）
  - [ ] 配置背景色：Light (#FFFFFF), Dark (#000000)
  - [ ] 配置次要色：iOS Gray (#F5F5F7)
- [ ] 实现对话框组件（使用 backdrop-blur-xl bg-white/80）
- [ ] 实现列表项交互效果（scale: 0.98 缩放反馈）
- [ ] 创建底部固定 Dock 组件
  - [ ] Dock 半透明效果
  - [ ] 三个主要入口：聊天、规划器、设置
  - [ ] 图标和导航逻辑
- [ ] 实现侧边栏组件（如需要）
- [ ] 响应式设计（移动端适配）
- [ ] 集成 Framer Motion 动画效果

## Phase 2: AI & Knowledge (Day 2)

### 2.1 Vercel AI SDK 集成
- [ ] 安装 Vercel AI SDK
- [ ] 配置 Claude 3.5 Sonnet API 密钥
- [ ] 配置 Groq/Llama 3 API 密钥（用于快速意图识别）
- [ ] 创建基础聊天 API 路由（/api/chat）
- [ ] 实现流式响应处理
- [ ] 实现消息历史管理
- [ ] 集成模式切换（agent/client 模式）
- [ ] 测试流式对话功能
- [ ] 优化首字响应时间（TTFT < 800ms）

### 2.2 编写 Embedding 脚本与 Vector Search RPC
- [ ] 安装 OpenAI Embedding API 客户端
- [ ] 创建 embedding 生成函数（使用 text-embedding-ada-002 或类似模型）
- [ ] 编写知识库文档处理脚本
  - [ ] PDF 解析和分块
  - [ ] 文本预处理
  - [ ] 生成 embedding 向量
  - [ ] 存储到 kb_chunks 表
- [ ] 创建 Supabase RPC 函数用于向量相似度搜索
  - [ ] 实现相似度阈值过滤（> 0.75）
  - [ ] 返回前 4 条最相似结果
- [ ] 创建 /api/ingest 端点（管理员上传并向量化）
- [ ] 测试向量搜索功能

### 2.3 集成 Jina Reader 实现实时网页上下文抓取
- [ ] 注册并配置 Jina Reader API
- [ ] 创建 /api/scrape 端点
- [ ] 实现 URL 抓取功能
- [ ] 实现 Markdown 格式转换
- [ ] 处理 HDB/URA 官网特定格式
- [ ] 实现错误处理和重试机制
- [ ] 测试网页抓取功能
- [ ] 集成到 RAG 检索流程中

### 2.4 RAG 检索流水线实现
- [ ] 实现意图识别逻辑（检测 "Policy" 或 "Procedure" 关键词）
- [ ] 集成向量搜索到聊天流程
- [ ] 实现上下文注入机制
- [ ] 实现引用透明功能
  - [ ] AI 回复包含 [1][2] 脚注
  - [ ] 显示 sources 列表
- [ ] 测试完整 RAG 流程

## Phase 3: Business Logic (Day 3)

### 3.1 实现财务计算器所有公式及单元测试
- [ ] 创建 sg-property-logic.ts 模块
- [ ] 实现 ABSD 计算逻辑
  - [ ] SC (新加坡公民) 阶梯税率
  - [ ] PR (永久居民) 阶梯税率
  - [ ] Foreigner (外国人) 阶梯税率
  - [ ] 第一套/第二套/第三套及以上判定逻辑
- [ ] 实现 TDSR 计算逻辑（限制为月收入的 55%）
- [ ] 实现 MSR 计算逻辑（仅针对 HDB/EC，限制为 30%）
- [ ] 实现 LTV 贷款限额计算
- [ ] 实现 Stamp Duty 计算
- [ ] 创建单元测试文件
  - [ ] ABSD 测试用例
  - [ ] TDSR 测试用例
  - [ ] MSR 测试用例
  - [ ] 边界条件测试
- [ ] 运行测试并确保通过
- [ ] 创建 /api/calculate 端点
- [ ] 实现计算历史存储功能

### 3.2 区分中介/客户模式的 System Prompt 注入
- [ ] 设计中介模式 System Prompt
- [ ] 设计客户模式 System Prompt
- [ ] 实现模式切换逻辑
- [ ] 根据用户角色动态注入 System Prompt
- [ ] 测试不同模式下的 AI 回复差异
- [ ] 优化 Prompt 内容

### 3.3 PWA 配置与部署到 Vercel
- [ ] 创建 manifest.json 文件
- [ ] 配置 PWA 图标和启动画面
- [ ] 实现 Service Worker（如需要）
- [ ] 配置 standalone 模式
- [ ] 测试 PWA 功能（离线访问、添加到主屏幕等）
- [ ] 准备 Vercel 部署配置
- [ ] 配置环境变量（Supabase, API Keys）
- [ ] 部署到 Vercel
- [ ] 验证生产环境功能
- [ ] 性能优化和监控设置

## 额外任务

### 测试与优化
- [ ] 端到端测试所有功能
- [ ] 性能测试（特别是流式响应速度）
- [ ] 移动端兼容性测试
- [ ] 安全性审计（RLS 策略验证）
- [ ] 错误处理和用户反馈优化

### 文档
- [ ] 编写 API 文档
- [ ] 编写部署文档
- [ ] 编写用户使用指南

