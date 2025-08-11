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
        console.log('Supabase client:', supabase)
        
        // Verificar qué tablas existen
        const { data: tables, error: tablesError } = await supabase!
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
        
        console.log('Available tables:', tables, 'Error:', tablesError)
        
        // Verificar que podemos hacer una consulta simple
        const { data: testData, error: testError } = await supabase!
          .from('hackathon_registrations')
          .select('id')
          .limit(1)
        
        console.log('Test query result:', { testData, testError })
        
        // Fetch del conteo total - usando la estructura real de la tabla
        const { count: totalRegistrations, error: countError } = await supabase!
          .from('hackathon_registrations')
          .select('*', { count: 'exact', head: true })

        if (countError) {
          console.error('Count error:', countError)
          throw countError
        }

        console.log('Total registrations:', totalRegistrations)

        // Como no hay campo status, todos los registros se consideran confirmados
        // O podemos filtrar por algún otro criterio si es necesario
        const confirmedRegistrations = totalRegistrations

        console.log('Confirmed registrations:', confirmedRegistrations)

        // count = total, totalCount = confirmed (que es igual al total en este caso)
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
