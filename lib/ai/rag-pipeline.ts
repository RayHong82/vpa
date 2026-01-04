import { searchKnowledgeBase, SearchResult } from './vector-search'
import { scrapeWithJina, isGovernmentWebsite, extractRelevantContent } from './scraper'

export interface RAGContext {
  knowledgeBaseResults: SearchResult[]
  scrapedContent?: {
    url: string
    content: string
  }
  sources: Array<{
    id: number
    type: 'kb' | 'scraped'
    content: string
    url?: string
    metadata?: any
  }>
}

/**
 * Detect if query is about policy or procedure
 */
export function isPolicyQuery(query: string): boolean {
  const policyKeywords = [
    'policy',
    'policies',
    'procedure',
    'procedures',
    'regulation',
    'regulations',
    'rule',
    'rules',
    'guideline',
    'guidelines',
    'requirement',
    'requirements',
    'hdb',
    'ura',
    'government',
    'official',
    'law',
    'legal',
  ]

  const lowerQuery = query.toLowerCase()
  return policyKeywords.some(keyword => lowerQuery.includes(keyword))
}

/**
 * Extract URLs from query text
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.match(urlRegex) || []
}

/**
 * RAG Retrieval Pipeline
 * 1. Search vector database
 * 2. If policy-related, scrape government websites
 * 3. Combine context for AI
 */
export async function retrieveRAGContext(
  query: string,
  options: {
    teamId?: string | null
    enableScraping?: boolean
  } = {}
): Promise<RAGContext> {
  const { teamId = null, enableScraping = true } = options

  // Step 1: Search knowledge base
  const kbResults = await searchKnowledgeBase(query, {
    matchThreshold: 0.75,
    matchCount: 4,
    teamId,
  })

  // Step 2: Check if policy-related and scrape if needed
  let scrapedContent: { url: string; content: string } | undefined

  if (enableScraping && isPolicyQuery(query)) {
    // Extract URLs from query
    const urls = extractUrls(query)

    // If no URLs provided, we might want to search for relevant government pages
    // For now, we'll scrape if URLs are provided
    if (urls.length > 0) {
      const govUrl = urls.find(url => isGovernmentWebsite(url))
      if (govUrl) {
        try {
          const markdown = await scrapeWithJina(govUrl)
          const relevantContent = extractRelevantContent(markdown)
          scrapedContent = {
            url: govUrl,
            content: relevantContent,
          }
        } catch (error) {
          console.error('Failed to scrape URL:', error)
          // Continue without scraped content
        }
      }
    }
  }

  // Step 3: Build sources list with citations
  const sources: RAGContext['sources'] = []

  // Add knowledge base results
  kbResults.forEach((result, index) => {
    sources.push({
      id: index + 1,
      type: 'kb',
      content: result.content,
      url: result.metadata.source_url,
      metadata: result.metadata,
    })
  })

  // Add scraped content if available
  if (scrapedContent) {
    sources.push({
      id: sources.length + 1,
      type: 'scraped',
      content: scrapedContent.content,
      url: scrapedContent.url,
    })
  }

  return {
    knowledgeBaseResults: kbResults,
    scrapedContent,
    sources,
  }
}

/**
 * Format RAG context for AI prompt
 */
export function formatRAGContext(context: RAGContext): string {
  let prompt = '## Relevant Context:\n\n'

  // Add knowledge base results
  if (context.knowledgeBaseResults.length > 0) {
    prompt += '### Knowledge Base:\n\n'
    context.knowledgeBaseResults.forEach((result, index) => {
      prompt += `[${index + 1}] ${result.content}\n`
      if (result.metadata.source_url) {
        prompt += `Source: ${result.metadata.source_url}\n`
      }
      prompt += '\n'
    })
  }

  // Add scraped content
  if (context.scrapedContent) {
    prompt += '### Latest Information from Government Website:\n\n'
    prompt += `${context.scrapedContent.content}\n`
    prompt += `Source: ${context.scrapedContent.url}\n\n`
  }

  prompt += '\n## Instructions:\n'
  prompt += 'Please answer the user\'s question using the context above. '
  prompt += 'When referencing information, use citations like [1], [2], etc. '
  prompt += 'corresponding to the numbered sources above.\n\n'

  return prompt
}

