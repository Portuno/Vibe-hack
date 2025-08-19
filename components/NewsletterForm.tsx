'use client'

import { useState } from 'react'
import { Mail, Check, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const NewsletterForm = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar que tenemos el cliente de Supabase
    if (!supabase) {
      setError('Newsletter no disponible en este momento')
      return
    }
    
    setIsSubmitting(true)
    setError('')

    try {
      const normalizedEmail = email.trim().toLowerCase()

      // 1) ¿Ya existe? Si existe, tratamos como éxito silencioso
      const { data: existing, error: selectError } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', normalizedEmail)
        .limit(1)

      if (selectError) {
        throw selectError
      }

      if (existing && existing.length > 0) {
        setIsSubmitted(true)
        setEmail('')
        return
      }

      // 2) Insertar si no existe
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: normalizedEmail, is_active: true, source: 'website' }])

      if (insertError) {
        // Si es conflicto único (duplicado), también lo consideramos éxito
        const pgCode = (insertError as unknown as { code?: string })?.code
        if (pgCode === '23505') {
          setIsSubmitted(true)
          setEmail('')
          return
        }
        throw insertError
      }

      setIsSubmitted(true)
      setEmail('')
    } catch (err) {
      setError('Error al suscribirse. Intenta de nuevo.')
      console.error('Error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-green-200/50 shadow-lg">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-700 mb-4">
            ¡Gracias por suscribirte!
          </h3>
          <p className="text-green-600 mb-6 text-base leading-relaxed max-w-md mx-auto">
            Mientras tanto, únete a nuestra comunidad en Telegram para estar al tanto de todas las novedades y conectar con otros innovadores.
          </p>
          <a
            href="https://t.me/+Qp73D_rzUmo2ODNk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
          >
            <span>Únete a Telegram</span>
            <span className="text-xl">→</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-teal-500 rounded-full mb-4">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Mantente Informado</h3>
        <p className="text-gray-600 text-lg">
          Recibe las últimas novedades del ecosistema innovador de Valencia
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 text-lg transition-all duration-300 bg-white/50 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Consentimiento para recibir novedades */}
        <div className="pt-2">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <div className="text-sm text-gray-600 leading-relaxed">
              <span className="font-medium">Acepto recibir novedades y anuncios</span> de parte de Terreta Hub, incluyendo información sobre eventos, recursos y oportunidades de la comunidad innovadora de Valencia. Puedo cancelar mi suscripción en cualquier momento.
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full gradient-bg text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg group"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <span>¡Notificarme!</span>
              <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <p className="text-xs text-gray-500 text-center">
          No compartiremos tu email con nadie. Solo recibirás actualizaciones relevantes.
        </p>
      </form>
    </div>
  )
}

export default NewsletterForm
