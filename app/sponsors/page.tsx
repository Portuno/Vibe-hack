'use client'

import Header from '@/components/Header'
import SponsorCard from '@/components/SponsorCard'
import { useSponsors } from '@/hooks/useSponsors'
import { Trophy, Loader2, AlertCircle, Shield, ArrowRight } from 'lucide-react'

export default function SponsorsPage() {
  const { principalSponsors, coSponsors, loading, error } = useSponsors()

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando sponsors...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Error al cargar los sponsors: {error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-gray-900">Nuestros</span>{' '}
              <span className="text-teal-600">Sponsors</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Agradecemos a las empresas que hacen posible este evento y apoyan la innovación.
            </p>
          </div>

          {/* Principal Sponsors */}
          {principalSponsors.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Main Sponsors
              </h2>
              
              {/* Grid responsive para main sponsors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {principalSponsors.map((sponsor) => (
                  <SponsorCard 
                    key={sponsor.id} 
                    sponsor={sponsor}
                    variant="main"
                    className="w-full"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Co-Sponsors */}
          {coSponsors.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Co-Sponsors
              </h2>
              
              {/* Grid responsive para co-sponsors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {coSponsors.map((sponsor) => (
                  <SponsorCard 
                    key={sponsor.id} 
                    sponsor={sponsor}
                    variant="co"
                    className="w-full"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {principalSponsors.length === 0 && coSponsors.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No hay sponsors disponibles
              </h3>
              <p className="text-gray-500">
                Los sponsors aparecerán aquí cuando se agreguen a la base de datos.
              </p>
            </div>
          )}

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                ¿Quieres apoyar la innovación?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Conviértete en sponsor y conecta con el talento del futuro.
              </p>
              <a
                href="/contacto"
                className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>Quiero ser sponsor</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
