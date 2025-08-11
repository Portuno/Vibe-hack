import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Variables de entorno de Supabase no están definidas')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'Definida' : 'No definida')
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '')

export const useInscritosCount = () => {
  const [count, setCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCount = async () => {
    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Credenciales de Supabase no configuradas')
      }

      setIsLoading(true)
      setError(null)
      
      console.log('🔄 Intentando conectar a Supabase...')
      console.log('🔑 URL:', supabaseUrl)
      console.log('🔑 Key presente:', !!supabaseKey)
      
      // Usar la función RPC segura (recomendada)
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_hackathon_registrations_count')
      
      if (rpcError) {
        console.error('❌ Error en RPC get_hackathon_registrations_count:', rpcError.message)
        throw new Error(rpcError.message)
      }
      
      if (typeof rpcData === 'number') {
        console.log('✅ Conteo vía RPC:', rpcData)
        setCount(rpcData)
      } else {
        console.error('❌ RPC devolvió tipo inesperado:', typeof rpcData, rpcData)
        throw new Error('RPC devolvió tipo inesperado')
      }
      
      // También obtener registros confirmados (opcional)
      try {
        const { count: confirmedInscritos, error: confirmedError } = await supabase
          .from('hackathon_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('registration_status', 'confirmed')

        if (!confirmedError) {
          setTotalCount(confirmedInscritos || 0)
          console.log('📊 Registros confirmados:', confirmedInscritos)
        } else {
          console.warn('⚠️ No se pudieron obtener registros confirmados:', confirmedError.message)
          setTotalCount(0)
        }
      } catch (confirmedErr) {
        console.warn('⚠️ Error obteniendo confirmados:', confirmedErr)
        setTotalCount(0)
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener el conteo de inscritos'
      setError(errorMessage)
      console.error('❌ Error completo:', err)
      
      if (err instanceof Error && err.message.includes('function "get_hackathon_registrations_count" does not exist')) {
        setError('La función RPC no existe. Ejecuta el SQL de creación primero.')
      }
      if (err instanceof Error && err.message.includes('permission denied')) {
        setError('Error de permisos. Verifica las políticas de Supabase.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCount()

    // Escuchar el evento de inscripción completada
    const handleInscripcionCompletada = () => {
      console.log('🔄 Evento de inscripción detectado, actualizando conteo...')
      fetchCount()
    }

    window.addEventListener('inscripcion-completada', handleInscripcionCompletada)

    // Cleanup
    return () => {
      window.removeEventListener('inscripcion-completada', handleInscripcionCompletada)
    }
  }, [])

  const refreshCount = async () => {
    console.log('🔄 Refrescando conteo manualmente...')
    await fetchCount()
  }

  return {
    count,           // Solo registros confirmados (para mostrar públicamente)
    totalCount,      // Total de registros (para admin)
    isLoading,
    error,
    refreshCount
  }
}
