'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Zap, Rocket, Users, Calendar, Heart, Book, Menu, X } from 'lucide-react'
import OnboardingTrigger from './OnboardingTrigger'
import { LanguageSelector } from './i18n/LanguageSelector'
import { useI18n } from './i18n/LanguageProvider'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { t } = useI18n()

  const navigationItems = [
    { name: t('nav.sponsors'), href: '/sponsors', icon: Users },
    { name: t('nav.agenda'), href: '/agenda', icon: Calendar },
    { name: t('nav.ideatorio'), href: '/ideatorio', icon: Rocket },
    { name: t('nav.community'), href: '/comunidad', icon: Heart },
    { name: t('nav.resources'), href: '/recursos', icon: Book },
  ]

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">VibeHack</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              // Validar que el icono existe antes de renderizarlo
              if (!item.icon) {
                console.warn(`Icon not found for navigation item: ${item.name}`)
                return null
              }
              
              const Icon = item.icon
              
              // Agenda ya disponible: render estándar
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Desktop Right Section: Language + CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector dropdown />
            <OnboardingTrigger size="lg" className="shadow-primary-500/30 hover:shadow-primary-500/40 shadow-xl rounded-full">
              {t('cta.registerNow')}
            </OnboardingTrigger>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleToggleMenu}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            aria-label={t('a11y.toggleMenu')}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */
        }
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => {
                if (!item.icon) {
                  console.warn(`Icon not found for navigation item: ${item.name}`)
                  return null
                }
                
                const Icon = item.icon
                
                // Agenda disponible: render estándar en mobile
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Mobile CTA Button */}
              <div className="px-4 pt-4">
                <OnboardingTrigger size="lg" className="w-full">
                  {t('cta.registerNow')}
                </OnboardingTrigger>
              </div>
              {/* Mobile Language Selector */}
              <div className="px-4 pt-2 pb-4 flex justify-end">
                <LanguageSelector dropdown compact />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
