'use client'

import { useI18n } from './LanguageProvider'

interface LanguageSelectorProps {
  compact?: boolean
}

export const LanguageSelector = ({ compact = false }: LanguageSelectorProps) => {
  const { locale, setLocale } = useI18n()

  const handleChange = (next: 'es' | 'en') => {
    if (next === locale) return
    setLocale(next)
  }

  if (compact) {
    return (
      <div className="inline-flex items-center rounded-full border border-gray-200 p-1" role="group" aria-label="language switcher">
        <button
          className={`px-2 py-1 text-sm rounded-full ${locale === 'es' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => handleChange('es')}
          aria-pressed={locale === 'es'}
        >
          ES
        </button>
        <button
          className={`ml-1 px-2 py-1 text-sm rounded-full ${locale === 'en' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => handleChange('en')}
          aria-pressed={locale === 'en'}
        >
          EN
        </button>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center space-x-2" aria-label="language selector" role="group">
      <button
        className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${locale === 'es' ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
        onClick={() => handleChange('es')}
        aria-pressed={locale === 'es'}
      >
        Español
      </button>
      <button
        className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${locale === 'en' ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
        onClick={() => handleChange('en')}
        aria-pressed={locale === 'en'}
      >
        English
      </button>
    </div>
  )
}


