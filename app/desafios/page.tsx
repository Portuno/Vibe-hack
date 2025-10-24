"use client"

import Header from '@/components/Header'
import { Target, Users, Heart, Zap, Globe } from 'lucide-react'

export default function DesafiosPage() {

  const challenges = [
    {
      id: 1,
      icon: Users,
      title: "Desafío 1: Innovación Tecnológica para Estudiantes",
      problem: "Los estudiantes se enfrentan a numerosos desafíos en la educación: desde la gestión del tiempo y las tareas hasta la búsqueda de recursos y la conexión con sus compañeros. ¿Cómo puede la tecnología ayudar a los estudiantes a aprender mejor, colaborar de manera más inteligente y tener éxito en su recorrido académico?",
      goal: "Diseñar una aplicación que aborde uno o más desafíos estudiantiles utilizando tecnología de vanguardia o enfoques innovadores. Tu solución podría centrarse en el aprendizaje, la productividad, el bienestar o la interacción social.",
      color: "bg-blue-500"
    },
    {
      id: 2,
      icon: Heart,
      title: "Desafío 2: Innovación Tecnológica en la Atención Médica",
      problem: "Los sistemas de atención médica se enfrentan a constantes desafíos, incluyendo la atención al paciente, la accesibilidad y la eficiencia. ¿Cómo puede la tecnología transformar la prestación de atención médica o mejorar los resultados para los pacientes?",
      goal: "Desarrollar una aplicación que innove en la atención médica. Esto podría involucrar la telemedicina, la gestión de pacientes, el seguimiento del bienestar, diagnósticos con IA u otra solución creativa que mejore los resultados de salud o la accesibilidad.",
      color: "bg-red-500"
    },
    {
      id: 3,
      icon: Globe,
      title: "Desafío 3: Innovación para Comunidades Remotas",
      problem: "Las comunidades remotas o desatendidas a menudo carecen de acceso a recursos, sistemas financieros o redes de apoyo social. ¿Cómo puede la tecnología resolver un problema social, empresarial o financiero en estas áreas?",
      goal: "Crear una aplicación que aborde un desafío crítico en una comunidad remota o desatendida. Tu solución podría centrarse en: Impacto Social (educación, acceso a la atención médica, participación comunitaria), Negocios (apoyo a negocios locales, creación de mercados, mejora de la logística), o Finanzas y Tecnología (inclusión financiera, banca móvil, microcréditos o herramientas de presupuesto).",
      color: "bg-green-500"
    },
    {
      id: 4,
      icon: Zap,
      title: "Desafío 4: Innovación Tecnológica en Redes Sociales",
      problem: "Las redes sociales conectan a miles de millones de personas, pero también enfrentan problemas como la desinformación, el impacto en la salud mental, las preocupaciones por la privacidad y la falta de interacción significativa. ¿Cómo puede la tecnología mejorar las experiencias de las redes sociales para los usuarios mientras aborda estos desafíos?",
      goal: "Diseñar una aplicación o plataforma que reimagine las redes sociales. Tu solución podría centrarse en fomentar interacciones positivas y el bienestar mental, promover contenido confiable y combatir la desinformación, mejorar la participación comunitaria o redes de nicho, o formas innovadoras de conectar a las personas más allá de los 'me gusta' y las acciones.",
      color: "bg-purple-500"
    },
    {
      id: 5,
      icon: Target,
      title: "Desafío 5: Solución Innovadora para Problemas del Mundo Real",
      problem: "El mundo se enfrenta a innumerables desafíos complejos en áreas como el medio ambiente, el transporte, la vida urbana y la sostenibilidad. ¿Cómo se puede aplicar la tecnología para crear soluciones prácticas y escalables a problemas del mundo real?",
      goal: "Desarrollar una aplicación que aborde un problema apremiante en cualquier dominio, ofreciendo una solución clara e innovadora. Los ejemplos incluyen sostenibilidad ambiental (gestión de residuos, eficiencia energética, acción climática), soluciones de ciudad inteligente (transporte, seguridad, planificación urbana), accesibilidad e inclusión (herramientas para personas con capacidades diferentes, acceso a la educación), o cualquier otro desafío del mundo real donde tu solución genere un impacto.",
      color: "bg-orange-500"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Header />
      
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-8">
              <Target className="h-10 w-10 text-primary-600" />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="gradient-text">Desafíos</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cinco desafíos únicos que pondrán a prueba tu creatividad y habilidades técnicas. 
              Elige el que más te inspire y construye una solución innovadora en 72 horas.
            </p>
          </div>

          {/* Challenges Grid */}
          <div className="space-y-8">
            {challenges.map((challenge) => {
              const Icon = challenge.icon
              return (
                <div key={challenge.id} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 ${challenge.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {challenge.title}
                      </h2>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Declaración del Problema:
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {challenge.problem}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Meta:
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {challenge.goal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Base44 Higher Ed Section */}
          <div className="mt-16 bg-gradient-to-r from-primary-50 to-teal-50 rounded-2xl p-8 border border-primary-100">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Base44 Higher Ed
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Una plataforma especializada para desafíos educativos y soluciones estudiantiles.
              </p>
              <div className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-full font-semibold">
                <Zap className="h-5 w-5" />
                <span>Herramienta recomendada para Desafío 1</span>
              </div>
            </div>
          </div>

          {/* CTA de regreso */}
          <div className="mt-12 text-center">
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
