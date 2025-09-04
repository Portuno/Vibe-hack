import Header from '@/components/Header'
import NewsletterForm from '@/components/NewsletterForm'
import OnboardingTrigger from '@/components/OnboardingTrigger'
import InscritosCounter from '@/components/InscritosCounter'
import { Calendar, Sparkles, Users, Clock, Target } from 'lucide-react'
import { useI18n } from '@/components/i18n/LanguageProvider'

export default function Home() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Date and Location Tag */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-teal-100 text-primary-700 px-4 py-2 rounded-full border border-primary-200/50">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">{t('pages.home.dateLocation')}</span>
              </div>
              
              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-primary-600">{t('pages.home.headline1')}</span>
                  <br />
                  <span className="text-teal-500">{t('pages.home.headline2')}</span>
                </h1>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
                  <span className="text-lg text-primary-600 font-medium">{t('pages.home.tagline')}</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('pages.home.description')}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <OnboardingTrigger size="lg">
                  {t('cta.registerNow')}
                </OnboardingTrigger>
              </div>
            </div>
            
            {/* Right Content - Visual Elements */}
            <div className="relative">
              {/* Main Feature Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-teal-50/50"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-r from-primary-500 to-teal-500 p-3 rounded-2xl">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{t('pages.home.communityTitle')}</h3>
                      <p className="text-gray-600">{t('pages.home.communitySubtitle')}</p>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-primary-50 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold text-primary-600">72</div>
                      <div className="text-sm text-primary-700">{t('pages.home.stats.hours')}</div>
                    </div>
                    <InscritosCounter />
                  </div>
                  
                  {/* Timeline */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{t('pages.home.timeline.friday')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{t('pages.home.timeline.saturday')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{t('pages.home.timeline.sunday')}</span>
                    </div>
                  </div>

                  {/* CTA Inscripción */}
                  <OnboardingTrigger size="lg" className="w-full">
                    {t('cta.registerNow')}
                  </OnboardingTrigger>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-400 to-orange-500 p-4 rounded-2xl shadow-lg animate-bounce">
                <Clock className="h-6 w-6 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-teal-400 to-teal-500 p-4 rounded-2xl shadow-lg animate-bounce" style={{animationDelay: '1s'}}>
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-50/50 to-teal-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('pages.home.newsletter.stayConnectedTitle')}</h2>
            <p className="text-lg text-gray-600">{t('pages.home.newsletter.stayConnectedSubtitle')}</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </main>
  )
}
