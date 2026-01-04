import { NextRequest } from 'next/server'
import { experimental_streamText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { retrieveRAGContext, formatRAGContext } from '@/lib/ai/rag-pipeline'
import { createServerClient } from '@/lib/supabase/server'

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const maxDuration = 30 // 30 seconds for streaming

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, mode = 'client' } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Messages array is required', { status: 400 })
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    const userQuery = lastMessage.content

    if (!userQuery || typeof userQuery !== 'string') {
      return new Response('User query is required', { status: 400 })
    }

    // Get user's team_id if authenticated
    let teamId: string | null = null
    try {
      const supabase = await createServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('team_id')
          .eq('id', user.id)
          .single()
        if (profile) {
          teamId = profile.team_id
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Continue without team_id
    }

    // Retrieve RAG context
    // Scraping is optional - if JINA_API_KEY is not set, it will be disabled automatically
    const enableScraping = !!process.env.JINA_API_KEY
    const ragContext = await retrieveRAGContext(userQuery, {
      teamId,
      enableScraping,
    })

    // Build system prompt based on mode
    const systemPrompt = mode === 'agent'
      ? `You are an expert Singapore property agent assistant. You help property agents with:
- Property transaction procedures and regulations
- HDB and private property policies
- Financial calculations (ABSD, TDSR, MSR, LTV)
- Client communication and documentation

Always provide accurate, up-to-date information. Use citations [1], [2], etc. when referencing sources.`
      : `You are a helpful assistant for Singapore property buyers. You help with:
- Understanding property purchase procedures
- Government policies (HDB, URA, IRAS)
- Financial planning and calculations
- Property market information

Always provide clear, easy-to-understand explanations. Use citations [1], [2], etc. when referencing sources.`

    // Format RAG context
    const contextText = ragContext.sources.length > 0
      ? formatRAGContext(ragContext, userQuery)
      : ''

    // Prepare system prompt with context
    const fullSystemPrompt = systemPrompt + (contextText ? `\n\n${contextText}` : '')

    // Prepare messages for AI (experimental_streamText format)
    const aiMessages = messages
      .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant')
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }))

    // Stream response using Claude 3.5 Sonnet
    const result = await experimental_streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: fullSystemPrompt,
      messages: aiMessages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Return streaming response with sources metadata
    return result.toTextStreamResponse({
      headers: {
        'X-Sources': JSON.stringify(ragContext.sources),
      },
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
