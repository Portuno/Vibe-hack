import { useState } from 'react'
import { supabase } from '@/lib/supabase'

// Tipos para los datos de contacto
export interface ContactData {
  name: string
  email: string
  phone?: string
  reason: 'sponsorship' | 'mentoria' | 'consultas' | 'otro'
  description: string
}

// Tipos para la respuesta del hook
interface ContactResponse {
  success: boolean
  message?: string
  error?: string
}

export const useContacts = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submitContact = async (data: ContactData): Promise<ContactResponse> => {
    // Verificar que tenemos el cliente de Supabase
    if (!supabase) {
      const errorMessage = 'Sistema de contactos no disponible en este momento'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validar datos requeridos
      if (!data.name || !data.email || !data.reason || !data.description) {
        throw new Error('Todos los campos requeridos deben estar completos')
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new Error('Formato de email inválido')
      }

      // Insertar contacto en Supabase
      const { data: contactData, error: insertError } = await supabase
        .from('contacts')
        .insert([
          {
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            phone: data.phone?.trim() || null,
            reason: data.reason,
            description: data.description.trim()
          }
        ])
        .select()

      if (insertError) {
        console.error('Error al insertar contacto:', insertError)
        throw new Error('Error al enviar el mensaje. Por favor, inténtalo de nuevo.')
      }

      if (!contactData || contactData.length === 0) {
        throw new Error('No se pudo crear el contacto. Por favor, inténtalo de nuevo.')
      }

      // Éxito
      setSuccess(true)
      setIsLoading(false)
      
      return {
        success: true,
        message: 'Mensaje enviado correctamente. Te responderemos pronto.'
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado al enviar el mensaje'
      setError(errorMessage)
      setIsLoading(false)
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const resetContact = () => {
    setError(null)
    setSuccess(false)
    setIsLoading(false)
  }

  return {
    submitContact,
    resetContact,
    isLoading,
    error,
    success
  }
} 