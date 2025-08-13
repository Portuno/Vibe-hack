import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface OnboardingData {
  full_name: string
  email: string
  phone: string
  social_link: string
  role: string
  team_preference: 'solo' | 'buscando' | 'equipo'
  team_name: string
  team_members: string
  project_status: string[]
  project_focus: string
  skills: {
    creativity: number
    programming: number
    design: number
    communication: number
    leadership: number
    ai_tools: number
  }
  astrology: {
    solar_sign: string
    ascendant: string
    lunar_sign: string
    opinion: string
  }
  ai_tools_used: string[]
  expectations: string[]
  consent_newsletter: boolean
}

export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submitOnboarding = async (data: OnboardingData) => {
    // Verificar que tenemos el cliente de Supabase
    if (!supabase) {
      setError('Supabase not configured')
      return { success: false, error: 'Supabase not configured' }
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Preparar los datos para Supabase - formato que coincide con la tabla
      const supabaseData = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        social_link: data.social_link,
        role: data.role,
        team_preference: data.team_preference,
        team_name: data.team_name,
        team_members: data.team_members,
        project_status: data.project_status, // Mantener como array
        project_focus: [data.project_focus], // Convertir a array
        skills: data.skills, // Mantener como objeto
        // Campos individuales de habilidades
        creativity: data.skills.creativity,
        programming: data.skills.programming,
        design: data.skills.design,
        communication: data.skills.communication,
        leadership: data.skills.leadership,
        ai_tools: data.skills.ai_tools,
        // Campos individuales de astrología
        astrology: data.astrology, // Mantener como objeto
        sun_sign: data.astrology.solar_sign,
        ascendant: data.astrology.ascendant,
        moon_sign: data.astrology.lunar_sign,
        astrology_opinion: data.astrology.opinion,
        ai_tools_used: data.ai_tools_used, // Mantener como array
        expectations: data.expectations, // Mantener como array
        consent_newsletter: data.consent_newsletter, // Consentimiento para newsletter
        registration_status: 'pending', // Estado por defecto
        created_at: new Date().toISOString()
      }

      console.log('Enviando datos a Supabase:', supabaseData)

      const { error: supabaseError } = await supabase
        .from('hackathon_registrations')
        .insert([supabaseData])

      if (supabaseError) {
        console.error('Error de Supabase:', supabaseError)
        throw new Error(supabaseError.message)
      }

      setSuccess(true)
      
      // Disparar un evento personalizado para que otros componentes sepan que se actualizó el conteo
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('inscripcion-completada'))
      }
      
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al enviar el formulario'
      setError(errorMessage)
      console.error('Error completo:', err)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const resetOnboarding = () => {
    setError(null)
    setSuccess(false)
    setIsLoading(false)
  }

  return {
    submitOnboarding,
    resetOnboarding,
    isLoading,
    error,
    success
  }
}
