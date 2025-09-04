'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type SupportedLocale = AppLocale.SupportedLocale

type Dictionary = Record<string, string>

interface NestedDictionary {
  [key: string]: string | Dictionary | NestedDictionary
}

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
    },
    home: {
      dateLocation: 'Octubre 2025 • Valencia',
      headline1: 'Construye, Lanza',
      headline2: 'y Valida en 72hs',
      tagline: 'Innovación sin límites',
      description: 'Un fin de semana intensivo para inventar la nueva era de la creación de productos. Únete a un grupo experimental de mentes innovadoras y pon a prueba técnicas disruptivas de producción y distribución con el apoyo de nuevas herramientas.',
      communityTitle: 'Comunidad Innovadora',
      communitySubtitle: '+200 mentes creativas',
      stats: {
        hours: 'Horas'
      },
      timeline: {
        friday: 'Viernes: Ideación y Formación',
        saturday: 'Sábado: Desarrollo y Testing',
        sunday: 'Domingo: Demo y Premios'
      },
      newsletter: {
        stayConnectedTitle: 'Mantente Conectado',
        stayConnectedSubtitle: 'Únete a nuestra comunidad y recibe las últimas novedades',
        formTitle: 'Mantente Informado',
        formSubtitle: 'Recibe las últimas novedades del ecosistema innovador de Valencia',
        placeholderEmail: 'tu@email.com',
        consentText: 'Acepto recibir novedades y anuncios de parte de Terreta Hub, incluyendo información sobre eventos, recursos y oportunidades de la comunidad innovadora de Valencia. Puedo cancelar mi suscripción en cualquier momento.',
        sending: 'Enviando...',
        notifyMe: '¡Notificarme!',
        privacy: 'No compartiremos tu email con nadie. Solo recibirás actualizaciones relevantes.',
        successTitle: '¡Gracias por suscribirte!',
        successDesc: 'Mientras tanto, únete a nuestra comunidad en Telegram para estar al tanto de todas las novedades y conectar con otros innovadores.',
        joinTelegram: 'Únete a Telegram'
      }
    }
    ,
    sponsors: {
      title1: 'Our',
      title2: 'Sponsors',
      description: 'We are grateful to the companies that make this event possible and support innovation.',
      main: 'Main Sponsors',
      co: 'Co-Sponsors',
      emptyTitle: 'No sponsors available',
      emptyDesc: 'Sponsors will appear here when added to the database.',
      ctaTitle: 'Want to support innovation?',
      ctaDesc: 'Become a sponsor and connect with future talent.',
      ctaButton: 'I want to sponsor'
    },
    contact: {
      successTitle: 'Message Sent! 🎉',
      successDesc: 'We will get back to you within 24-48 hours.',
      successButton: 'Send another message',
      title: 'Contact Us',
      subtitle: 'Have questions or want to sponsor? Send us a message.',
      formTitle: 'Send us a message',
      name: 'Name *',
      email: 'Email *',
      phone: 'Phone',
      reason: 'Reason *',
      reasons: { sponsorship: 'Sponsorship', mentoria: 'Mentorship', consultas: 'Inquiries', otro: 'Other' },
      message: 'Message *',
      messagePlaceholder: 'Tell us more details...',
      sending: 'Sending...',
      send: 'Send message',
      promoSponsorTitle: 'Want to be a Sponsor? 🚀',
      promoSponsorDesc: 'Join VibeHack and connect with future talent.',
      promoMentorTitle: 'Want to be a Mentor? 🎓',
      promoMentorDesc: 'Share your experience and guide new innovators.',
      telegramTitle: 'Official Telegram 📱',
      telegramDesc: 'For quick questions and community connection',
      telegramButton: 'Join Telegram'
    }
    sponsors: {
      title1: 'Nuestros',
      title2: 'Sponsors',
      description: 'Agradecemos a las empresas que hacen posible este evento y apoyan la innovación.',
      main: 'Main Sponsors',
      co: 'Co-Sponsors',
      emptyTitle: 'No hay sponsors disponibles',
      emptyDesc: 'Los sponsors aparecerán aquí cuando se agreguen a la base de datos.',
      ctaTitle: '¿Quieres apoyar la innovación?',
      ctaDesc: 'Conviértete en sponsor y conecta con el talento del futuro.',
      ctaButton: 'Quiero ser sponsor'
    },
    contact: {
      successTitle: '¡Mensaje Enviado! 🎉',
      successDesc: 'Te responderemos en las próximas 24-48 horas.',
      successButton: 'Enviar otro mensaje',
      title: 'Contáctanos',
      subtitle: '¿Tienes dudas o quieres ser sponsor? Envíanos un mensaje.',
      formTitle: 'Envíanos un mensaje',
      name: 'Nombre *',
      email: 'Email *',
      phone: 'Teléfono',
      reason: 'Motivo *',
      reasons: { sponsorship: 'Sponsorship', mentoria: 'Mentoría', consultas: 'Consultas', otro: 'Otro' },
      message: 'Mensaje *',
      messagePlaceholder: 'Cuéntanos más detalles...',
      sending: 'Enviando...',
      send: 'Enviar mensaje',
      promoSponsorTitle: '¿Quieres ser Sponsor? 🚀',
      promoSponsorDesc: 'Únete a VibeHack y conecta con el talento del futuro.',
      promoMentorTitle: '¿Quieres ser Mentor? 🎓',
      promoMentorDesc: 'Comparte tu experiencia y guía a nuevos innovadores.',
      telegramTitle: 'Telegram oficial 📱',
      telegramDesc: 'Para dudas rápidas y conexión con la comunidad',
      telegramButton: 'Unirse al Telegram'
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
    },
    home: {
      dateLocation: 'October 2025 • Valencia',
      headline1: 'Build, Launch',
      headline2: 'and Validate in 72h',
      tagline: 'Innovation without limits',
      description: 'An intensive weekend to invent the new era of product creation. Join an experimental group of innovative minds and test disruptive production and distribution techniques with the support of new tools.',
      communityTitle: 'Innovative Community',
      communitySubtitle: '+200 creative minds',
      stats: {
        hours: 'Hours'
      },
      timeline: {
        friday: 'Friday: Ideation and Team Building',
        saturday: 'Saturday: Development and Testing',
        sunday: 'Sunday: Demo and Awards'
      },
      newsletter: {
        stayConnectedTitle: 'Stay Connected',
        stayConnectedSubtitle: 'Join our community and receive the latest news',
        formTitle: 'Stay Informed',
        formSubtitle: 'Receive the latest news from the innovative ecosystem of Valencia',
        placeholderEmail: 'your@email.com',
        consentText: 'I agree to receive news and announcements from Terreta Hub, including information about events, resources and opportunities from the innovative community of Valencia. I can cancel my subscription at any time.',
        sending: 'Sending...',
        notifyMe: 'Notify me!',
        privacy: 'We will not share your email with anyone. You will only receive relevant updates.',
        successTitle: 'Thank you for subscribing!',
        successDesc: 'Meanwhile, join our community on Telegram to stay up to date on all the news and connect with other innovators.',
        joinTelegram: 'Join Telegram'
      }
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


