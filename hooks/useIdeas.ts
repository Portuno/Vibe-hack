'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Idea } from '@/components/IdeaCard'

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        if (!supabase) {
          setError('El sistema de ideas no está disponible en este momento')
          setLoading(false)
          return
        }

        setLoading(true)
        const { data, error: supabaseError } = await supabase
          .from('ideas')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) throw new Error(supabaseError.message)

        setIdeas((data ?? []) as Idea[])
        setError(null)
      } catch (err) {
        console.error('Error fetching ideas:', err)
        setError('Error al cargar las ideas')
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [])

  return { ideas, loading, error }
}

export default useIdeas


