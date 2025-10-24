"use client"

import Header from '@/components/Header'
import { Calendar } from 'lucide-react'
import { useI18n } from '@/components/i18n/LanguageProvider'

export default function AgendaPage() {
  const { t } = useI18n()
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
              <span className="gradient-text">{t('pages.agenda.title')}</span>
            </h1>
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 max-w-3xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-left">{t('pages.agenda.scheduleTitle')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-primary-100 bg-primary-50/40 p-4 text-left">
                  <div className="text-xs uppercase tracking-wide text-primary-600 mb-2">{t('pages.agenda.day7')}</div>
                  <div className="text-2xl font-extrabold text-primary-700">{t('pages.agenda.hours7')}</div>
                </div>
                <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-4 text-left">
                  <div className="text-xs uppercase tracking-wide text-teal-600 mb-2">{t('pages.agenda.day8')}</div>
                  <div className="text-2xl font-extrabold text-teal-700">{t('pages.agenda.hours8')}</div>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 text-left">
                  <div className="text-xs uppercase tracking-wide text-orange-600 mb-2">{t('pages.agenda.day9')}</div>
                  <div className="text-2xl font-extrabold text-orange-700">{t('pages.agenda.hours9')}</div>
                </div>
              </div>

              <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary-500 via-teal-500 to-orange-500 w-full" />
              </div>
            </div>
          </div>

          {/* Pre-Hackathon Event */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border border-purple-100 mt-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ¡Prepárate para la Victoria!
                </span>
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Desarrolla tu Negocio con IA: Usando Studio y Base44
              </h3>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-lg font-semibold text-orange-800">
                  ⚠️ ¡Nota! Esta sesión se impartirá completamente en <span className="underline">INGLÉS</span>.
                </p>
              </div>
              
              <div className="text-left max-w-4xl mx-auto">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Únete al equipo de <span className="font-semibold text-purple-700">Wix University</span> para descubrir cómo construir un sitio web impresionante y responsivo utilizando <span className="font-semibold">Wix Studio</span> —nuestra plataforma de creación avanzada para el diseño web moderno— y obtén una visión exclusiva de <span className="font-semibold">Base44</span>, la tecnología de IA recientemente adquirida por Wix que está remodelando el futuro de la creación web.
                </p>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  En esta sesión, aprenderás a diseñar, personalizar y lanzar un sitio profesional con las herramientas de diseño flexibles de Studio y sus potentes funciones. Luego, verás cómo Base44 acelera el desarrollo de IA a través de una sólida biblioteca de modelos y una infraestructura intuitiva, abriendo nuevas posibilidades para la automatización, el diseño inteligente y experiencias digitales más sofisticadas.
                </p>
                
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Tanto si estás creando un portafolio, un sitio de negocios o un proyecto creativo, esta sesión te dará las herramientas y la inspiración para darle vida a tu visión.
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-6 mb-8">
                  <h4 className="text-xl font-bold text-green-800 mb-4">🎁 Beneficios Clave:</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">•</span>
                      <span><span className="font-semibold">GRATIS:</span> Todos los asistentes recibirán un plan Wix Premium de un año para apoyar su proyecto.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">•</span>
                      <span>Los estudiantes son elegibles para la <span className="font-semibold">Certificación #WixStudio</span> —una credencial reconocida en la industria del diseño web responsivo.</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">📅 Día</h4>
                    <p className="text-gray-600">Martes, 28 de Octubre de 2025</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">🕐 Horarios Globales</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>🇪🇸 España (CEST): 19:00</p>
                      <p>🇺🇸 Costa Este (EST): 14:00</p>
                      <p>🇺🇸 Costa Oeste (PST): 11:00</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">📧 Requisito de Registro</h4>
                    <p className="text-gray-600 text-sm">
                      Por favor, regístrate con una dirección de correo electrónico válida 
                      (terminada en .edu o de tu institución educativa) para poder asistir.
                    </p>
                  </div>
                </div>
              </div>
              
              <a
                href="https://wix.zoom.us/webinar/register/WN_SnswuCGiQfWOiVmYcD0M7Q#/registration"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                <Calendar className="h-6 w-6" />
                <span>Regístrate aquí</span>
              </a>
              
              <p className="text-sm text-gray-500 mt-4">
                ✨ Sesión gratuita • Cupos limitados • ¡No te la pierdas!
              </p>
            </div>
          </div>
          
          {/* CTA de regreso */}
          <div className="mt-12">
            <a
              href="/"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              <span>{t('pages.agenda.backHome')}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

