'use client'

import Image from 'next/image'
import type { Idea } from './IdeaCard'

interface IdeaModalProps {
  idea: Idea | null
  isOpen: boolean
  onClose: () => void
}

export const IdeaModal = ({ idea, isOpen, onClose }: IdeaModalProps) => {
  if (!isOpen || !idea) return null

  const getCategoryColor = (category: string) => {
    const normalized = category.toLowerCase()
    if (normalized.includes('b2c')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (normalized.includes('b2b')) return 'bg-green-50 text-green-700 border-green-200'
    if (normalized.includes('causa') || normalized.includes('social')) return 'bg-purple-50 text-purple-700 border-purple-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative">
          {idea.image_url ? (
            <div className="relative h-64 w-full">
              <Image
                src={idea.image_url}
                alt={idea.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-16 bg-gradient-to-r from-primary-500 to-teal-500" />
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-16rem)] overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{idea.title}</h2>
            
            {idea.categories?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4" aria-label="categories">
                {idea.categories.map((cat) => (
                  <span key={cat} className={`text-sm px-3 py-1 rounded-full font-medium border ${getCategoryColor(cat)}`}>
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {idea.created_at && (
              <p className="text-sm text-gray-500 mb-4">
                Publicado el {new Date(idea.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>

          <div className="space-y-6">
            {/* Problema */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Problema</h3>
              <p className="text-gray-700 leading-relaxed">{idea.problem}</p>
            </div>

            {/* Solución */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Solución</h3>
              <p className="text-gray-700 leading-relaxed">{idea.solution}</p>
            </div>

            {/* MVP Features */}
            {idea.mvp_features?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Características MVP</h3>
                <ul className="space-y-2">
                  {idea.mvp_features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tecnologías */}
            {idea.technologies && idea.technologies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tecnologías</h3>
                <div className="flex flex-wrap gap-2">
                  {idea.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Público objetivo */}
            {idea.audience && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Público Objetivo</h3>
                <p className="text-gray-700">{idea.audience}</p>
              </div>
            )}

            {/* Modelo de negocio */}
            {idea.business_model && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Modelo de Negocio</h3>
                <p className="text-gray-700">{idea.business_model}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {idea.demo_url && (
              <a
                href={idea.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver Demo
              </a>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default IdeaModal
