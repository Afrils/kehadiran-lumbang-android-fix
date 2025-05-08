
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type UserType = {
  id: string
  name: string
  email: string
  nip: string
  position: string
  department: string
  join_date: string
  phone: string
}

export type AttendanceType = {
  id: string
  user_id: string
  date: string
  check_in: string
  check_out: string
  status: 'hadir' | 'terlambat' | 'absen'
}
