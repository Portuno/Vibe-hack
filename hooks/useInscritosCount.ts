import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const useInscritosCount = () => {
  const [count, setCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Solo hacer fetch si estamos en el cliente y tenemos el cliente de Supabase
    if (typeof window === 'undefined' || !supabase) {
      return
    }

    const fetchCount = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('Fetching inscritos count...')
        
        // Primero obtener todos los registros para contar
        const { data: registrations, error: fetchError } = await supabase!
          .from('hackathon_registrations')
          .select('id')

        if (fetchError) {
          console.error('Fetch error:', fetchError)
          throw fetchError
        }

        const totalRegistrations = registrations ? registrations.length : 0
        console.log('Total registrations count:', totalRegistrations)
        console.log('Registrations data:', registrations)

        // Como no hay campo status, todos los registros se consideran confirmados
        const confirmedRegistrations = totalRegistrations

        console.log('Confirmed registrations:', confirmedRegistrations)

        // count = total, totalCount = confirmed (que es igual al total en este caso)
        setCount(totalRegistrations)
        setTotalCount(confirmedRegistrations)
        
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
