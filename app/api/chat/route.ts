import { NextRequest } from 'next/server'
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { retrieveRAGContext, formatRAGContext } from '@/lib/ai/rag-pipeline'
import { createServerClient } from '@/lib/supabase/server'

export const maxDuration = 30 // 30 seconds for streaming

export async function POST(request: NextRequest) {
  try {
    // Validate OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Validate API key format (OpenAI keys start with 'sk-')
    if (!openaiApiKey.startsWith('sk-')) {
      console.error('Invalid OPENAI_API_KEY format. Expected key starting with "sk-", got:', openaiApiKey.substring(0, 20) + '...')
      return new Response(
        JSON.stringify({ error: 'Invalid OpenAI API key format. Please check your OPENAI_API_KEY environment variable.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const openai = createOpenAI({
      apiKey: openaiApiKey,
    })

    const body = await request.json()
    const { messages, mode = 'client' } = body
    
    console.log('[Chat API] Request received:', { mode, messageCount: messages?.length })

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
    console.log('[Chat API] Retrieving RAG context:', { userQuery, teamId, enableScraping })
    
    let ragContext
    try {
      ragContext = await retrieveRAGContext(userQuery, {
        teamId,
        enableScraping,
      })
      console.log('[Chat API] RAG context retrieved:', { sourcesCount: ragContext.sources.length, kbResultsCount: ragContext.knowledgeBaseResults.length })
    } catch (error) {
      console.error('[Chat API] Error retrieving RAG context:', error)
      // Continue with empty context if RAG fails
      ragContext = {
        knowledgeBaseResults: [],
        sources: [],
      }
    }

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

    // Stream response using OpenAI GPT-4 Turbo
    console.log('[Chat API] Calling OpenAI API:', { model: 'gpt-4o', messageCount: aiMessages.length })
    
    let result
    try {
      result = await streamText({
        model: openai('gpt-4o'),
        system: fullSystemPrompt,
        messages: aiMessages,
        temperature: 0.7,
        maxTokens: 2000,
      } as any)
      console.log('[Chat API] OpenAI API call successful')
    } catch (error: any) {
      console.error('[Chat API] OpenAI API error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        type: error.type,
      })
      throw error
    }

    // Return streaming response with sources metadata
    return result.toTextStreamResponse({
      headers: {
        'X-Sources': JSON.stringify(ragContext.sources),
      },
    })
  } catch (error: any) {
    console.error('[Chat API] Error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      cause: error.cause?.message,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'),
    })
    
    // Return user-friendly error message
    const errorMessage = error.message?.includes('API key') 
      ? 'API configuration error. Please check server logs.'
      : error.message || 'Internal server error'
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
