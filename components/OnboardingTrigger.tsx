'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import OnboardingModal from './OnboardingModal'

interface OnboardingTriggerProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
  className?: string
}

const OnboardingTrigger = ({ 
  variant = 'primary', 
  size = 'md', 
  children = 'Inscribirse en la Hackathon',
  className = ''
}: OnboardingTriggerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const baseClasses = "inline-flex items-center justify-center space-x-2 font-semibold rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary-500 to-teal-500 text-white hover:shadow-xl hover:from-primary-600 hover:to-teal-600 shadow-lg",
    secondary: "bg-gray-800 text-white hover:bg-gray-700 hover:shadow-xl shadow-lg",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600 hover:shadow-lg"
  }
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`${classes} group`}
      >
        <span>{children}</span>
        <ArrowRight className={`h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 ${size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'}`} />
      </button>

      <OnboardingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default OnboardingTrigger
