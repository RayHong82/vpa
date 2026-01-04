-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles: 用户画像与模式选择
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text CHECK (role IN ('agent', 'client')), -- 切换中介/客户模式
  team_id uuid, -- 关联中介团队
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Knowledge_Base: 向量化的知识片段
CREATE TABLE kb_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}', -- { source_url: string, type: 'hdb' | 'internal' | 'legal' }
  embedding vector(1536), -- 用于 OpenAI Embedding
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Calculations: 存储用户的财务规划草稿
CREATE TABLE calculation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  input_data jsonb NOT NULL DEFAULT '{}', -- { property_price: number, income: number, ... }
  results jsonb NOT NULL DEFAULT '{}',    -- { absd: number, stamp_duty: number, max_loan: number }
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_team_id ON profiles(team_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_kb_chunks_team_id ON kb_chunks(team_id);
CREATE INDEX idx_kb_chunks_embedding ON kb_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_calculation_history_user_id ON calculation_history(user_id);
CREATE INDEX idx_calculation_history_created_at ON calculation_history(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kb_chunks_updated_at BEFORE UPDATE ON kb_chunks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

