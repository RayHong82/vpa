-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_history ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Team members can view profiles in their team (for agents)
CREATE POLICY "Team members can view team profiles"
  ON profiles FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid()
    )
  );

-- KB Chunks RLS Policies
-- Team members can view chunks from their team
CREATE POLICY "Team members can view team kb_chunks"
  ON kb_chunks FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid()
    )
    OR team_id IS NULL -- Allow access to public chunks (no team_id)
  );

-- Only team members can insert chunks for their team
CREATE POLICY "Team members can insert team kb_chunks"
  ON kb_chunks FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid()
    )
    OR team_id IS NULL
  );

-- Only team members can update chunks for their team
CREATE POLICY "Team members can update team kb_chunks"
  ON kb_chunks FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Only team members can delete chunks for their team
CREATE POLICY "Team members can delete team kb_chunks"
  ON kb_chunks FOR DELETE
  USING (
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Calculation History RLS Policies
-- Users can view their own calculation history
CREATE POLICY "Users can view own calculation_history"
  ON calculation_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own calculation history
CREATE POLICY "Users can insert own calculation_history"
  ON calculation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own calculation history
CREATE POLICY "Users can update own calculation_history"
  ON calculation_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own calculation history
CREATE POLICY "Users can delete own calculation_history"
  ON calculation_history FOR DELETE
  USING (auth.uid() = user_id);

