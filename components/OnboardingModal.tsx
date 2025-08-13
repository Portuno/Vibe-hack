'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, Check, User, Users, Lightbulb, Target, Brain, Star, Zap, Heart } from 'lucide-react'
import { useOnboarding, OnboardingData } from '@/hooks/useOnboarding'

const OnboardingModal = ({ isOpen, onClose, buttonPosition }: { 
  isOpen: boolean; 
  onClose: () => void; 
  buttonPosition: { top: number; left: number } 
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const { submitOnboarding, isLoading, error, success, resetOnboarding } = useOnboarding()
  const [localError, setLocalError] = useState<string | null>(null)
  
  const [data, setData] = useState<OnboardingData>({
    full_name: '',
    email: '',
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

  // Prevenir scroll del body cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleNext = () => {
    // Validar campos obligatorios según el paso actual
    if (currentStep === 1) {
      if (!data.full_name.trim() || !data.email.trim() || !data.role.trim()) {
        setLocalError('Por favor completa todos los campos obligatorios')
        return
      }
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        setLocalError('Por favor ingresa un email válido')
        return
      }
    }
    
    if (currentStep < totalSteps) {
      setLocalError(null) // Limpiar errores previos
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
    return (
<<<<<<< HEAD
      <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
          {/* Icono de éxito animado */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Check className="h-10 w-10 text-white" />
            </div>
            {/* Partículas de celebración */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -top-1 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
=======
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-white" />
>>>>>>> e036398 (?)
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            ¡Registro Exitoso! 🎉
          </h2>
          
          <p className="text-gray-600 mb-6 text-base">
            Tu inscripción ha sido enviada correctamente.
          </p>
          
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold w-full"
          >
            ¡Perfecto!
          </button>
        </div>
      </div>
    )
  }

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[9999] flex items-start justify-center p-4 animate-in fade-in duration-300" style={{ paddingTop: `${Math.max(20, buttonPosition.top - 100)}px` }}>
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[75vh] overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        {/* Header mejorado */}
        <div className="bg-gradient-to-r from-primary-50 via-white to-teal-50 p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              {/* Icono animado del paso actual */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg">
                  {currentStep === 1 && <User className="h-6 w-6 text-white" />}
                  {currentStep === 2 && <Users className="h-6 w-6 text-white" />}
                  {currentStep === 3 && <Lightbulb className="h-6 w-6 text-white" />}
                  {currentStep === 4 && <Target className="h-6 w-6 text-white" />}
                  {currentStep === 5 && <Brain className="h-6 w-6 text-white" />}
                  {currentStep === 6 && <Star className="h-6 w-6 text-white" />}
                  {currentStep === 7 && <Zap className="h-6 w-6 text-white" />}
                  {currentStep === 8 && <Heart className="h-6 w-6 text-white" />}
                  {currentStep === 9 && <Check className="h-6 w-6 text-white" />}
                </div>
                {/* Indicador de paso activo */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {currentStep === 1 && '👋 Identidad básica'}
                  {currentStep === 2 && '🤝 ¿Con quién quieres participar?'}
                  {currentStep === 3 && '💡 ¿Con qué vienes a esta hackathon?'}
                  {currentStep === 4 && '🎯 ¿A qué apunta tu proyecto?'}
                  {currentStep === 5 && '🧠 Tus habilidades'}
                  {currentStep === 6 && '⭐ Carta astral'}
                  {currentStep === 7 && '🤖 Herramientas de IA'}
                  {currentStep === 8 && '💭 Expectativas'}
                  {currentStep === 9 && '✅ Confirmación'}
=======
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[98vh] flex flex-col shadow-2xl border border-gray-100">
        {/* Header compacto */}
        <div className="bg-gradient-to-r from-primary-50 to-teal-50 p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                {currentStep === 1 && <User className="h-4 w-4 text-white" />}
                {currentStep === 2 && <Users className="h-4 w-4 text-white" />}
                {currentStep === 3 && <Lightbulb className="h-4 w-4 text-white" />}
                {currentStep === 4 && <Target className="h-4 w-4 text-white" />}
                {currentStep === 5 && <Brain className="h-4 w-4 text-white" />}
                {currentStep === 6 && <Star className="h-4 w-4 text-white" />}
                {currentStep === 7 && <Zap className="h-4 w-4 text-white" />}
                {currentStep === 8 && <Heart className="h-4 w-4 text-white" />}
                {currentStep === 9 && <Check className="h-4 w-4 text-white" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {currentStep === 1 && 'Identidad básica'}
                  {currentStep === 2 && 'Equipo'}
                  {currentStep === 3 && 'Proyecto'}
                  {currentStep === 4 && 'Enfoque'}
                  {currentStep === 5 && 'Habilidades'}
                  {currentStep === 6 && 'Astrología'}
                  {currentStep === 7 && 'IA Tools'}
                  {currentStep === 8 && 'Expectativas'}
                  {currentStep === 9 && 'Confirmar'}
>>>>>>> e036398 (?)
                </h2>
                <p className="text-xs text-gray-600 truncate">
                  Paso {currentStep} de {totalSteps}
                </p>
              </div>
            </div>
            
<<<<<<< HEAD
            {/* Solo botón de cerrar */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 group hover:scale-110"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
            </button>
          </div>
                  </div>

        {/* Error Message */}
        {(error || localError) && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl animate-in slide-in-from-top-2 duration-300">
            <p className="text-red-600 text-sm">{localError || error}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh] pb-32">
=======
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
            >
              <X className="h-3 w-3 text-gray-600" />
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

        {/* Error Message */}
        {error && (
          <div className="mx-3 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Content - Scrollable solo si es necesario */}
        <div className="flex-1 overflow-y-auto p-3">
>>>>>>> e036398 (?)
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

<<<<<<< HEAD
                {/* Footer Navigation - Siempre visible */}
        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white sticky bottom-0">
          <div className="flex justify-between items-center">
=======
        {/* Footer Navigation - Siempre visible */}
        <div className="p-3 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center space-x-3">
>>>>>>> e036398 (?)
            {/* Botón Anterior */}
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
<<<<<<< HEAD
              className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-200 rounded-full text-gray-600 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium hover:scale-105"
=======
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
>>>>>>> e036398 (?)
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
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
                <span className="hidden sm:inline">Siguiente</span>
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
                  '¡Confirmar!'
                )}
              </button>
            )}
          </div>
<<<<<<< HEAD
          
          {/* Información del paso actual - Solo en la parte inferior */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 font-medium">
              {currentStep === 1 && 'Paso 1 de 9 • Información básica'}
              {currentStep === 2 && 'Paso 2 de 9 • Preferencias de equipo'}
              {currentStep === 3 && 'Paso 3 de 9 • Estado del proyecto'}
              {currentStep === 4 && 'Paso 4 de 9 • Enfoque del proyecto'}
              {currentStep === 5 && 'Paso 5 de 9 • Evaluación de habilidades'}
              {currentStep === 6 && 'Paso 6 de 9 • Información astrológica'}
              {currentStep === 7 && 'Paso 7 de 9 • Herramientas de IA'}
              {currentStep === 8 && 'Paso 8 de 9 • Expectativas'}
              {currentStep === 9 && 'Paso 9 de 9 • Confirmación final'}
            </p>
          </div>
=======
>>>>>>> e036398 (?)
        </div>
      </div>
    </div>
  )
}

// Step Components optimizados para mobile
const Step1BasicInfo = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Nombre completo *
      </label>
      <input
        type="text"
        value={data.full_name}
        onChange={(e) => updateData('full_name', e.target.value)}
        placeholder="Tu nombre completo"
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email de contacto *
      </label>
      <input
        type="email"
        value={data.email}
        onChange={(e) => updateData('email', e.target.value)}
        placeholder="tu@email.com"
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Link a red social o portfolio
      </label>
      <input
        type="url"
        value={data.social_link}
        onChange={(e) => updateData('social_link', e.target.value)}
        placeholder="LinkedIn, GitHub, Instagram..."
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Rol autopercibido *
      </label>
      <input
        type="text"
        value={data.role}
        onChange={(e) => updateData('role', e.target.value)}
        placeholder="Developer, Diseñador/a UX, Creador/a de contenido..."
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
        required
      />
    </div>
  </div>
)

const Step2TeamPreference = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-3">
    {[
      { value: 'solo', title: 'Quiero trabajar solo/a', subtitle: 'Proyecto independiente' },
      { value: 'buscando', title: 'Estoy buscando equipo', subtitle: 'Formar equipo' },
      { value: 'equipo', title: 'Ya tengo equipo armado', subtitle: 'Equipo formado' }
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
            Nombre del equipo
          </label>
          <input
            type="text"
            value={data.team_name}
            onChange={(e) => updateData('team_name', e.target.value)}
            placeholder="Nombre de tu equipo"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombres de los miembros
          </label>
          <input
            type="text"
            value={data.team_members}
            onChange={(e) => updateData('team_members', e.target.value)}
            placeholder="Juan Pérez, María García..."
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
          />
        </div>
      </div>
    )}
  </div>
)

const Step3ProjectStatus = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      {[
        'Tengo un proyecto iniciado',
        'Tengo problemas concretos que quiero resolver',
        'Tengo ideas que me gustaría empezar',
        'Quiero construir algo pero no tengo ideas todavía'
      ].map((option) => (
        <label key={option} className="flex items-center space-x-3 cursor-pointer">
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
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">{option}</span>
        </label>
      ))}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Cuéntanos más (opcional)
      </label>
      <textarea
        value={data.project_status.join(', ')}
        onChange={(e) => updateData('project_status', e.target.value.split(', ').filter(Boolean))}
        placeholder="Describe tu proyecto, idea o problema..."
        rows={3}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-base"
      />
    </div>
  </div>
)

const Step4ProjectFocus = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-3">
    {[
      { value: 'b2c', title: 'B2C', subtitle: 'Productos para consumidores finales', example: 'app para estudiantes', color: 'bg-purple-500' },
      { value: 'b2b', title: 'B2B', subtitle: 'Herramientas para negocios', example: 'bot de WhatsApp', color: 'bg-orange-500' },
      { value: 'social', title: 'Causa Social', subtitle: 'Impacto social o comunitario', example: 'accesibilidad digital', color: 'bg-red-500' },
      { value: 'other', title: 'Otro', subtitle: 'Proyectos artísticos, performance', example: 'arte generativo', color: 'bg-green-500' }
    ].map((option) => (
      <label
        key={option.value}
        className={`block p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
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
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${option.color} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
            {option.title}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 text-sm">{option.subtitle}</div>
            <div className="text-xs text-gray-600">Ej: {option.example}</div>
          </div>
        </div>
      </label>
    ))}
  </div>
)

const Step5Skills = ({ data, updateSkills }: { data: OnboardingData; updateSkills: (skill: keyof OnboardingData['skills'], value: number) => void }) => (
  <div className="space-y-4">
    {[
      { key: 'creativity', title: 'Creatividad', question: '¿Se te ocurren conceptos nuevos?' },
      { key: 'programming', title: 'Programación', question: '¿Sabes convertir ideas en código?' },
      { key: 'design', title: 'Diseño UX/UI', question: '¿Tienes ojo para lo visual?' },
      { key: 'communication', title: 'Comunicación', question: '¿Te sientes cómodo explicando?' },
      { key: 'leadership', title: 'Liderazgo', question: '¿Sabes coordinar equipos?' },
      { key: 'ai_tools', title: 'IA Tools', question: '¿Usas IA para crear?' }
    ].map((skill) => (
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

const Step6Astrology = ({ data, updateAstrology }: { data: OnboardingData; updateAstrology: (field: keyof OnboardingData['astrology'], value: string) => void }) => (
<<<<<<< HEAD
  <div className="space-y-6">
=======
  <div className="space-y-4">
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
      <div className="flex items-center space-x-2 text-purple-700">
        <Star className="h-4 w-4" />
        <span className="text-xs font-medium">Opcional y divertido ✨</span>
      </div>
    </div>

>>>>>>> e036398 (?)
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Signo Solar
      </label>
      <select
        value={data.astrology.solar_sign}
        onChange={(e) => updateAstrology('solar_sign', e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      >
        <option value="">Tu signo</option>
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
        Ascendente
      </label>
      <input
        type="text"
        value={data.astrology.ascendant}
        onChange={(e) => updateAstrology('ascendant', e.target.value)}
        placeholder="Si lo sabes..."
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Signo Lunar
      </label>
      <input
        type="text"
        value={data.astrology.lunar_sign}
        onChange={(e) => updateAstrology('lunar_sign', e.target.value)}
        placeholder="Si lo sabes..."
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ¿Qué piensas sobre la astrología?
      </label>
      <textarea
        value={data.astrology.opinion}
        onChange={(e) => updateAstrology('opinion', e.target.value)}
        placeholder="'Creo que suma', 'Es solo por diversión', 'No tengo opinión'"
        rows={2}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-base"
      />
    </div>
  </div>
)

const Step7AITools = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      {[
        'Base44 / Lovable / Bolt / v0',
        'ChatGPT / Claude / Perplexity',
        'Figma AI / Diagram',
        'Replit Ghostwriter / Codeium / GitHub Copilot',
        'Midjourney / DALL-E / Runway',
        'Ninguna (pero tengo ganas de aprender)'
      ].map((tool) => (
        <label key={tool} className="flex items-center space-x-3 cursor-pointer">
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
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">{tool}</span>
        </label>
      ))}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Otras herramientas
      </label>
      <input
        type="text"
        placeholder="¿Usas alguna otra herramienta de IA?"
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
      />
    </div>
  </div>
)

const Step8Expectations = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      {[
        'Conocer gente con intereses similares',
        'Aprender sobre IA y nuevas tecnologías',
        'Lanzar un proyecto real',
        'Validar una idea',
        'Experimentar y jugar',
        'Ganar 😎'
      ].map((expectation) => (
        <label key={expectation} className="flex items-center space-x-3 cursor-pointer">
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
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">{expectation}</span>
        </label>
      ))}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Otras expectativas
      </label>
      <textarea
        placeholder="¿Algo más que esperas de la hackathon?"
        rows={2}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-base"
      />
    </div>
  </div>
)

const Step9Confirmation = ({ data }: { data: OnboardingData }) => (
  <div className="space-y-4">
    <div className="bg-blue-50 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3 text-sm">Resumen de tu registro</h3>
      <div className="space-y-1 text-xs">
        <div><span className="font-medium">Nombre:</span> {data.full_name}</div>
        <div><span className="font-medium">Email:</span> {data.email}</div>
        <div><span className="font-medium">Rol:</span> {data.role}</div>
        <div><span className="font-medium">Equipo:</span> {
          data.team_preference === 'solo' ? 'Solo' :
          data.team_preference === 'buscando' ? 'Buscando' :
          'Tengo equipo'
        }</div>
        <div><span className="font-medium">Enfoque:</span> {data.project_focus}</div>
      </div>
    </div>

    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3 text-sm">Al confirmar, acepto que:</h3>
      <ul className="space-y-1 text-xs text-gray-600">
        <li>• Pueden contactarme por email para temas del evento.</li>
        <li>• Habrá fotos y videos durante la hackathon.</li>
        <li>• El envío no garantiza una plaza.</li>
      </ul>
    </div>
  </div>
)

export default OnboardingModal
