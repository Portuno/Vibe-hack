'use client'

import Image from 'next/image'

export type Idea = {
  id: string
  title: string
  categories: string[]
  problem: string
  solution: string
  mvp_features: string[]
  technologies?: string[]
  audience?: string
  business_model?: string
  image_url?: string
  demo_url?: string
  created_at?: string
}

interface IdeaCardProps {
  idea: Idea
  onClick?: () => void
}

export const IdeaCard = ({ idea, onClick }: IdeaCardProps) => {
  const {
    title,
    categories,
    problem,
    solution,
    image_url,
    created_at
  } = idea

  const getCategoryColor = (category: string) => {
    const normalized = category.toLowerCase()
    if (normalized.includes('b2c')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (normalized.includes('b2b')) return 'bg-green-50 text-green-700 border-green-200'
    if (normalized.includes('causa') || normalized.includes('social')) return 'bg-purple-50 text-purple-700 border-purple-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <article 
      className="group rounded-2xl border border-gray-100 hover:border-primary-200 bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-primary-500"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {image_url ? (
        <div className="relative h-32 w-full">
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-2 bg-gradient-to-r from-primary-500 to-teal-500" />
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>

        {categories?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1" aria-label="categories">
            {categories.slice(0, 2).map((cat) => (
              <span key={cat} className={`text-xs px-2 py-1 rounded-full font-medium border ${getCategoryColor(cat)}`}>
                {cat}
              </span>
            ))}
            {categories.length > 2 && (
              <span className="text-xs px-2 py-1 rounded-full font-medium border bg-gray-50 text-gray-600">
                +{categories.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          <p className="line-clamp-2">
            <span className="font-medium text-gray-900">Problema:</span> {problem}
          </p>
          <p className="line-clamp-2">
            <span className="font-medium text-gray-900">Solución:</span> {solution}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {created_at && new Date(created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <div className="flex items-center text-primary-600 text-sm font-medium">
            Ver detalles
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  )
}

export default IdeaCard


