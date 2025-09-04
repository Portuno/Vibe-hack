"use client"
import IdeaCard from '@/components/IdeaCard'
import useIdeas from '@/hooks/useIdeas'
import { useI18n } from '@/components/i18n/LanguageProvider'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function IdeatorioPage() {
  const { ideas, loading, error } = useIdeas()
  const { t } = useI18n()
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [authOk, setAuthOk] = useState(false)
  const [email, setEmail] = useState('')
  const [notifySent, setNotifySent] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  const handleOpenAdd = () => setShowPassword(true)

  const handleCheckPassword = () => {
    if (password.trim() === 'Robable') {
      setAuthOk(true)
    } else {
      setAuthOk(false)
    }
  }

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    const normalized = email.trim().toLowerCase()
    if (!normalized) return
    await supabase.from('newsletter_subscribers').insert({ email: normalized, is_active: true, source: 'ideatorio' })
    setNotifySent(true)
  }

  const handleSubmitIdea = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!supabase) return
      setSubmitLoading(true)
      setSubmitMsg('')
      const formData = new FormData(e.currentTarget)
      const title = String(formData.get('title') || '')
      const categories = String(formData.get('categories') || '')
      const problem = String(formData.get('problem') || '')
      const solution = String(formData.get('solution') || '')
      const mvp = String(formData.get('mvp') || '')
      const technologies = String(formData.get('technologies') || '')
      const audience = String(formData.get('audience') || '')
      const business = String(formData.get('business') || '')
      const image_url = String(formData.get('image_url') || '')

      const { data, error: rpcError } = await supabase.rpc('create_idea_with_password', {
        p_password: 'Robable',
        p_title: title,
        p_categories: categories ? categories.split(',').map(s => s.trim()).filter(Boolean) : [],
        p_problem: problem,
        p_solution: solution,
        p_mvp_features: mvp ? mvp.split(',').map(s => s.trim()).filter(Boolean) : [],
        p_technologies: technologies ? technologies.split(',').map(s => s.trim()).filter(Boolean) : [],
        p_audience: audience || null,
        p_business_model: business || null,
        p_image_url: image_url || null
      })

      if (rpcError) throw rpcError
      setSubmitMsg(t('pages.ideatorio.add.success'))
      ;(e.currentTarget as HTMLFormElement).reset()
    } catch (err) {
      setSubmitMsg('Error')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <main className="pt-24 pb-16 bg-white min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('pages.ideatorio.title')}</h1>
          <p className="mt-3 text-gray-600">{t('pages.ideatorio.intro')}</p>
        </header>

        {/* Add idea trigger */}
        <div className="mb-6">
          <button onClick={handleOpenAdd} className="px-4 py-2 rounded-full gradient-bg text-white font-semibold">
            {t('pages.ideatorio.add.button')}
          </button>
        </div>

        {showPassword && (
          <div className="mb-8 p-4 border border-gray-200 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-3">{t('pages.ideatorio.add.passwordTitle')}</h3>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('pages.ideatorio.add.passwordPlaceholder')}
                className="px-3 py-2 border rounded-lg w-full sm:w-60"
                onKeyDown={(e)=>{ if(e.key==='Enter'){ handleCheckPassword() } }}
              />
              <button onClick={handleCheckPassword} className="px-4 py-2 rounded-lg border font-medium">
                {t('pages.ideatorio.add.confirm')}
              </button>
            </div>

            {!authOk && password && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800">{t('pages.ideatorio.add.deniedTitle')}</h4>
                <p className="text-gray-600 text-sm mb-3">{t('pages.ideatorio.add.deniedDesc')}</p>
                {notifySent ? (
                  <div className="text-green-700 text-sm">{t('pages.ideatorio.add.thanks')}</div>
                ) : (
                  <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2">
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder={t('pages.ideatorio.add.emailPlaceholder')} required className="px-3 py-2 border rounded-lg w-full sm:w-72" />
                    <button type="submit" className="px-4 py-2 rounded-lg gradient-bg text-white font-medium">{t('pages.ideatorio.add.notifyMe')}</button>
                  </form>
                )}
              </div>
            )}

            {authOk && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">{t('pages.ideatorio.add.formTitle')}</h4>
                <form onSubmit={handleSubmitIdea} className="space-y-3">
                  <input name="title" placeholder={t('pages.ideatorio.add.fields.title')} required className="w-full px-3 py-2 border rounded-lg" />
                  <input name="categories" placeholder={t('pages.ideatorio.add.fields.categories')} className="w-full px-3 py-2 border rounded-lg" />
                  <textarea name="problem" placeholder={t('pages.ideatorio.add.fields.problem')} required className="w-full px-3 py-2 border rounded-lg" rows={2} />
                  <textarea name="solution" placeholder={t('pages.ideatorio.add.fields.solution')} required className="w-full px-3 py-2 border rounded-lg" rows={2} />
                  <input name="mvp" placeholder={t('pages.ideatorio.add.fields.mvp')} className="w-full px-3 py-2 border rounded-lg" />
                  <input name="technologies" placeholder={t('pages.ideatorio.add.fields.technologies')} className="w-full px-3 py-2 border rounded-lg" />
                  <input name="audience" placeholder={t('pages.ideatorio.add.fields.audience')} className="w-full px-3 py-2 border rounded-lg" />
                  <input name="business" placeholder={t('pages.ideatorio.add.fields.business')} className="w-full px-3 py-2 border rounded-lg" />
                  <input name="image_url" placeholder={t('pages.ideatorio.add.fields.image')} className="w-full px-3 py-2 border rounded-lg" />
                  <button type="submit" disabled={submitLoading} className="px-4 py-2 rounded-lg gradient-bg text-white font-semibold">
                    {submitLoading ? '...' : t('pages.ideatorio.add.submit')}
                  </button>
                  {submitMsg && <div className="text-sm text-green-700">{submitMsg}</div>}
                </form>
              </div>
            )}
          </div>
        )}

        {/* Filters (placeholder minimal) */}
        <div className="mb-6 flex items-center gap-3">
          <button className="px-4 py-2 rounded-full border border-gray-200 text-sm bg-gray-50">
            {t('pages.ideatorio.filters.all')}
          </button>
          <span className="text-sm text-gray-500">{t('pages.ideatorio.filters.categories')}</span>
        </div>

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
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('pages.ideatorio.emptyTitle')}</h3>
            <p className="text-gray-500">{t('pages.ideatorio.emptyDesc')}</p>
          </div>
        )}
      </section>
    </main>
  )
}


