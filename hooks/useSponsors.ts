'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Sponsor } from '@/types/sponsors'

export const useSponsors = () => {
  const [principalSponsors, setPrincipalSponsors] = useState<Sponsor[]>([])
  const [coSponsors, setCoSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setLoading(true)
        
        // Obtener sponsors desde Supabase
        const { data, error: supabaseError } = await supabase
          .from('sponsors')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        // Filtrar sponsors por tier
        const principals = data?.filter(sponsor => sponsor.tier === 'principal') || []
        const coSponsors = data?.filter(sponsor => sponsor.tier === 'co-sponsor') || []
        
        setPrincipalSponsors(principals)
        setCoSponsors(coSponsors)
        setError(null)
      } catch (err) {
        setError('Error al cargar los sponsors')
        console.error('Error fetching sponsors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSponsors()
  }, [])

  return {
    principalSponsors,
    coSponsors,
    loading,
    error
  }
}
