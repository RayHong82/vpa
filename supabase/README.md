# Supabase Database Migrations

This directory contains SQL migration files for setting up the Supabase database schema.

## Migration Files

1. **20240101000000_initial_schema.sql** - Creates all tables and indexes
   - `profiles` - User profiles with role and team association
   - `kb_chunks` - Vectorized knowledge base chunks with embeddings
   - `calculation_history` - Financial calculation history

2. **20240101000001_rls_policies.sql** - Sets up Row Level Security (RLS) policies
   - Ensures data isolation between teams
   - Users can only access their own data
   - Team members can access shared team data

3. **20240101000002_vector_search_function.sql** - Creates vector similarity search function
   - `match_kb_chunks()` - Used for RAG retrieval pipeline
   - Supports similarity threshold and team filtering

## How to Apply Migrations

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order
4. Execute each migration

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Option 3: Manual SQL Execution

1. Connect to your Supabase database
2. Run each migration file in order:
   - `20240101000000_initial_schema.sql`
   - `20240101000001_rls_policies.sql`
   - `20240101000002_vector_search_function.sql`

## Required Extensions

The migrations require the following PostgreSQL extensions:
- `vector` - For pgvector (vector similarity search)
- `uuid-ossp` - For UUID generation

These are typically enabled by default in Supabase, but if you encounter errors, enable them manually:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Environment Variables

Make sure to set these in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Setup

After applying migrations, you can test the connection:

```typescript
import { supabase } from '@/lib/supabase/client'

// Test connection
const { data, error } = await supabase.from('profiles').select('count')
```

