import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const useInscritosCount = () => {
  const [count, setCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Solo hacer fetch si tenemos el cliente de Supabase
    if (!supabase) {
      setError('Supabase not configured')
      return
    }

    const fetchCount = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('Fetching inscritos count...')
        
        // Fetch del conteo total
        const { count: totalRegistrations, error: countError } = await supabase!
          .from('hackathon_registrations')
          .select('*', { count: 'exact', head: true })

        if (countError) throw countError

        console.log('Total registrations:', totalRegistrations)

        // Fetch del conteo confirmado
        const { count: confirmedRegistrations, error: confirmedError } = await supabase!
          .from('hackathon_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('registration_status', 'confirmed')

        if (confirmedError) throw confirmedError

        console.log('Confirmed registrations:', confirmedRegistrations)

        // count = total, totalCount = confirmed
        setCount(totalRegistrations || 0)
        setTotalCount(confirmedRegistrations || 0)
        
        console.log('Final counts - Total:', totalRegistrations, 'Confirmed:', confirmedRegistrations)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        setError(errorMessage)
        console.error('Error fetching inscritos count:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCount()
  }, [])

  return { count, totalCount, isLoading, error }
}
