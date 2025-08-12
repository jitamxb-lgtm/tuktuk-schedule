import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL!
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Todo = {
  id: string
  task: string
  is_complete: boolean
  created_at: string
  updated_at: string
}