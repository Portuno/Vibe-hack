'use client'

import { Sponsor } from '@/types/sponsors'

interface SponsorCardProps {
  sponsor: Sponsor
  variant?: 'main' | 'co'
  className?: string
}

const SponsorCard = ({ sponsor, variant = 'co', className = '' }: SponsorCardProps) => {
  const handleCardClick = () => {
    if (sponsor.website_url) {
      window.open(sponsor.website_url, '_blank', 'noopener,noreferrer')
    }
  }

  // Estilos base según la variante
  const baseStyles = variant === 'main' 
    ? 'bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-purple-100'
    : 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer'

  // Tamaños según la variante
  const logoSize = variant === 'main' ? 'w-32 h-32' : 'w-16 h-16'
  const padding = variant === 'main' ? 'p-10' : 'p-6'
  const titleSize = variant === 'main' ? 'text-2xl' : 'text-lg'
  const descriptionSize = variant === 'main' ? 'text-base' : 'text-sm'

  return (
    <div 
      onClick={handleCardClick}
      className={`${baseStyles} ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
      aria-label={`Visitar sitio web de ${sponsor.name}`}
    >
      <div className={`${padding} text-center`}>
        {/* Logo */}
        <div className={`${logoSize} mx-auto mb-6`}>
          {sponsor.logo_url ? (
            <img 
              src={sponsor.logo_url} 
              alt={`Logo de ${sponsor.name}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-teal-100 rounded-full flex items-center justify-center">
              <span className={`font-bold text-gray-600 ${variant === 'main' ? 'text-4xl' : 'text-xl'}`}>
                {sponsor.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className={`${titleSize} font-bold text-gray-900 mb-4`}>
          {sponsor.name}
        </h3>

        {/* Description */}
        {sponsor.description && (
          <p className={`text-gray-600 ${descriptionSize} leading-relaxed`}>
            {sponsor.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default SponsorCard
