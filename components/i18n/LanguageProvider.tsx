'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type SupportedLocale = AppLocale.SupportedLocale

type Dictionary = Record<string, string>

type NestedDictionary = Record<string, Dictionary | NestedDictionary | string>

const flatten = (obj: NestedDictionary, prefix = ''): Dictionary => {
  const entries: Dictionary = {}
  Object.entries(obj).forEach(([key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      entries[nextKey] = value
      return
    }
    entries[nextKey] = ''
    Object.assign(entries, flatten(value as NestedDictionary, nextKey))
  })
  return entries
}

const ES_DICTIONARY = flatten({
  nav: {
    hackathon: 'Hackathon',
    sponsors: 'Sponsors',
    agenda: 'Agenda',
    ideatorio: 'Ideatorio',
    community: 'Comunidad',
    resources: 'Recursos',
  },
  labels: {
    soon: 'Pronto',
    moreInfoSoon: '¡Más información pronto!'
  },
  cta: {
    registerNow: '¡Inscríbete Ahora!',
    signupHackathon: 'Inscribirse en la Hackathon'
  },
  pages: {
    ideatorio: {
      title: 'Ideatorio',
      intro: 'Un espacio con ideas accionables para construir en 72 horas.'
    }
  },
  a11y: {
    toggleMenu: 'Alternar menú'
  }
})

const EN_DICTIONARY = flatten({
  nav: {
    hackathon: 'Hackathon',
    sponsors: 'Sponsors',
    agenda: 'Agenda',
    ideatorio: 'Idea Lab',
    community: 'Community',
    resources: 'Resources',
  },
  labels: {
    soon: 'Soon',
    moreInfoSoon: 'More information soon!'
  },
  cta: {
    registerNow: 'Register Now!',
    signupHackathon: 'Sign up for the Hackathon'
  },
  pages: {
    ideatorio: {
      title: 'Idea Lab',
      intro: 'A space with actionable ideas to build in 72 hours.'
    }
  },
  a11y: {
    toggleMenu: 'Toggle menu'
  }
})

const LOCALES: Record<SupportedLocale, Dictionary> = {
  es: ES_DICTIONARY,
  en: EN_DICTIONARY,
}

type I18nContextValue = {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const STORAGE_KEY = 'app.locale'

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>('es')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as SupportedLocale | null) : null
    if (stored && (stored === 'es' || stored === 'en')) {
      setLocaleState(stored)
      return
    }
    const browser = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'es'
    const initial: SupportedLocale = browser.startsWith('en') ? 'en' : 'es'
    setLocaleState(initial)
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale)
    }
  }, [locale])

  const setLocale = (next: SupportedLocale) => {
    setLocaleState(next)
  }

  const t = useMemo(() => {
    const dict = LOCALES[locale]
    return (key: string) => dict[key] ?? key
  }, [locale])

  const value: I18nContextValue = { locale, setLocale, t }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}


