# 🚀 VibeHack Landing Page

Una landing page moderna y funcional para el hackathon VibeHack 2025, construida con Next.js, TypeScript y TailwindCSS.

## ✨ Características

- 🎨 **Diseño Moderno**: UI/UX limpia y atractiva con TailwindCSS
- 📱 **Responsive**: Optimizado para todos los dispositivos
- ⚡ **Performance**: Construido con Next.js 14 y optimizaciones
- 🎭 **Animaciones**: Efectos de hover y animaciones con Framer Motion
- 📧 **Newsletter**: Sistema de suscripción funcional con Supabase
- 🗄️ **Base de Datos**: Integración completa con Supabase
- 🔐 **Seguridad**: Row Level Security (RLS) implementado

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel (recomendado)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd vibehack-landing
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 4. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. Copia las credenciales del proyecto
3. Ejecuta los archivos SQL en la carpeta `supabase/` en este orden:
   - `01_newsletter_subscribers.sql`
   - `02_hackathon_registrations.sql`

### 5. Ejecutar el proyecto

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
vibehack-landing/
├── app/                    # App Router de Next.js 14
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   ├── hackathon/         # Página del hackathon
│   ├── sponsors/          # Página de patrocinadores
│   ├── agenda/            # Página de agenda
│   ├── comunidad/         # Página de comunidad
│   ├── recursos/          # Página de recursos
│   └── inscripcion/       # Página de inscripción
├── components/             # Componentes reutilizables
│   ├── Header.tsx         # Header con navegación
│   ├── AICodeGenerator.tsx # Componente AI animado
│   └── NewsletterForm.tsx # Formulario de newsletter
├── lib/                    # Utilidades y configuraciones
│   └── supabase.ts        # Cliente de Supabase
├── supabase/               # Archivos SQL para la base de datos
│   ├── 01_newsletter_subscribers.sql
│   └── 02_hackathon_registrations.sql
└── public/                 # Archivos estáticos
```

## 🎯 Páginas Implementadas

- **🏠 Home**: Landing page principal con hero section y newsletter
- **🚀 Hackathon**: Información detallada del evento
- **🤝 Sponsors**: Patrocinadores y niveles de patrocinio
- **📅 Agenda**: Cronograma detallado del evento
- **❤️ Comunidad**: Información de la comunidad y eventos
- **📚 Recursos**: Herramientas, APIs y materiales de aprendizaje
- **✍️ Inscripción**: Formulario completo de registro

## 🔧 Componentes Principales

### Header
- Navegación responsive
- Logo con animación
- Botón CTA de inscripción

### AI Code Generator
- Componente interactivo con hover effects
- Animaciones de flotación
- Efectos de movimiento

### Newsletter Form
- Formulario funcional con Supabase
- Validación de email
- Estado de éxito/error
- Integración con Telegram

## 🗄️ Base de Datos

### Tablas Principales

1. **newsletter_subscribers**: Suscriptores del newsletter
2. **hackathon_registrations**: Registros del hackathon
3. **hackathon_teams**: Equipos del hackathon
4. **team_members**: Miembros de los equipos

### Características de Seguridad

- Row Level Security (RLS) habilitado
- Políticas de acceso configuradas
- Triggers para timestamps automáticos
- Índices para optimización

## 🚀 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Otras opciones

- **Netlify**: Compatible con Next.js
- **Railway**: Para full-stack
- **Supabase**: Para hosting de la base de datos

## 🎨 Personalización

### Colores
Los colores se pueden personalizar en `tailwind.config.js`:

```javascript
colors: {
  primary: { /* Colores principales */ },
  teal: { /* Colores teal */ },
  orange: { /* Colores naranja */ }
}
```

### Fuentes
La fuente principal es Inter, configurada en `globals.css`

### Animaciones
Las animaciones se configuran en `tailwind.config.js` y se implementan con Framer Motion

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl
- **Grid System**: CSS Grid y Flexbox
- **Typography**: Escalado responsive

## 🔍 SEO

- Meta tags optimizados
- Open Graph tags
- Estructura semántica HTML
- Performance optimizado

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Ejecutar linting
npm run lint

# Build de producción
npm run build
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Telegram**: [@TerretaHub](https://t.me/+Qp73D_rzUmo2ODNk)
- **Email**: info@vibehack.com
- **Website**: [vibehack.com](https://vibehack.com)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [TailwindCSS](https://tailwindcss.com/) por el sistema de diseño
- [Supabase](https://supabase.com/) por la infraestructura backend
- [Framer Motion](https://www.framer.com/motion/) por las animaciones
- [Lucide](https://lucide.dev/) por los iconos

---

**¡Construye, Lanza y Valida en 72 horas! 🚀**
