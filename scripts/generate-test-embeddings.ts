/**
 * Script to generate embeddings for existing kb_chunks without embeddings
 * Run with: npx tsx scripts/generate-test-embeddings.ts
 */

import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '../lib/ai/embeddings'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

if (!process.env.OPENAI_API_KEY) {
  console.error('Error: Missing OPENAI_API_KEY')
  console.error('Please set OPENAI_API_KEY in .env.local')
  process.exit(1)
}

async function main() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  console.log('Fetching chunks without embeddings...')
  
  // 获取所有没有 embedding 的记录
  const { data: chunks, error } = await supabase
    .from('kb_chunks')
    .select('id, content')
    .is('embedding', null)
  
  if (error) {
    console.error('Error fetching chunks:', error)
    process.exit(1)
  }
  
  if (!chunks || chunks.length === 0) {
    console.log('No chunks found without embeddings.')
    return
  }
  
  console.log(`Found ${chunks.length} chunks without embeddings`)
  console.log('Generating embeddings...\n')
  
  let successCount = 0
  let errorCount = 0
  
  for (const chunk of chunks) {
    try {
      console.log(`Processing chunk ${chunk.id}...`)
      const embedding = await generateEmbedding(chunk.content)
      
      const { error: updateError } = await supabase
        .from('kb_chunks')
        .update({ embedding })
        .eq('id', chunk.id)
      
      if (updateError) {
        console.error(`  ✗ Error updating chunk ${chunk.id}:`, updateError.message)
        errorCount++
      } else {
        console.log(`  ✓ Generated embedding for chunk ${chunk.id}`)
        successCount++
      }
    } catch (error: any) {
      console.error(`  ✗ Error processing chunk ${chunk.id}:`, error.message)
      errorCount++
    }
  }
  
  console.log('\n=== Summary ===')
  console.log(`Success: ${successCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log(`Total: ${chunks.length}`)
}

main().catch(console.error)

