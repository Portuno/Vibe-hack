import Header from '@/components/Header'
import { Wrench, BookOpen, ExternalLink, Download, Star, Search, Filter } from 'lucide-react'

export default function RecursosPage() {
  // Mock data - esto será reemplazado por datos de la base de datos
  const tools = [
    {
      id: 1,
      name: 'ChatGPT API',
      description: 'Integración con GPT-4 para generación de texto y código',
      category: 'IA & Machine Learning',
      link: 'https://openai.com/api',
      tags: ['API', 'IA', 'Texto', 'Código'],
      rating: 4.8,
      downloads: 1250,
      isFree: false,
      price: '$0.002/1K tokens'
    },
    {
      id: 2,
      name: 'GitHub Copilot',
      description: 'Asistente de código impulsado por IA que sugiere código en tiempo real',
      category: 'Desarrollo',
      link: 'https://github.com/features/copilot',
      tags: ['IA', 'Código', 'Productividad', 'IDE'],
      rating: 4.6,
      downloads: 8900,
      isFree: false,
      price: '$10/mes'
    },
    {
      id: 3,
      name: 'Midjourney',
      description: 'Generación de imágenes con IA de alta calidad',
      category: 'Diseño & Multimedia',
      link: 'https://midjourney.com',
      tags: ['IA', 'Imágenes', 'Diseño', 'Creatividad'],
      rating: 4.9,
      downloads: 3200,
      isFree: false,
      price: '$10/mes'
    },
    {
      id: 4,
      name: 'Supabase',
      description: 'Alternativa open source a Firebase con base de datos PostgreSQL',
      category: 'Backend & Base de Datos',
      link: 'https://supabase.com',
      tags: ['Base de Datos', 'Backend', 'Auth', 'Open Source'],
      rating: 4.7,
      downloads: 5600,
      isFree: true,
      price: 'Gratis'
    }
  ]

  const guides = [
    {
      id: 1,
      title: 'Configuración del Entorno de Desarrollo',
      description: 'Guía completa para configurar tu entorno de desarrollo en 5 minutos',
      category: 'Configuración',
      duration: '5 min',
      difficulty: 'Fácil',
      author: 'Equipo VibeHack',
      tags: ['Setup', 'Entorno', 'Principiantes'],
      rating: 4.9,
      views: 2100,
      isPremium: false
    },
    {
      id: 2,
      title: 'Primera API con Next.js y TypeScript',
      description: 'Crea tu primera API REST con Next.js y TypeScript paso a paso',
      category: 'Desarrollo Web',
      duration: '15 min',
      difficulty: 'Intermedio',
      author: 'María García',
      tags: ['Next.js', 'TypeScript', 'API', 'Backend'],
      rating: 4.8,
      views: 1800,
      isPremium: false
    },
    {
      id: 3,
      title: 'Integración con Supabase para Autenticación',
      description: 'Conecta tu app con Supabase para autenticación y base de datos',
      category: 'Backend',
      duration: '20 min',
      difficulty: 'Intermedio',
      author: 'Carlos Rodríguez',
      tags: ['Supabase', 'Auth', 'Base de Datos', 'Backend'],
      rating: 4.7,
      views: 1500,
      isPremium: false
    },
    {
      id: 4,
      title: 'Creando un Chatbot con IA en 30 minutos',
      description: 'Tutorial avanzado para crear un chatbot funcional usando APIs de IA',
      category: 'IA & Machine Learning',
      duration: '30 min',
      difficulty: 'Avanzado',
      author: 'Ana Martínez',
      tags: ['IA', 'Chatbot', 'API', 'Avanzado'],
      rating: 4.9,
      views: 950,
      isPremium: true
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Header />
      
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="gradient-text">Recursos</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas y guías para acelerar tu desarrollo y hacer realidad tu idea
            </p>
          </div>

          {/* Tools Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Herramientas</h2>
                  <p className="text-gray-600">Recursos y software para potenciar tu desarrollo</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar herramientas..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Filtrar</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <div key={tool.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tool.isFree ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {tool.isFree ? 'Gratis' : 'Pago'}
                      </span>
                      <span className="text-xs text-gray-500">{tool.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{tool.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tool.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">💰 {tool.price}</span>
                    <span className="text-sm text-gray-500">⬇️ {tool.downloads.toLocaleString()}</span>
                  </div>

                  <div className="flex space-x-2">
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-primary-700 transition-colors inline-flex items-center justify-center space-x-2"
                    >
                      <span>Visitar</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guides Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Guías & Tutoriales</h2>
                  <p className="text-gray-600">Aprende paso a paso con contenido creado por expertos</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar guías..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Filtrar</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <div key={guide.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        guide.isPremium ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {guide.isPremium ? 'Premium' : 'Gratis'}
                      </span>
                      <span className="text-xs text-gray-500">{guide.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{guide.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {guide.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <span>⏱️ {guide.duration}</span>
                    <span>📊 {guide.difficulty}</span>
                    <span>👁️ {guide.views.toLocaleString()}</span>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    Por <span className="font-medium">{guide.author}</span>
                  </div>

                  <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-primary-700 transition-colors">
                    Empezar Tutorial
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Necesitas ayuda con algún recurso?
              </h3>
              <p className="text-gray-600 mb-6">
                Nuestro equipo está aquí para ayudarte a aprovechar al máximo estos recursos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://t.me/+Qp73D_rzUmo2ODNk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <span>Únete al Grupo</span>
                  <span>→</span>
                </a>
                <a
                  href="/comunidad"
                  className="border-2 border-primary-500 text-primary-700 px-8 py-4 rounded-full font-semibold hover:bg-primary-50 transition-all duration-200 inline-block"
                >
                  Ver Comunidad
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
