import Header from '@/components/Header'
import { MessageSquare, Zap, Rocket, Lightbulb, Users, Trophy, Star, ArrowRight, ExternalLink } from 'lucide-react'

export default function HackathonPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Header />
      
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              ¿Qué es <span className="gradient-text">Vibe Coding</span>?
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Una nueva forma de crear software donde la inteligencia artificial se convierte en tu compañero de desarrollo. 
              No necesitas ser programador para construir tu próxima gran idea.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Lenguaje Natural</h3>
              <p className="text-gray-600 text-center">Describe tu idea en palabras simples y la IA genera el código</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-teal-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Zap className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Generación por IA</h3>
              <p className="text-gray-600 text-center">Algoritmos avanzados que escriben código funcional instantáneamente</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Rocket className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Desarrollo Rápido</h3>
              <p className="text-gray-600 text-center">De la idea al prototipo en minutos, no en días</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Enfoque Creativo</h3>
              <p className="text-gray-600 text-center">Libera tu creatividad sin limitaciones técnicas</p>
            </div>
          </div>

          {/* Revolution Section */}
          <div className="bg-gradient-to-r from-primary-600 to-teal-600 rounded-3xl p-12 text-white text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              La revolución del desarrollo está aquí
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
              Vibe Coding combina la creatividad humana con el poder de la inteligencia artificial para democratizar 
              el desarrollo de software. Tanto si eres diseñador, emprendedor, estudiante o simplemente tienes una 
              gran idea, esta hackathon es tu oportunidad de hacerla realidad.
            </p>
          </div>

          {/* Benefits and Prizes */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              Beneficios y Premios
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-4xl mx-auto">
              Esta hackathon va más allá de programar. Es una experiencia transformadora que te conectará con el futuro del desarrollo tecnológico.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Mentoría Expert</h3>
                <p className="text-gray-600 text-center">Acceso directo a mentores de la industria tech y IA</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Networking Premium</h3>
                <p className="text-gray-600 text-center">Conectá con otros innovadores, empresarios y desarrolladores</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Aprendizaje IA</h3>
                <p className="text-gray-600 text-center">Dominá las herramientas de IA más avanzadas del mercado</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Rocket className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Prototipado Rápido</h3>
                <p className="text-gray-600 text-center">Transformá ideas en productos funcionales en tiempo récord</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Premios Exclusivos</h3>
                <p className="text-gray-600 text-center">Reconocimientos, mentorías y oportunidades de inversión</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Visibilidad</h3>
                <p className="text-gray-600 text-center">Exponé tu proyecto ante inversores y líderes de la industria</p>
              </div>
            </div>
          </div>



          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">FAQ</h2>
            <p className="text-xl text-gray-600 text-center mb-12">
              Las preguntas más frecuentes sobre VibeHack. ¿No encuentras lo que buscas? Escríbenos y te ayudamos.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ¿Necesito experiencia programando?
                </h3>
                <p className="text-gray-600">
                  ¡No! Vibe Coding está diseñado para que cualquiera pueda participar, sin importar su nivel técnico.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ¿Cómo funciona exactamente el 'coding con IA'?
                </h3>
                <p className="text-gray-600">
                  Describir tu idea en lenguaje natural, y algoritmos de IA hacen el desarrollo y ediciones de código automáticamente.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ¿Qué tengo que llevar al evento?
                </h3>
                <p className="text-gray-600">
                  Solo tu laptop y mucha creatividad. Nosotros te proporcionamos el resto de herramientas y recursos.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ¿Puedo participar solo o necesito un equipo?
                </h3>
                <p className="text-gray-600">
                  Puedes participar individualmente o formar equipo. Te ayudaremos a conectar con otros participantes.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ¿Hay algún costo por participar?
                </h3>
                <p className="text-gray-600">
                  La participación es completamente gratuita. Solo necesitas ser seleccionado para participar.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ¿Qué tipo de proyectos puedo crear?
                </h3>
                <p className="text-gray-600">
                  Cualquier idea que se te ocurra: apps, webs, herramientas de IA, soluciones empresariales, etc.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Tienes más preguntas?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Puedes unirte a nuestro canal de Telegram donde estamos resolviendo dudas e inquietudes, 
              o también contactarnos por aquí.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="https://t.me/vibehack"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 transition-all duration-300 hover:scale-105 inline-flex items-center space-x-3"
              >
                <span>Unirse a Telegram</span>
                <ExternalLink className="h-5 w-5" />
              </a>
              
                             <a
                 href="/comunidad"
                 className="bg-gradient-to-r from-primary-500 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center space-x-3"
               >
                 <span>Formulario de Contacto</span>
                 <ArrowRight className="h-5 w-5" />
               </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
