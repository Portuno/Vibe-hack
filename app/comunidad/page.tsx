import Header from '@/components/Header'
import { Send, Users, Heart, ArrowRight } from 'lucide-react'

export default function ComunidadPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Únete a nuestra{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Comunidad
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VibeHack es más que un evento; es un movimiento. Conecta, colabora y crece con innovadores de toda la región.
            </p>
          </div>

          {/* Community Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Telegram Oficial - Main Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <Send className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Telegram Oficial</h3>
                </div>
                <p className="text-gray-600 text-lg mb-8 flex-grow">
                  El punto de encuentro para todos los participantes. Resuelve dudas, encuentra equipo y comparte tu progreso.
                </p>
                <a
                  href="https://t.me/+Qp73D_rzUmo2ODNk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 w-fit"
                >
                  <span>Unirme al grupo</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right Column Cards */}
            <div className="space-y-8">
              {/* Futuros eventos */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mr-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Futuros eventos</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Únete para saber más sobre la Hackathon y futuros eventos.
                </p>
              </div>

              {/* Síguenos en redes */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mr-3">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Síguenos en redes</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  para no perderte ninguna novedad
                </p>
              </div>

              {/* Contacto */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-3">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Contacto</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  ¿Tienes dudas o quieres ser sponsor?
                </p>
                <a
                  href="/contacto"
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                >
                  <span>Contactar</span>
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
