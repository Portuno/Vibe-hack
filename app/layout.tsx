import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VibeHack - Construye, Lanza y Valida en 72hs',
  description: 'Un fin de semana intensivo para inventar la nueva era de la creación de productos. Únete a un grupo experimental de mentes innovadoras.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
