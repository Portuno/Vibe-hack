# 🚀 Configuración de la Página de Sponsors

## 📋 Requisitos Previos

- Proyecto Next.js configurado
- Cuenta de Supabase activa
- Variables de entorno configuradas

## 🔧 Pasos de Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 2. Base de Datos en Supabase

#### Opción A: SQL Editor (Recomendado)
1. Ve a tu dashboard de Supabase
2. Navega a **SQL Editor**
3. Copia y pega el contenido del archivo `supabase/01_create_sponsors_table.sql`
4. Ejecuta el script

#### Opción B: Table Editor
1. Ve a **Table Editor** en Supabase
2. Crea una nueva tabla llamada `sponsors`
3. Agrega las columnas según la estructura del SQL

### 3. Estructura de la Tabla

```sql
sponsors:
- id (UUID, Primary Key)
- name (VARCHAR(255), NOT NULL)
- description (TEXT, NOT NULL)
- logo_url (TEXT, NOT NULL)
- website_url (TEXT, NOT NULL)
- tier (VARCHAR(20), NOT NULL) - 'principal' o 'co-sponsor'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 4. Datos de Ejemplo

El SQL incluye datos de ejemplo para Base44 y Mabot. Puedes:
- Mantenerlos para testing
- Reemplazarlos con tus sponsors reales
- Eliminarlos y agregar los tuyos

### 5. Agregar Nuevos Sponsors

```sql
INSERT INTO sponsors (name, description, logo_url, website_url, tier) 
VALUES (
    'Nombre de la Empresa',
    'Descripción de la empresa y su participación',
    'https://url-del-logo.com/imagen.jpg',
    'https://sitio-web.com',
    'principal'  -- o 'co-sponsor'
);
```

## 🎨 Características de la Página

### ✅ Funcionalidades Implementadas
- **Diseño Responsivo**: Se adapta a móviles, tablets y desktop
- **Cards Interactivas**: Hover effects y transiciones suaves
- **Navegación por Teclado**: Accesibilidad completa
- **Estados de Carga**: Loading, error y empty states
- **Separación por Tiers**: Sponsors principales y co-sponsors
- **Links Externos**: Abre sitios web en nueva pestaña

### 🎯 Estructura Visual
- **Hero Section**: Título principal con gradiente
- **Sponsor Principal**: Sección destacada para el sponsor principal
- **Co-Sponsors**: Grid de tarjetas para sponsors secundarios
- **CTA Section**: Llamada a la acción para nuevos sponsors

## 🔒 Seguridad

- **Row Level Security (RLS)** habilitado
- **Lectura pública** para mostrar sponsors
- **Modificación restringida** solo a usuarios admin
- **Validación de datos** en la base de datos

## 🚀 Uso

1. **Desarrollo**: `npm run dev`
2. **Construcción**: `npm run build`
3. **Producción**: `npm start`

## 📱 Responsive Design

- **Mobile**: 1 columna para sponsors principales, 1 para co-sponsors
- **Tablet**: 1 columna para principales, 2 para co-sponsors
- **Desktop**: 2 columnas para principales, 3 para co-sponsors

## 🎨 Personalización

### Colores
Los colores principales están definidos en `tailwind.config.js`:
- Primary: Gradiente púrpura-azul
- Background: Gradiente suave de primary-50 a blanco
- Cards: Blanco con sombras

### Tipografía
- Títulos: Inter, font-bold
- Descripciones: Inter, text-gray-600
- Botones: Inter, font-semibold

## 🐛 Troubleshooting

### Error: "No hay sponsors disponibles"
- Verifica que la tabla `sponsors` existe
- Confirma que hay datos en la tabla
- Revisa las políticas de RLS

### Error: "Error al cargar sponsors"
- Verifica las variables de entorno
- Confirma la conexión a Supabase
- Revisa la consola del navegador

### Imágenes no se cargan
- Verifica que las URLs de logos sean válidas
- Confirma que las imágenes sean accesibles públicamente
- Usa servicios como Unsplash o Cloudinary para testing

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador
2. Verifica los logs de Supabase
3. Confirma la configuración de variables de entorno
4. Revisa las políticas de seguridad de la base de datos
