"use client"

import Header from '@/components/Header'
import { Calendar } from 'lucide-react'
import { useI18n } from '@/components/i18n/LanguageProvider'

export default function AgendaPage() {
  const { t } = useI18n()
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Header />
      
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero */}
          <div className="mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-8">
              <Calendar className="h-10 w-10 text-primary-600" />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="gradient-text">{t('pages.agenda.title')}</span>
            </h1>
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 max-w-3xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-left">{t('pages.agenda.scheduleTitle')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-primary-100 bg-primary-50/40 p-4 text-left">
                  <div className="text-xs uppercase tracking-wide text-primary-600 mb-2">{t('pages.agenda.day7')}</div>
                  <div className="text-2xl font-extrabold text-primary-700">{t('pages.agenda.hours7')}</div>
                </div>
                <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-4 text-left">
                  <div className="text-xs uppercase tracking-wide text-teal-600 mb-2">{t('pages.agenda.day8')}</div>
                  <div className="text-2xl font-extrabold text-teal-700">{t('pages.agenda.hours8')}</div>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 text-left">
                  <div className="text-xs uppercase tracking-wide text-orange-600 mb-2">{t('pages.agenda.day9')}</div>
                  <div className="text-2xl font-extrabold text-orange-700">{t('pages.agenda.hours9')}</div>
                </div>
              </div>

              <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary-500 via-teal-500 to-orange-500 w-full" />
              </div>
            </div>
          </div>
          
          {/* CTA de regreso */}
          <div className="mt-12">
            <a
              href="/"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              <span>{t('pages.agenda.backHome')}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
