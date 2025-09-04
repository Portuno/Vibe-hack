"use client"
import IdeaCard from '@/components/IdeaCard'
import useIdeas from '@/hooks/useIdeas'
import { useI18n } from '@/components/i18n/LanguageProvider'

export default function IdeatorioPage() {
  const { ideas, loading, error } = useIdeas()
  const { t } = useI18n()

  return (
    <main className="pt-20 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('pages.ideatorio.title')}</h1>
          <p className="mt-3 text-gray-600">{t('pages.ideatorio.intro')}</p>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}


