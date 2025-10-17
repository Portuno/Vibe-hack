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
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-left max-w-xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('pages.agenda.scheduleTitle')}</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center justify-between">
                  <span className="font-medium">{t('pages.agenda.day7')}</span>
                  <span>{t('pages.agenda.hours7')}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium">{t('pages.agenda.day8')}</span>
                  <span>{t('pages.agenda.hours8')}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium">{t('pages.agenda.day9')}</span>
                  <span>{t('pages.agenda.hours9')}</span>
                </li>
              </ul>
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
