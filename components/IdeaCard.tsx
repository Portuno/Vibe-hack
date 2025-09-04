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
}

interface IdeaCardProps {
  idea: Idea
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  const {
    title,
    categories,
    problem,
    solution,
    mvp_features,
    technologies,
    audience,
    business_model,
    image_url
  } = idea

  return (
    <article className="group rounded-2xl border border-gray-100 hover:border-primary-200 bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
      {image_url ? (
        <div className="relative h-40 w-full">
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

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        {categories?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2" aria-label="categories">
            {categories.map((cat) => (
              <span key={cat} className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Problema:</span> {problem}
          </p>
          <p>
            <span className="font-semibold">Solución:</span> {solution}
          </p>
          {mvp_features?.length > 0 && (
            <div>
              <p className="font-semibold">MVP:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {mvp_features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {technologies?.length ? (
            <p>
              <span className="font-semibold">Tecnologías:</span> {technologies.join(', ')}
            </p>
          ) : null}
          {audience ? (
            <p>
              <span className="font-semibold">Público objetivo:</span> {audience}
            </p>
          ) : null}
          {business_model ? (
            <p>
              <span className="font-semibold">Modelo de negocio:</span> {business_model}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default IdeaCard


