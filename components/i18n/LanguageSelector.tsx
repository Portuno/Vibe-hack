'use client'

import { useI18n } from './LanguageProvider'

interface LanguageSelectorProps {
  compact?: boolean
  dropdown?: boolean
}

export const LanguageSelector = ({ compact = false, dropdown = false }: LanguageSelectorProps) => {
  const { locale, setLocale } = useI18n()

  const handleChange = (next: 'es' | 'en') => {
    if (next === locale) return
    setLocale(next)
  }

  if (!dropdown && compact) {
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

  if (!dropdown) {
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
    return null
  }

  // Dropdown mode
  return (
    <div className="relative">
      <details className="group">
        <summary className="list-none cursor-pointer select-none inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50">
          {locale === 'es' ? 'Español' : 'English'}
          <svg className="ml-2 h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
          </svg>
        </summary>
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg p-1 z-50">
          <button
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${locale === 'es' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
            onClick={() => handleChange('es')}
            aria-current={locale === 'es'}
          >
            Español
          </button>
          <button
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${locale === 'en' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
            onClick={() => handleChange('en')}
            aria-current={locale === 'en'}
          >
            English
          </button>
        </div>
      </details>
    </div>
  )
}


