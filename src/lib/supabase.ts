import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Lead {
  id: string
  email: string
  name?: string
  phone?: string
  source: string
  created_at: string
  converted: boolean
}

export interface Sale {
  id: string
  lead_id?: string
  email: string
  name?: string
  amount: number
  payment_method: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  email?: string
  result: string
  text: string
  rating: number
  photo_url?: string
  approved: boolean
  created_at: string
}

export interface Analytics {
  id: string
  page_views: number
  leads_captured: number
  conversion_rate: number
  sales_count: number
  revenue: number
  date: string
}