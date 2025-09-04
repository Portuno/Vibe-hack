'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowLeft, ArrowRight, Check, User, Users, Lightbulb, Target, Brain, Star, Zap, Heart } from 'lucide-react'
import { useOnboarding, OnboardingData } from '@/hooks/useOnboarding'
import { useI18n } from './i18n/LanguageProvider'

const OnboardingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const { submitOnboarding, isLoading, error, success, resetOnboarding } = useOnboarding()
  const { t } = useI18n()
  
  const [data, setData] = useState<OnboardingData>({
    full_name: '',
    email: '',
    phone: '',
    social_link: '',
    role: '',
    team_preference: 'solo',
    team_name: '',
    team_members: '',
    project_status: [],
    project_focus: '',
    skills: {
      creativity: 5,
      programming: 5,
      design: 5,
      communication: 5,
      leadership: 5,
      ai_tools: 5
    },
    astrology: {
      solar_sign: '',
      ascendant: '',
      lunar_sign: '',
      opinion: ''
    },
    ai_tools_used: [],
    expectations: [],
    consent_newsletter: false
  })

  const totalSteps = 9

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const result = await submitOnboarding(data)
      if (result.success) {
        setTimeout(() => {
          onClose()
          resetOnboarding()
          setData({
            full_name: '',
            email: '',
            phone: '',
            social_link: '',
            role: '',
            team_preference: 'solo',
            team_name: '',
            team_members: '',
            project_status: [],
            project_focus: '',
            skills: {
              creativity: 5,
              programming: 5,
              design: 5,
              communication: 5,
              leadership: 5,
              ai_tools: 5
            },
            astrology: {
              solar_sign: '',
              ascendant: '',
              lunar_sign: '',
              opinion: ''
            },
            ai_tools_used: [],
            expectations: [],
            consent_newsletter: false
          })
          setCurrentStep(1)
        }, 2000)
      }
    } catch (error) {
      console.error('Error al enviar datos:', error)
    }
  }

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const updateSkills = (skill: keyof OnboardingData['skills'], value: number) => {
    setData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: value }
    }))
  }

  const updateAstrology = (field: keyof OnboardingData['astrology'], value: string) => {
    setData(prev => ({
      ...prev,
      astrology: { ...prev.astrology, [field]: value }
    }))
  }

  if (!isOpen) return null

  // Mostrar mensaje de éxito
  if (success) {
    return createPortal(
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t('onboarding.success.title')}
          </h2>
          
          <p className="text-gray-600 mb-6 text-base">
            {t('onboarding.success.desc')}
          </p>
          
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold w-full"
          >
            {t('onboarding.success.button')}
          </button>
        </div>
      </div>,
      document.body
    )
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center p-2 sm:p-4 pt-16 sm:pt-4">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-2xl h-[90vh] sm:h-[80vh] flex flex-col shadow-2xl border border-gray-100">
        {/* Header compacto - Tamaño fijo */}
        <div className="bg-gradient-to-r from-primary-50 to-teal-50 p-3 sm:p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                {currentStep === 1 && <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                {currentStep === 2 && <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                {currentStep === 3 && <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                {currentStep === 4 && <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                {currentStep === 5 && <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                {currentStep === 6 && <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                {currentStep === 7 && <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                {currentStep === 8 && <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                {currentStep === 9 && <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                  {currentStep === 1 && t('onboarding.header.step1')}
                  {currentStep === 2 && t('onboarding.header.step2')}
                  {currentStep === 3 && t('onboarding.header.step3')}
                  {currentStep === 4 && t('onboarding.header.step4')}
                  {currentStep === 5 && t('onboarding.header.step5')}
                  {currentStep === 6 && t('onboarding.header.step6')}
                  {currentStep === 7 && t('onboarding.header.step7')}
                  {currentStep === 8 && t('onboarding.header.step8')}
                  {currentStep === 9 && t('onboarding.header.step9')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {t('onboarding.header.stepOf')
                    .replace('{current}', String(currentStep))
                    .replace('{total}', String(totalSteps))}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            </button>
          </div>
          
          {/* Progress bar compacto */}
          <div className="mt-3">
            <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-500 to-teal-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Error Message - Tamaño fijo */}
        {error && (
          <div className="mx-3 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex-shrink-0">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Content - Scrollable con tamaño fijo */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0">
          {currentStep === 1 && (
            <Step1BasicInfo data={data} updateData={updateData} />
          )}
          
          {currentStep === 2 && (
            <Step2TeamPreference data={data} updateData={updateData} />
          )}
          
          {currentStep === 3 && (
            <Step3ProjectStatus data={data} updateData={updateData} />
          )}
          
          {currentStep === 4 && (
            <Step4ProjectFocus data={data} updateData={updateData} />
          )}
          
          {currentStep === 5 && (
            <Step5Skills data={data} updateSkills={updateSkills} />
          )}
          
          {currentStep === 6 && (
            <Step6Astrology data={data} updateAstrology={updateAstrology} />
          )}
          
          {currentStep === 7 && (
            <Step7AITools data={data} updateData={updateData} />
          )}
          
          {currentStep === 8 && (
            <Step8Expectations data={data} updateData={updateData} />
          )}
          
          {currentStep === 9 && (
            <Step9Confirmation data={data} />
          )}
        </div>

        {/* Footer Navigation - Siempre visible, tamaño fijo */}
        <div className="p-3 sm:p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <div className="flex justify-between items-center space-x-3">
            {/* Botón Anterior */}
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t('onboarding.nav.prev')}</span>
            </button>

            {/* Progress Dots */}
            <div className="flex space-x-1.5">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i + 1 === currentStep 
                      ? 'bg-primary-500 scale-125' 
                      : i + 1 < currentStep 
                        ? 'bg-teal-400' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Botón Siguiente/Enviar */}
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-primary-500 to-teal-500 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
              >
                <span className="hidden sm:inline">{t('onboarding.nav.next')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl font-semibold disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  t('onboarding.nav.confirm')
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Step Components optimizados para mobile
const Step1BasicInfo = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => {
  const { useI18n } = require('./i18n/LanguageProvider') as typeof import('./i18n/LanguageProvider')
  const { t: translate } = useI18n ? useI18n() : { t: (k: string) => k }
  return (
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {translate('onboarding.step1.fullName')}
      </label>
      <input
        type="text"
        value={data.full_name}
        onChange={(e) => updateData('full_name', e.target.value)}
        placeholder={translate('onboarding.step1.fullNamePh')}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {translate('onboarding.step1.email')}
      </label>
      <input
        type="email"
        value={data.email}
        onChange={(e) => updateData('email', e.target.value)}
        placeholder={translate('onboarding.step1.emailPh')}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {translate('onboarding.step1.phone')}
      </label>
      <input
        type="tel"
        value={data.phone}
        onChange={(e) => updateData('phone', e.target.value)}
        placeholder={translate('onboarding.step1.phonePh')}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {translate('onboarding.step1.social')}
      </label>
      <input
        type="url"
        value={data.social_link}
        onChange={(e) => updateData('social_link', e.target.value)}
        placeholder={translate('onboarding.step1.socialPh')}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {translate('onboarding.step1.role')}
      </label>
      <input
        type="text"
        value={data.role}
        onChange={(e) => updateData('role', e.target.value)}
        placeholder={translate('onboarding.step1.rolePh')}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
        required
      />
    </div>
  </div>
)}

const Step2TeamPreference = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => {
  const { useI18n } = require('./i18n/LanguageProvider') as typeof import('./i18n/LanguageProvider')
  const { t: translate } = useI18n ? useI18n() : { t: (k: string) => k }
  return (
  <div className="space-y-3">
    {[
      { value: 'solo', title: translate('onboarding.step2.solo.title'), subtitle: translate('onboarding.step2.solo.sub') },
      { value: 'buscando', title: translate('onboarding.step2.buscando.title'), subtitle: translate('onboarding.step2.buscando.sub') },
      { value: 'equipo', title: translate('onboarding.step2.equipo.title'), subtitle: translate('onboarding.step2.equipo.sub') }
    ].map((option) => (
      <label
        key={option.value}
        className={`block p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
          data.team_preference === option.value
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <input
          type="radio"
          name="team_preference"
          value={option.value}
          checked={data.team_preference === option.value}
          onChange={(e) => updateData('team_preference', e.target.value)}
          className="sr-only"
        />
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full border-2 ${
            data.team_preference === option.value
              ? 'border-primary-500 bg-primary-500'
              : 'border-gray-400'
          }`}>
            {data.team_preference === option.value && (
              <div className="w-2 h-2 bg-white rounded-full m-0.5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 text-sm">{option.title}</div>
            <div className="text-xs text-gray-600">{option.subtitle}</div>
          </div>
        </div>
      </label>
    ))}

    {data.team_preference === 'equipo' && (
      <div className="space-y-3 mt-3 p-3 bg-gray-50 rounded-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('onboarding.step2.teamName')}
          </label>
          <input
            type="text"
            value={data.team_name}
            onChange={(e) => updateData('team_name', e.target.value)}
            placeholder={translate('onboarding.step2.teamNamePh')}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('onboarding.step2.members')}
          </label>
          <input
            type="text"
            value={data.team_members}
            onChange={(e) => updateData('team_members', e.target.value)}
            placeholder={translate('onboarding.step2.membersPh')}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
          />
        </div>
      </div>
    )}
  </div>
)}

const Step3ProjectStatus = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => {
  const { useI18n } = require('./i18n/LanguageProvider') as typeof import('./i18n/LanguageProvider')
  const { t: translate } = useI18n ? useI18n() : { t: (k: string) => k }
  const raw = translate('onboarding.step3.options') as unknown as string
  const options: string[] = raw && typeof raw === 'string' ? raw.split('|').filter(Boolean) : []
  const list = options.length ? options : [
    'Tengo un proyecto iniciado',
    'Tengo problemas concretos que quiero resolver',
    'Tengo ideas que me gustaría empezar',
    'Quiero construir algo pero no tengo ideas todavía'
  ]
  return (
    <div className="space-y-6 sm:space-y-4">
      <div className="space-y-4 sm:space-y-2">
        {list.map((option) => (
          <label key={option} className="flex items-start space-x-4 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={data.project_status.includes(option)}
              onChange={(e) => {
                if (e.target.checked) {
                  updateData('project_status', [...data.project_status, option])
                } else {
                  updateData('project_status', data.project_status.filter(item => item !== option))
                }
              }}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
            />
            <span className="text-base sm:text-sm text-gray-700 leading-relaxed">{option}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="block text-base sm:text-sm font-medium text-gray-700 mb-3 sm:mb-1">
          {translate('onboarding.step3.more')}
        </label>
        <textarea
          value={data.project_status.join(', ')}
          onChange={(e) => updateData('project_status', e.target.value.split(', ').filter(Boolean))}
          placeholder={translate('onboarding.step3.morePh')}
          rows={4}
          className="w-full px-4 py-3 sm:px-3 sm:py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-base"
        />
      </div>
    </div>
  )
}

const Step4ProjectFocus = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => {
  const { useI18n } = require('./i18n/LanguageProvider') as typeof import('./i18n/LanguageProvider')
  const { t: translate } = useI18n ? useI18n() : { t: (k: string) => k }
  const opts = [
    { value: 'b2c', title: translate('onboarding.step4.b2c.title'), subtitle: translate('onboarding.step4.b2c.sub'), example: translate('onboarding.step4.b2c.ex'), color: 'bg-purple-500' },
    { value: 'b2b', title: translate('onboarding.step4.b2b.title'), subtitle: translate('onboarding.step4.b2b.sub'), example: translate('onboarding.step4.b2b.ex'), color: 'bg-orange-500' },
    { value: 'social', title: translate('onboarding.step4.social.title'), subtitle: translate('onboarding.step4.social.sub'), example: translate('onboarding.step4.social.ex'), color: 'bg-red-500' },
    { value: 'other', title: translate('onboarding.step4.other.title'), subtitle: translate('onboarding.step4.other.sub'), example: translate('onboarding.step4.other.ex'), color: 'bg-green-500' }
  ]
  return (
  <div className="space-y-5 sm:space-y-3">
      {opts.map((option) => (
      <label
        key={option.value}
        className={`block p-5 sm:p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
          data.project_focus === option.value
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <input
          type="radio"
          name="project_focus"
          value={option.value}
          checked={data.project_focus === option.value}
          onChange={(e) => updateData('project_focus', e.target.value)}
          className="sr-only"
        />
        <div className="flex items-center space-x-4 sm:space-x-3">
          <div className={`w-14 h-14 sm:w-10 sm:h-10 ${option.color} rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-sm`}>
            {option.title}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 text-base sm:text-sm mb-2 sm:mb-1">{option.subtitle}</div>
            <div className="text-sm sm:text-xs text-gray-600">Ej: {option.example}</div>
          </div>
        </div>
      </label>
    ))}
  </div>
)
}

const Step5Skills = ({ data, updateSkills }: { data: OnboardingData; updateSkills: (skill: keyof OnboardingData['skills'], value: number) => void }) => {
  const { useI18n } = require('./i18n/LanguageProvider') as typeof import('./i18n/LanguageProvider')
  const { t: translate } = useI18n ? useI18n() : { t: (k: string) => k }
  const skills = [
    { key: 'creativity', title: translate('onboarding.step5.creativity.title'), question: translate('onboarding.step5.creativity.q') },
    { key: 'programming', title: translate('onboarding.step5.programming.title'), question: translate('onboarding.step5.programming.q') },
    { key: 'design', title: translate('onboarding.step5.design.title'), question: translate('onboarding.step5.design.q') },
    { key: 'communication', title: translate('onboarding.step5.communication.title'), question: translate('onboarding.step5.communication.q') },
    { key: 'leadership', title: translate('onboarding.step5.leadership.title'), question: translate('onboarding.step5.leadership.q') },
    { key: 'ai_tools', title: translate('onboarding.step5.ai_tools.title'), question: translate('onboarding.step5.ai_tools.q') }
  ] as const
  return (
  <div className="space-y-4">
      {skills.map((skill) => (
      <div key={skill.key} className="space-y-2">
        <div>
          <div className="font-medium text-gray-800 text-sm mb-1">{skill.title}</div>
          <div className="text-xs text-gray-600">{skill.question}</div>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="1"
            max="10"
            value={data.skills[skill.key as keyof OnboardingData['skills']]}
            onChange={(e) => updateSkills(skill.key as keyof OnboardingData['skills'], parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-primary-600 font-bold w-6 text-center text-sm">
            {data.skills[skill.key as keyof OnboardingData['skills']]}
          </div>
        </div>
      </div>
    ))}
  </div>
)
}

const Step6Astrology = ({ data, updateAstrology }: { data: OnboardingData; updateAstrology: (field: keyof OnboardingData['astrology'], value: string) => void }) => {
  const { useI18n } = require('./i18n/LanguageProvider') as typeof import('./i18n/LanguageProvider')
  const { t: translate } = useI18n ? useI18n() : { t: (k: string) => k }
  return (
  <div className="space-y-4">
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
      <div className="flex items-center space-x-2 text-purple-700">
        <Star className="h-4 w-4" />
          <span className="text-xs font-medium">{translate('onboarding.step6.optional')}</span>
        </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {translate('onboarding.step6.solar')}
      </label>
      <select
        value={data.astrology.solar_sign}
        onChange={(e) => updateAstrology('solar_sign', e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      >
          <option value="">{translate('onboarding.step6.yourSign')}</option>
        <option value="aries">Aries</option>
        <option value="tauro">Tauro</option>
        <option value="geminis">Géminis</option>
        <option value="cancer">Cáncer</option>
        <option value="leo">Leo</option>
        <option value="virgo">Virgo</option>
        <option value="libra">Libra</option>
        <option value="escorpio">Escorpio</option>
        <option value="sagitario">Sagitario</option>
        <option value="capricornio">Capricornio</option>
        <option value="acuario">Acuario</option>
        <option value="piscis">Piscis</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {translate('onboarding.step6.asc')}
      </label>
      <input
        type="text"
        value={data.astrology.ascendant}
        onChange={(e) => updateAstrology('ascendant', e.target.value)}
          placeholder={translate('onboarding.step6.ascPh')}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {translate('onboarding.step6.lunar')}
      </label>
      <input
        type="text"
        value={data.astrology.lunar_sign}
        onChange={(e) => updateAstrology('lunar_sign', e.target.value)}
          placeholder={translate('onboarding.step6.lunarPh')}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {translate('onboarding.step6.opinion')}
      </label>
      <textarea
        value={data.astrology.opinion}
        onChange={(e) => updateAstrology('opinion', e.target.value)}
          placeholder={translate('onboarding.step6.opinionPh')}
        rows={2}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-base"
      />
    </div>
  </div>
)
}

const Step7AITools = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => {
  const { useI18n } = require('./i18n/LanguageProvider') as typeof import('./i18n/LanguageProvider')
  const { t: translate } = useI18n ? useI18n() : { t: (k: string) => k }
  const tools: string[] = [
        'Base44 / Lovable / Bolt / v0',
        'ChatGPT / Claude / Perplexity',
        'Figma AI / Diagram',
        'Replit Ghostwriter / Codeium / GitHub Copilot',
        'Midjourney / DALL-E / Runway',
    translate('onboarding.step7.othersPh')
  ]
  return (
    <div className="space-y-6 sm:space-y-4">
      <div className="space-y-4 sm:space-y-2">
        {tools.map((tool) => (
        <label key={tool} className="flex items-start space-x-4 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            checked={data.ai_tools_used.includes(tool)}
            onChange={(e) => {
              if (e.target.checked) {
                updateData('ai_tools_used', [...data.ai_tools_used, tool])
              } else {
                updateData('ai_tools_used', data.ai_tools_used.filter(item => item !== tool))
              }
            }}
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
          />
          <span className="text-base sm:text-sm text-gray-700 leading-relaxed">{tool}</span>
        </label>
      ))}
    </div>

    <div>
      <label className="block text-base sm:text-sm font-medium text-gray-700 mb-3 sm:mb-1">
          {translate('onboarding.step7.others')}
      </label>
      <input
        type="text"
          placeholder={translate('onboarding.step7.othersPh')}
        className="w-full px-4 py-3 sm:px-3 sm:py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      />
    </div>
  </div>
)
}

const Step8Expectations = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => {
  const { useI18n } = require('./i18n/LanguageProvider') as typeof import('./i18n/LanguageProvider')
  const { t: translate } = useI18n ? useI18n() : { t: (k: string) => k }
  const raw = translate('onboarding.step8.options') as unknown as string
  const options: string[] = raw && typeof raw === 'string' ? raw.split('|').filter(Boolean) : []
  const list = options.length ? options : [
    'Conocer gente con intereses similares',
    'Aprender sobre IA y nuevas tecnologías',
    'Lanzar un proyecto real',
    'Validar una idea',
    'Experimentar y jugar',
    'Ganar 😎'
  ]
  return (
    <div className="space-y-6 sm:space-y-4">
      <div className="space-y-4 sm:space-y-2">
        {list.map((expectation) => (
          <label key={expectation} className="flex items-start space-x-4 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={data.expectations.includes(expectation)}
              onChange={(e) => {
                if (e.target.checked) {
                  updateData('expectations', [...data.expectations, expectation])
                } else {
                  updateData('expectations', data.expectations.filter(item => item !== expectation))
                }
              }}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
            />
            <span className="text-base sm:text-sm text-gray-700 leading-relaxed">{expectation}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="block text-base sm:text-sm font-medium text-gray-700 mb-3 sm:mb-1">
          {translate('onboarding.step8.other')}
        </label>
        <textarea
          placeholder={translate('onboarding.step8.otherPh')}
          rows={3}
          className="w-full px-4 py-3 sm:px-3 sm:py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-base"
        />
      </div>
    </div>
  )
}

const Step9Confirmation = ({ data }: { data: OnboardingData }) => {
  const { useI18n } = require('./i18n/LanguageProvider') as typeof import('./i18n/LanguageProvider')
  const { t: translate } = useI18n ? useI18n() : { t: (k: string) => k }
  const raw = translate('onboarding.step9.acceptLines') as unknown as string
  const lines: string[] = raw && typeof raw === 'string' ? raw.split('|').filter(Boolean) : []
  return (
  <div className="space-y-4">
    <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">{translate('onboarding.step9.summary')}</h3>
      <div className="space-y-1 text-xs">
          <div><span className="font-medium">{translate('onboarding.step9.name')}:</span> {data.full_name}</div>
          <div><span className="font-medium">{translate('onboarding.step9.email')}:</span> {data.email}</div>
          <div><span className="font-medium">{translate('onboarding.step9.role')}:</span> {data.role}</div>
          <div><span className="font-medium">{translate('onboarding.step9.team')}:</span> {
            data.team_preference === 'solo' ? translate('onboarding.step9.teamValues.solo') :
            data.team_preference === 'buscando' ? translate('onboarding.step9.teamValues.buscando') :
            translate('onboarding.step9.teamValues.equipo')
        }</div>
          <div><span className="font-medium">{translate('onboarding.step9.focus')}:</span> {data.project_focus}</div>
        </div>
    </div>

    <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">{translate('onboarding.step9.accept')}</h3>
      <ul className="space-y-1 text-xs text-gray-600">
          {(lines.length ? lines : [
            '• Pueden contactarme por email para temas del evento.',
            '• Habrá fotos y videos durante la hackathon.',
            '• El envío no garantiza una plaza.'
          ]).map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
      </ul>
    </div>
  </div>
)
}

export default OnboardingModal
