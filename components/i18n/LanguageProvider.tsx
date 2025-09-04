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
  onboarding: {
    header: {
      step1: 'Identidad básica',
      step2: 'Equipo',
      step3: 'Proyecto',
      step4: 'Enfoque',
      step5: 'Habilidades',
      step6: 'Astrología',
      step7: 'IA Tools',
      step8: 'Expectativas',
      step9: 'Confirmar',
      stepOf: 'Paso {current} de {total}'
    },
    success: {
      title: '¡Registro Exitoso! 🎉',
      desc: 'Tu inscripción ha sido enviada correctamente.',
      button: '¡Perfecto!'
    },
    nav: { prev: 'Anterior', next: 'Siguiente', confirm: '¡Confirmar!' },
    step1: {
      fullName: 'Nombre completo *',
      fullNamePh: 'Tu nombre completo',
      email: 'Email de contacto *',
      emailPh: 'tu@email.com',
      phone: 'Número de teléfono (opcional)',
      phonePh: 'Ej: 555-123-4567',
      social: 'Link a red social o portfolio',
      socialPh: 'LinkedIn, GitHub, Instagram...',
      role: 'Rol autopercibido *',
      rolePh: 'Developer, Diseñador/a UX, Creador/a de contenido...'
    },
    step2: {
      solo: { title: 'Quiero trabajar solo/a', sub: 'Proyecto independiente' },
      buscando: { title: 'Estoy buscando equipo', sub: 'Formar equipo' },
      equipo: { title: 'Ya tengo equipo armado', sub: 'Equipo formado' },
      teamName: 'Nombre del equipo',
      teamNamePh: 'Nombre de tu equipo',
      members: 'Nombres de los miembros',
      membersPh: 'Juan Pérez, María García...'
    },
    step3: {
      options: 'Tengo un proyecto iniciado|Tengo problemas concretos que quiero resolver|Tengo ideas que me gustaría empezar|Quiero construir algo pero no tengo ideas todavía',
      more: 'Cuéntanos más (opcional)',
      morePh: 'Describe tu proyecto, idea o problema...'
    },
    step4: {
      b2c: { title: 'B2C', sub: 'Productos para consumidores finales', ex: 'app para estudiantes' },
      b2b: { title: 'B2B', sub: 'Herramientas para negocios', ex: 'bot de WhatsApp' },
      social: { title: 'Causa Social', sub: 'Impacto social o comunitario', ex: 'accesibilidad digital' },
      other: { title: 'Otro', sub: 'Proyectos artísticos, performance', ex: 'arte generativo' }
    },
    step5: {
      creativity: { title: 'Creatividad', q: '¿Se te ocurren conceptos nuevos?' },
      programming: { title: 'Programación', q: '¿Sabes convertir ideas en código?' },
      design: { title: 'Diseño UX/UI', q: '¿Tienes ojo para lo visual?' },
      communication: { title: 'Comunicación', q: '¿Te sientes cómodo explicando?' },
      leadership: { title: 'Liderazgo', q: '¿Sabes coordinar equipos?' },
      ai_tools: { title: 'IA Tools', q: '¿Usas IA para crear?' }
    },
    step6: {
      optional: 'Opcional y divertido ✨',
      solar: 'Signo Solar',
      yourSign: 'Tu signo',
      asc: 'Ascendente',
      ascPh: 'Si lo sabes...',
      lunar: 'Signo Lunar',
      lunarPh: 'Si lo sabes...',
      opinion: '¿Qué piensas sobre la astrología?',
      opinionPh: "'Creo que suma', 'Es solo por diversión', 'No tengo opinión'"
    },
    step7: {
      others: 'Otras herramientas',
      othersPh: '¿Usas alguna otra herramienta de IA?'
    },
    step8: {
      options: 'Conocer gente con intereses similares|Aprender sobre IA y nuevas tecnologías|Lanzar un proyecto real|Validar una idea|Experimentar y jugar|Ganar 😎',
      other: 'Otras expectativas',
      otherPh: '¿Algo más que esperas de la hackathon?'
    },
    step9: {
      summary: 'Resumen de tu registro',
      name: 'Nombre',
      email: 'Email',
      role: 'Rol',
      team: 'Equipo',
      teamValues: { solo: 'Solo', buscando: 'Buscando', equipo: 'Tengo equipo' },
      focus: 'Enfoque',
      accept: 'Al confirmar, acepto que:',
      acceptLines: '• Pueden contactarme por email para temas del evento.|• Habrá fotos y videos durante la hackathon.|• El envío no garantiza una plaza.'
    }
  },
  labels: {
    soon: 'Pronto',
    moreInfoSoon: '¡Más información pronto!',
    loading: 'Cargando...',
    errorLoading: 'Error al cargar'
  },
  cta: {
    registerNow: '¡Inscríbete Ahora!',
    signupHackathon: 'Inscribirse en la Hackathon'
  },
  pages: {
    ideatorio: {
      title: 'Ideatorio',
      intro: 'Un espacio con ideas accionables para construir en 72 horas.',
      emptyTitle: 'Aún no hay ideas publicadas',
      emptyDesc: 'Cuando carguemos ideas, las verás aquí. ¡Vuelve pronto!',
      filters: {
        all: 'Todas',
        categories: 'Categorías'
      },
      add: {
        button: 'Agregar idea',
        passwordTitle: 'Introduce la contraseña para continuar',
        passwordPlaceholder: 'Contraseña',
        confirm: 'Continuar',
        deniedTitle: 'Solo usuarios autorizados pueden subir ideas',
        deniedDesc: 'Pon tu email aquí y serás notificado sobre los avances de Terreta Hub',
        emailPlaceholder: 'tu@email.com',
        notifyMe: 'Notificarme',
        thanks: '¡Gracias! Te avisaremos pronto.',
        formTitle: 'Nueva idea',
        fields: {
          title: 'Título de la Idea',
          categories: 'Categorías (separadas por coma)',
          problem: 'El Problema',
          solution: 'Solución Propuesta',
          mvp: 'Funcionalidades del MVP (coma separadas)',
          technologies: 'Tecnologías / Herramientas (coma separadas)',
          audience: 'Público Objetivo',
          business: 'Modelo de Negocio (Hipótesis)',
          image: 'Imagen Representativa (URL)'
        },
        submit: 'Publicar idea',
        success: 'Idea publicada correctamente'
      }
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
    },
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
    ,
    community: {
      title1: 'Únete a nuestra',
      title2: 'Comunidad',
      heroDesc: 'VibeHack es más que un evento; es un movimiento. Conecta, colabora y crece con innovadores de toda la región.',
      telegramTitle: 'Telegram Oficial',
      telegramDesc: 'El punto de encuentro para todos los participantes. Resuelve dudas, encuentra equipo y comparte tu progreso.',
      joinGroup: 'Unirme al grupo',
      upcomingTitle: 'Futuros eventos',
      upcomingDesc: 'Únete para saber más sobre la Hackathon y futuros eventos.',
      followTitle: 'Síguenos en redes',
      followDesc: 'para no perderte ninguna novedad',
      contactTitle: 'Contacto',
      contactDesc: '¿Tienes dudas o quieres ser sponsor?',
      contactButton: 'Contactar'
    }
  },
  a11y: {
    toggleMenu: 'Alternar menú'
  }
})

// English onboarding object (placed before EN dictionary to avoid TDZ)
const EN_ONBOARDING = {
  header: {
    step1: 'Basic identity',
    step2: 'Team',
    step3: 'Project',
    step4: 'Focus',
    step5: 'Skills',
    step6: 'Astrology',
    step7: 'AI Tools',
    step8: 'Expectations',
    step9: 'Confirm',
    stepOf: 'Step {current} of {total}'
  },
  success: {
    title: 'Registration Successful! 🎉',
    desc: 'Your application has been submitted correctly.',
    button: 'Great!'
  },
  nav: { prev: 'Previous', next: 'Next', confirm: 'Confirm!' },
  step1: {
    fullName: 'Full name *',
    fullNamePh: 'Your full name',
    email: 'Contact email *',
    emailPh: 'your@email.com',
    phone: 'Phone number (optional)',
    phonePh: 'e.g., 555-123-4567',
    social: 'Social link or portfolio',
    socialPh: 'LinkedIn, GitHub, Instagram...',
    role: 'Self-perceived role *',
    rolePh: 'Developer, UX Designer, Content Creator...'
  },
  step2: {
    solo: { title: 'I want to work solo', sub: 'Independent project' },
    buscando: { title: 'I am looking for a team', sub: 'Form a team' },
    equipo: { title: 'I already have a team', sub: 'Team formed' },
    teamName: 'Team name',
    teamNamePh: 'Your team name',
    members: 'Team members',
    membersPh: 'John Smith, Jane Doe...'
  },
  step3: {
    options: 'I have a project started|I have concrete problems I want to solve|I have ideas I would like to start|I want to build something but I\'t have ideas yet',
    more: 'Tell us more (optional)',
    morePh: 'Describe your project, idea or problem...'
  },
  step4: {
    b2c: { title: 'B2C', sub: 'Products for consumers', ex: 'app for students' },
    b2b: { title: 'B2B', sub: 'Tools for businesses', ex: 'WhatsApp bot' },
    social: { title: 'Social Cause', sub: 'Social or community impact', ex: 'digital accessibility' },
    other: { title: 'Other', sub: 'Art, performance projects', ex: 'generative art' }
  },
  step5: {
    creativity: { title: 'Creativity', q: 'Do new concepts come to you?' },
    programming: { title: 'Programming', q: 'Can you turn ideas into code?' },
    design: { title: 'UX/UI Design', q: 'Do you have an eye for visuals?' },
    communication: { title: 'Communication', q: 'Are you comfortable explaining?' },
    leadership: { title: 'Leadership', q: 'Can you coordinate teams?' },
    ai_tools: { title: 'AI Tools', q: 'Do you use AI to create?' }
  },
  step6: {
    optional: 'Optional and fun ✨',
    solar: 'Sun Sign',
    yourSign: 'Your sign',
    asc: 'Ascendant',
    ascPh: 'If you know it...',
    lunar: 'Moon Sign',
    lunarPh: 'If you know it...',
    opinion: 'What do you think about astrology?',
    opinionPh: "'I think it helps', 'Just for fun', 'No opinion'"
  },
  step7: {
    others: 'Other tools',
    othersPh: 'Do you use any other AI tool?'
  },
  step8: {
    options: 'Meet people with similar interests|Learn about AI and new technologies|Launch a real project|Validate an idea|Experiment and play|Win 😎',
    other: 'Other expectations',
    otherPh: 'Anything else you expect from the hackathon?'
  },
  step9: {
    summary: 'Your registration summary',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    team: 'Team',
    teamValues: { solo: 'Solo', buscando: 'Looking', equipo: 'Have team' },
    focus: 'Focus',
    accept: 'By confirming, I accept that:',
    acceptLines: '• You can contact me by email about the event.|• There will be photos and videos during the hackathon.|• Submission does not guarantee a spot.'
  }
}

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
    moreInfoSoon: 'More information soon!',
    loading: 'Loading...',
    errorLoading: 'Error loading'
  },
  cta: {
    registerNow: 'Register Now!',
    signupHackathon: 'Sign up for the Hackathon'
  },
  pages: {
    ideatorio: {
      title: 'Idea Lab',
      intro: 'A space with actionable ideas to build in 72 hours.',
      emptyTitle: 'No ideas published yet',
      emptyDesc: 'Once we add ideas, you will see them here. Check back soon!',
      filters: {
        all: 'All',
        categories: 'Categories'
      },
      add: {
        button: 'Add idea',
        passwordTitle: 'Enter the password to continue',
        passwordPlaceholder: 'Password',
        confirm: 'Continue',
        deniedTitle: 'Only authorized users can submit ideas',
        deniedDesc: 'Leave your email and you will be notified about Terreta Hub updates',
        emailPlaceholder: 'your@email.com',
        notifyMe: 'Notify me',
        thanks: 'Thanks! We will keep you posted.',
        formTitle: 'New idea',
        fields: {
          title: 'Idea Title',
          categories: 'Categories (comma separated)',
          problem: 'The Problem',
          solution: 'Proposed Solution',
          mvp: 'MVP Features (comma separated)',
          technologies: 'Technologies / Tools (comma separated)',
          audience: 'Target Audience',
          business: 'Business Model (Hypothesis)',
          image: 'Representative Image (URL)'
        },
        submit: 'Publish idea',
        success: 'Idea published successfully'
      }
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
    },
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
  },
  community: {
    title1: 'Join our',
    title2: 'Community',
    heroDesc: 'VibeHack is more than an event; it is a movement. Connect, collaborate, and grow with innovators across the region.',
    telegramTitle: 'Official Telegram',
    telegramDesc: 'The meeting point for all participants. Get help, find a team, and share your progress.',
    joinGroup: 'Join the group',
    upcomingTitle: 'Upcoming events',
    upcomingDesc: 'Join to learn more about the Hackathon and future events.',
    followTitle: 'Follow us on social media',
    followDesc: "so you don't miss any updates",
    contactTitle: 'Contact',
    contactDesc: 'Do you have questions or want to sponsor?',
    contactButton: 'Contact'
  },
  onboarding: EN_ONBOARDING,
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


