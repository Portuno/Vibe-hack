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
        // El envío fue exitoso, el hook ya maneja el estado
        setTimeout(() => {
          onClose()
          resetOnboarding()
          // Resetear el formulario
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
        }, 2000) // Dar tiempo para que el usuario vea el mensaje de éxito
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
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ¡Registro Exitoso! 🎉
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Tu inscripción ha sido enviada correctamente. Te contactaremos pronto para confirmar tu participación en el hackathon.
          </p>
          
          {/* Información adicional */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-200">
            <p className="text-sm text-green-700">
              📧 Revisa tu email para confirmar tu registro
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center mx-auto space-x-2"
          >
            <span>¡Perfecto!</span>
            <Check className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
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
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {currentStep === 1 && 'Cuéntanos quién eres y cómo podemos contactarte'}
                  {currentStep === 2 && 'Define tu dinámica de trabajo en equipo'}
                  {currentStep === 3 && 'Cuéntanos el estado de tu proyecto o idea'}
                  {currentStep === 4 && 'Define el enfoque estratégico de tu idea'}
                  {currentStep === 5 && 'Evalúa tu comodidad en diferentes áreas'}
                  {currentStep === 6 && 'Un toque lúdico para romper el hielo'}
                  {currentStep === 7 && '¿Qué herramientas usas para crear?'}
                  {currentStep === 8 && '¿Qué esperas de esta hackathon?'}
                  {currentStep === 9 && 'Revisa tu información y confirma el registro'}
                </p>
              </div>
            </div>
            
            {/* Controles del header */}
            <div className="flex flex-col items-end space-y-3">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 group hover:scale-110"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
              </button>
              
              {/* Indicador de progreso mejorado */}
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600">{currentStep}</div>
                <div className="text-xs text-gray-500">de {totalSteps}</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar mejorado */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Paso {currentStep}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% completado</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-500 via-teal-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {(error || localError) && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl animate-in slide-in-from-top-2 duration-300">
            <p className="text-red-600 text-sm">{localError || error}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[40vh]">
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

        {/* Footer Navigation */}
        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            {/* Botón Anterior */}
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-200 rounded-full text-gray-600 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            {/* Progress Dots mejorados */}
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i + 1 === currentStep 
                      ? 'bg-gradient-to-r from-primary-500 to-teal-500 scale-125' 
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
                className="bg-gradient-to-r from-primary-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 group"
              >
                <span>Siguiente</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>¡Confirmar Inscripción!</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Información adicional del paso */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
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
        </div>
      </div>
    </div>
  )
}

// Step Components
const Step1BasicInfo = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Nombre completo *
      </label>
      <input
        type="text"
        value={data.full_name}
        onChange={(e) => updateData('full_name', e.target.value)}
        placeholder="Tu nombre completo"
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email de contacto *
      </label>
      <input
        type="email"
        value={data.email}
        onChange={(e) => updateData('email', e.target.value)}
        placeholder="tu@email.com"
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Link a red social o portfolio
      </label>
      <input
        type="url"
        value={data.social_link}
        onChange={(e) => updateData('social_link', e.target.value)}
        placeholder="LinkedIn, GitHub, Instagram..."
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Rol autopercibido *
      </label>
      <input
        type="text"
        value={data.role}
        onChange={(e) => updateData('role', e.target.value)}
        placeholder="Developer, Diseñador/a UX, Creador/a de contenido..."
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        required
      />
    </div>

    {/* Consentimiento para recibir novedades */}
    <div className="pt-4">
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.consent_newsletter || false}
          onChange={(e) => updateData('consent_newsletter', e.target.checked)}
          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
        />
        <div className="text-sm text-gray-600 leading-relaxed">
          <span className="font-medium">Acepto recibir novedades y anuncios</span> de parte de Terreta Hub, incluyendo información sobre eventos, recursos y oportunidades de la comunidad innovadora de Valencia. Puedo cancelar mi suscripción en cualquier momento.
        </div>
      </label>
    </div>
  </div>
)

const Step2TeamPreference = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-4">
    {[
      { value: 'solo', title: 'Quiero trabajar solo/a', subtitle: 'Prefiero desarrollar mi proyecto de forma independiente' },
      { value: 'buscando', title: 'Estoy buscando equipo', subtitle: 'Me gustaría formar equipo con otros participantes' },
      { value: 'equipo', title: 'Ya tengo equipo armado', subtitle: 'Vengo con mi equipo ya formado' }
    ].map((option) => (
      <label
        key={option.value}
        className={`block p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
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
          <div>
            <div className="font-medium text-gray-800">{option.title}</div>
            <div className="text-sm text-gray-600">{option.subtitle}</div>
          </div>
        </div>
      </label>
    ))}

    {data.team_preference === 'equipo' && (
      <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del equipo
          </label>
          <input
            type="text"
            value={data.team_name}
            onChange={(e) => updateData('team_name', e.target.value)}
            placeholder="Nombre de tu equipo"
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombres de los miembros
          </label>
          <input
            type="text"
            value={data.team_members}
            onChange={(e) => updateData('team_members', e.target.value)}
            placeholder="Juan Pérez, María García... (cada uno debe registrarse individualmente)"
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    )}
  </div>
)

const Step3ProjectStatus = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-6">
    <div className="space-y-3">
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
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cuéntanos más (opcional)
      </label>
      <textarea
        value={data.project_status.join(', ')}
        onChange={(e) => updateData('project_status', e.target.value.split(', ').filter(Boolean))}
        placeholder="Describe tu proyecto, idea o problema que quieres resolver..."
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
      />
    </div>
  </div>
)

const Step4ProjectFocus = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-4">
    {[
      { value: 'b2c', title: 'B2C', subtitle: 'Productos o servicios para consumidores finales', example: 'una app para estudiantes universitarios', color: 'bg-purple-500' },
      { value: 'b2b', title: 'B2B', subtitle: 'Herramientas para negocios o profesionales', example: 'un bot de WhatsApp que responde a clientes', color: 'bg-orange-500' },
      { value: 'social', title: 'Causa Social', subtitle: 'Enfoque con impacto social o comunitario', example: 'una herramienta que mejora la accesibilidad digital', color: 'bg-red-500' },
      { value: 'other', title: 'Otro', subtitle: 'Proyectos artísticos, performance, instalaciones interactivas', example: 'arte generativo, experiencias inmersivas', color: 'bg-green-500' }
    ].map((option) => (
      <label
        key={option.value}
        className={`block p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
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
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${option.color} rounded-2xl flex items-center justify-center text-white font-bold`}>
            {option.title}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800">{option.subtitle}</div>
            <div className="text-sm text-gray-600">Ejemplo: {option.example}</div>
          </div>
        </div>
      </label>
    ))}
  </div>
)

const Step5Skills = ({ data, updateSkills }: { data: OnboardingData; updateSkills: (skill: keyof OnboardingData['skills'], value: number) => void }) => (
  <div className="space-y-6">
    {[
      { key: 'creativity', title: 'Creatividad y generación de ideas', question: '¿Se te ocurren conceptos, soluciones o formas nuevas de hacer las cosas?' },
      { key: 'programming', title: 'Programación / desarrollo técnico', question: '¿Sabes convertir ideas en productos funcionales usando código?' },
      { key: 'design', title: 'Diseño y experiencia de usuario (UX/UI)', question: '¿Tienes ojo para lo visual, lo intuitivo y lo usable?' },
      { key: 'communication', title: 'Comunicación y narrativa', question: '¿Te sientes cómodo/a explicando, contando historias o creando contenido?' },
      { key: 'leadership', title: 'Organización y liderazgo', question: '¿Sabes coordinar tareas, motivar equipos o tomar decisiones?' },
      { key: 'ai_tools', title: 'IA / no-code / prompt engineering', question: '¿Usas IA para crear, prototipar o resolver tareas cotidianas?' }
    ].map((skill) => (
      <div key={skill.key} className="space-y-3">
        <div>
          <div className="font-medium text-gray-800 mb-1">{skill.title}</div>
          <div className="text-sm text-gray-600">{skill.question}</div>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1"
            max="10"
            value={data.skills[skill.key as keyof OnboardingData['skills']]}
            onChange={(e) => updateSkills(skill.key as keyof OnboardingData['skills'], parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-primary-600 font-bold w-8 text-center">
            {data.skills[skill.key as keyof OnboardingData['skills']]}
          </div>
        </div>
      </div>
    ))}
  </div>
)

const Step6Astrology = ({ data, updateAstrology }: { data: OnboardingData; updateAstrology: (field: keyof OnboardingData['astrology'], value: string) => void }) => (
  <div className="space-y-6">
    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
      <div className="flex items-center space-x-2 text-purple-700">
        <Star className="h-5 w-5" />
        <span className="text-sm font-medium">Esta sección es completamente opcional y divertida. Nos ayuda a crear equipos con buena energía ✨</span>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Signo Solar
      </label>
      <select
        value={data.astrology.solar_sign}
        onChange={(e) => updateAstrology('solar_sign', e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ascendente
      </label>
      <input
        type="text"
        value={data.astrology.ascendant}
        onChange={(e) => updateAstrology('ascendant', e.target.value)}
        placeholder="Si lo sabes..."
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Signo Lunar
      </label>
      <input
        type="text"
        value={data.astrology.lunar_sign}
        onChange={(e) => updateAstrology('lunar_sign', e.target.value)}
        placeholder="Si lo sabes..."
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        ¿Qué piensas sobre la astrología?
      </label>
      <textarea
        value={data.astrology.opinion}
        onChange={(e) => updateAstrology('opinion', e.target.value)}
        placeholder="'Creo que suma para formar equipos compatibles', 'Es solo por diversión', 'No tengo opinión'"
        rows={3}
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
      />
    </div>
  </div>
)

const Step7AITools = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-6">
    <div className="space-y-3">
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
          <span className="text-gray-700">{tool}</span>
        </label>
      ))}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Otras herramientas
      </label>
      <input
        type="text"
        placeholder="¿Usas alguna otra herramienta de IA?"
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>
  </div>
)

const Step8Expectations = ({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) => (
  <div className="space-y-6">
    <div className="space-y-3">
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
          <span className="text-gray-700">{expectation}</span>
        </label>
      ))}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Otras expectativas
      </label>
      <textarea
        placeholder="¿Algo más que esperas de la hackathon?"
        rows={3}
        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
      />
    </div>
  </div>
)

const Step9Confirmation = ({ data }: { data: OnboardingData }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 rounded-2xl p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Resumen de tu registro</h3>
      <div className="space-y-2 text-sm">
        <div><span className="font-medium">Nombre:</span> {data.full_name}</div>
        <div><span className="font-medium">Email:</span> {data.email}</div>
        <div><span className="font-medium">Rol:</span> {data.role}</div>
        <div><span className="font-medium">Trabajo en equipo:</span> {
          data.team_preference === 'solo' ? 'Solo' :
          data.team_preference === 'buscando' ? 'Buscando equipo' :
          'Tengo equipo'
        }</div>
        <div><span className="font-medium">Enfoque:</span> {data.project_focus}</div>
        <div><span className="font-medium">Expectativas:</span> {data.expectations.join(', ') || 'No especificadas'}</div>
      </div>
    </div>

    <div className="bg-gray-50 rounded-2xl p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Al confirmar, acepto que:</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        <li>• Pueden contactarme por email para temas relacionados al evento.</li>
        <li>• Durante la hackathon habrá fotos y videos que podrían ser utilizados con fines de comunicación y difusión.</li>
        <li>• El envío de este formulario no garantiza una plaza: los cupos son limitados y la participación será confirmada por la organización.</li>
      </ul>
    </div>
  </div>
)

export default OnboardingModal
