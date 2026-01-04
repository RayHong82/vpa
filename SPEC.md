SG Prop-Agent Assistant: Technical Specification
1. 业务上下文 (Business Context)
本项目旨在通过 AI 解决新加坡房产交易中极高信息复杂度的痛点。系统需处理两类核心数据：
* 结构化数据： ABSD 税率、LTV 贷款限额、TDSR/MSR 比例。
* 非结构化数据： 中介团队知识库（PDF）、政府官网公告（HDB/URA）。

2. 核心架构选型 (The Stack)
* Framework: Next.js 15 (App Router, React Server Components)
* Styling: Tailwind CSS + Framer Motion + Shadcn/UI (Apple Design Language)
* Backend/BaaS: Supabase (Auth, Postgres, pgvector)
* AI Engine: Vercel AI SDK + Claude 3.5 Sonnet (Main) + Groq/Llama 3 (Fast Intents)
* Search/Scraping: Firecrawl / Jina Reader API (Markdown Extraction)
* State Management: Nuqs (URL-based state for search/filters)

3. 数据库模型 (Data Schema)
3.1 实体关系图
SQL

-- Profiles: 用户画像与模式选择
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  role text CHECK (role IN ('agent', 'client')), -- 切换中介/客户模式
  team_id uuid, -- 关联中介团队
  created_at timestamptz DEFAULT now()
);

-- Knowledge_Base: 向量化的知识片段
CREATE TABLE kb_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid,
  content text,
  metadata jsonb, -- { source_url: string, type: 'hdb' | 'internal' | 'legal' }
  embedding vector(1536) -- 用于 OpenAI Embedding
);

-- Calculations: 存储用户的财务规划草稿
CREATE TABLE calculation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  input_data jsonb, -- { property_price: number, income: number, ... }
  results jsonb,    -- { absd: number, stamp_duty: number, max_loan: number }
  created_at timestamptz DEFAULT now()
);

4. 核心功能模块详细规范 (Functional Specs)
4.1 苹果风格 UI 规范 (Apple Human Interface)
* 色彩: Background: #FFFFFF (Light), #000000 (Dark). Secondary: #F5F5F7 (iOS Gray).
* 材质: 对话框使用 backdrop-blur-xl bg-white/80.
* 交互: 列表项点击使用 scale: 0.98 的缩放反馈。
* Dock 栏: 底部固定半透明 Dock，用于快速切换“聊天”、“规划器”、“设置”。
4.2 财务规划器 (Financial Engine) - 核心逻辑
后端需实现 sg-property-logic.ts 模块，精准处理：
* ABSD (Additional Buyer's Stamp Duty): * SC/PR/Foreigner 阶梯税率。
    * 第一套/第二套/第三套及以上判定。
* TDSR (Total Debt Servicing Ratio): 限制为月收入的 55%。
* MSR (Mortgage Servicing Ratio): 仅针对 HDB/EC，限制为 30%。
4.3 RAG 检索流水线 (Retrieval Workflow)
1. 意图识别: 如果 Query 涉及 "Policy" 或 "Procedure"，触发 RAG。
2. 上下文注入: 检索 kb_chunks 中相似度 > 0.75 的前 4 条内容。
3. 引用透明: AI 回复必须包含 [1][2] 脚注，并列出 sources 列表。

5. 核心 API 设计 (API Contract)
Endpoint	Method	Description	Payload / Response
/api/chat	POST	流式对话接口	{ messages: [], mode: 'agent' }
/api/ingest	POST	管理员上传并向量化	{ fileUrl: string, tags: [] }
/api/scrape	GET	抓取 HDB/URA 实时数据	{ url: string } -> Markdown
/api/calculate	POST	财务规划计算	{ profile: {}, financials: {} }
6. 非功能性需求 (Non-Functional)
* 流式性能: 首字响应时间 (TTFT) < 800ms。
* 移动端适配: 必须通过 PWA 验证，支持 standalone 模式。
* 安全: 使用 Supabase RLS (Row Level Security) 确保中介团队知识库不跨团队泄漏。

7. 任务执行阶段 (Phased Roadmap)
Phase 1: Foundation (Day 1)
* [ ] Next.js 15 初始化 & Shadcn 定制。
* [ ] Supabase DB Schema 迁移。
* [ ] 苹果风格 Layout 与侧边栏/Dock 实现。
Phase 2: AI & Knowledge (Day 2)
* [ ] Vercel AI SDK 集成。
* [ ] 编写 Embedding 脚本与 Vector Search RPC。
* [ ] 集成 Jina Reader 实现实时网页上下文抓取。
Phase 3: Business Logic (Day 3)
* [ ] 实现财务计算器所有公式及单元测试。
* [ ] 区分中介/客户模式的 System Prompt 注入。
* [ ] PWA 配置与部署到 Vercel。