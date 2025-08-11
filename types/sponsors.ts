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

export interface SponsorCardProps {
  sponsor: Sponsor
  className?: string
}
