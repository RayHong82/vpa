import { createServerClient } from '../supabase/server'
import { generateEmbedding } from './embeddings'

export interface SearchResult {
  id: string
  team_id: string | null
  content: string
  metadata: {
    source_url?: string
    type?: 'hdb' | 'internal' | 'legal'
    [key: string]: any
  }
  similarity: number
}

/**
 * Search for similar knowledge base chunks using vector similarity
 * @param query - Search query text
 * @param options - Search options
 * @returns Array of search results with similarity scores
 */
export async function searchKnowledgeBase(
  query: string,
  options: {
    matchThreshold?: number
    matchCount?: number
    teamId?: string | null
  } = {}
): Promise<SearchResult[]> {
  const {
    matchThreshold = 0.75,
    matchCount = 4,
    teamId = null,
  } = options

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query)

  // Get Supabase client
  const supabase = await createServerClient()

  // Call the match_kb_chunks function
  const { data, error } = await supabase.rpc('match_kb_chunks', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
    filter_team_id: teamId,
  })

  if (error) {
    console.error('Vector search error:', error)
    throw new Error(`Vector search failed: ${error.message}`)
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    team_id: item.team_id,
    content: item.content,
    metadata: item.metadata || {},
    similarity: item.similarity,
  }))
}

