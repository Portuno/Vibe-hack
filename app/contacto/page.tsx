'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { Send, Mail, Phone, User, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react'
import { useContacts, ContactData } from '@/hooks/useContacts'

export default function ContactPage() {
  const { submitContact, resetContact, isLoading, error, success } = useContacts()
  
  const [formData, setFormData] = useState<ContactData>({
    name: '',
    email: '',
    phone: '',
    reason: 'sponsorship',
    description: ''
  })

  const handleInputChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await submitContact(formData)
    
    if (result.success) {
      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        resetContact()
        setFormData({
          name: '',
          email: '',
          phone: '',
          reason: 'sponsorship',
          description: ''
        })
      }, 3000)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 rounded-3xl p-8 border border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                ¡Mensaje Enviado! 🎉
              </h1>
              <p className="text-gray-600 mb-4">
                Te responderemos en las próximas 24-48 horas.
              </p>
              <button
                onClick={() => resetContact()}
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-all duration-200"
              >
                Enviar otro mensaje
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section - Más compacto */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Contáctanos
            </h1>
            <p className="text-lg text-gray-600">
              ¿Tienes dudas o quieres ser sponsor? Envíanos un mensaje.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulario de Contacto */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-teal-500 rounded-xl flex items-center justify-center mr-3">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Envíanos un mensaje</h2>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre y Email en la misma fila en desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Tu nombre"
                        required
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Teléfono y Motivo en la misma fila */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+34 600 000 000"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo *
                    </label>
                    <select
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="sponsorship">Sponsorship</option>
                      <option value="mentoria">Mentoría</option>
                      <option value="consultas">Consultas</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje *
                  </label>
                  <div className="relative">
                    <div className="absolute top-2 left-3 flex items-start pointer-events-none">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Cuéntanos más detalles..."
                      required
                      rows={3}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar mensaje</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Información simplificada */}
            <div className="space-y-4">
              {/* Sponsorship */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  ¿Quieres ser Sponsor? 🚀
                </h3>
                <p className="text-purple-700 text-sm">
                  Únete a VibeHack y conecta con el talento del futuro.
                </p>
              </div>

              {/* Mentoría */}
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
                <h3 className="text-lg font-bold text-teal-900 mb-2">
                  ¿Quieres ser Mentor? 🎓
                </h3>
                <p className="text-teal-700 text-sm">
                  Comparte tu experiencia y guía a nuevos innovadores.
                </p>
              </div>

              {/* Telegram */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  Telegram oficial 📱
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  Para dudas rápidas y conexión con la comunidad
                </p>
                <a
                  href="https://t.me/+Qp73D_rzUmo2ODNk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 w-full sm:w-auto"
                >
                  <span>Unirse al Telegram</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 