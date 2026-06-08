import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let supabaseInstance: any

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your environment variables or .env file.')
  supabaseInstance = {
    from: () => ({
      insert: async () => ({
        error: new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.')
      })
    })
  }
} else {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err)
    supabaseInstance = {
      from: () => ({
        insert: async () => ({
          error: new Error('Supabase client initialization failed: ' + (err as any).message)
        })
      })
    }
  }
}

export const supabase = supabaseInstance

