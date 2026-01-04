-- Create a function for vector similarity search
-- This function will be used by the RAG retrieval pipeline
CREATE OR REPLACE FUNCTION match_kb_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 4,
  filter_team_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  team_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb_chunks.id,
    kb_chunks.team_id,
    kb_chunks.content,
    kb_chunks.metadata,
    1 - (kb_chunks.embedding <=> query_embedding) AS similarity
  FROM kb_chunks
  WHERE 
    kb_chunks.embedding IS NOT NULL
    AND (filter_team_id IS NULL OR kb_chunks.team_id = filter_team_id)
    AND 1 - (kb_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY kb_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION match_kb_chunks TO authenticated;

