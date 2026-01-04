export type Profile = {
  id: string
  full_name: string | null
  role: 'agent' | 'client' | null
  team_id: string | null
  created_at: string
  updated_at: string
}

export type KBChunk = {
  id: string
  team_id: string | null
  content: string
  metadata: {
    source_url?: string
    type?: 'hdb' | 'internal' | 'legal'
    [key: string]: any
  }
  embedding: number[] | null
  created_at: string
  updated_at: string
}

export type CalculationHistory = {
  id: string
  user_id: string
  input_data: {
    property_price?: number
    income?: number
    [key: string]: any
  }
  results: {
    absd?: number
    stamp_duty?: number
    max_loan?: number
    [key: string]: any
  }
  created_at: string
}

