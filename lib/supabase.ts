import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Sponsor {
  id: string
  name: string
  description: string
  logo_url: string
  website_url: string
  tier: 'principal' | 'co-sponsor'
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  created_at: string
  updated_at: string
  is_active: boolean
  source: string
}

export interface HackathonRegistration {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: string
  role?: string
  skills: string
  experience?: string
  team_preference?: 'individual' | 'team' | 'random'
  motivation: string
  status: 'pending' | 'approved' | 'rejected' | 'waitlist'
  created_at: string
  updated_at: string
  notes?: string
  assigned_team_id?: string
}

export interface HackathonTeam {
  id: string
  name: string
  max_members: number
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  registration_id: string
  role: string
  joined_at: string
}
