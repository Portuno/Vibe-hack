import Header from '@/components/Header'
import { Calendar, MessageCircle } from 'lucide-react'

export default function AgendaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Header />
      
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero */}
          <div className="mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-8">
              <Calendar className="h-10 w-10 text-primary-600" />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="gradient-text">Agenda</span>
            </h1>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ¡Más información pronto!
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Estamos preparando una agenda increíble para VibeHack 2025. 
                Mantente atento a las novedades en nuestro canal de comunicación oficial.
              </p>
              
              <div className="flex items-center justify-center space-x-3 mb-8">
                <MessageCircle className="h-6 w-6 text-blue-500" />
                <span className="text-gray-700 font-medium">Canal oficial de Telegram</span>
              </div>
              
              <a
                href="https://t.me/+Qp73D_rzUmo2ODNk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200 hover:shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Unirse al Canal</span>
              </a>
              
              <p className="text-sm text-gray-500 mt-6">
                Recibirás notificaciones sobre fechas, horarios y actividades del evento
              </p>
            </div>
          </div>
          
          {/* CTA de regreso */}
          <div className="mt-12">
            <a
              href="/"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              <span>← Volver al inicio</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
