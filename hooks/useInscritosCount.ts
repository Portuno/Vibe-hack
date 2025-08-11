import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

// Verificar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables not found')
}

// Solo crear el cliente si tenemos las variables de entorno
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

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
        // Fetch del conteo total
        const { count: totalCount, error: countError } = await supabase
          .from('hackathon_registrations')
          .select('*', { count: 'exact', head: true })

        if (countError) throw countError

        // Fetch del conteo confirmado
        const { count: confirmedCount, error: confirmedError } = await supabase
          .from('hackathon_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('registration_status', 'confirmed')

        if (confirmedError) throw confirmedError

        setCount(totalCount || 0)
        setTotalCount(confirmedCount || 0)
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
