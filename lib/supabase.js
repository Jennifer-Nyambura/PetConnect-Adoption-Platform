import { createClient } from "@supabase/supabase-js"

// Check if we're in development and provide fallback values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Only create the client if we have real credentials
let supabase: any = null

if (supabaseUrl !== "https://placeholder.supabase.co" && supabaseAnonKey !== "placeholder-key") {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Mock client for development
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null }),
      eq: function () {
        return this
      },
      or: function () {
        return this
      },
      order: function () {
        return this
      },
      single: function () {
        return this
      },
    }),
  }
}

export { supabase }

export type Pet = {
  id: number
  name: string
  type: string
  breed: string
  age: string
  gender: string
  size: string
  color: string | null
  weight: string | null
  description: string
  personality: string | null
  medical_info: string | null
  adoption_fee: number | null
  image_url: string | null
  adopted: boolean
  available_date: string | null
  created_at: string
  updated_at: string
}
