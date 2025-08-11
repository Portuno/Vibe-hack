"use client"

import { useInscritosCount } from '@/hooks/useInscritosCount'

export default function InscritosCounter() {
  // Solo ejecutar el hook si estamos en el cliente y hay variables de entorno
  const shouldFetch = typeof window !== 'undefined' && 
    process.env['NEXT_PUBLIC_SUPABASE_URL'] && 
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

  const { count, totalCount, isLoading, error } = useInscritosCount()

  // Si no debemos hacer fetch, mostrar un placeholder
  if (!shouldFetch) {
    return (
      <div className="bg-teal-50 rounded-2xl p-4 text-center">
        <div className="text-2xl font-bold text-teal-600">...</div>
        <div className="text-sm text-teal-700">Inscriptos</div>
      </div>
    )
  }

  // Debug: Mostrar errores si los hay
  if (error) {
    console.error('Error en InscritosCounter:', error)
    return (
      <div className="bg-red-50 rounded-2xl p-4 text-center">
        <div className="text-sm text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="bg-teal-50 rounded-2xl p-4 text-center">
      <div className="text-2xl font-bold text-teal-600">
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
        ) : (
          count
        )}
      </div>
      <div className="text-sm text-teal-700">Inscriptos</div>
      
      {/* Mostrar conteo confirmado si es diferente del total */}
      {!isLoading && totalCount > 0 && totalCount < count && (
        <div className="text-xs text-teal-500 mt-1">
          {totalCount} confirmados
        </div>
      )}
    </div>
  )
}
