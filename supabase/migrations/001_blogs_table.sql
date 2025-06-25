-- Migración 001: Crear tabla de blogs
-- Esta tabla almacenará los artículos de blog creados por los usuarios

CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image VARCHAR(500),
  author_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER, -- tiempo estimado de lectura en minutos
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON public.blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON public.blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON public.blogs USING GIN(tags);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON public.blogs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Función para generar slug automáticamente
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Convertir título a slug básico
    base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := trim(both '-' from base_slug);
    
    final_slug := base_slug;
    
    -- Verificar si el slug ya existe y añadir número si es necesario
    WHILE EXISTS (SELECT 1 FROM blogs WHERE slug = final_slug) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar slug automáticamente si no se proporciona
CREATE OR REPLACE FUNCTION set_blog_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_slug(NEW.title);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_blog_slug_trigger
    BEFORE INSERT OR UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION set_blog_slug();

-- Función para calcular tiempo de lectura estimado
CREATE OR REPLACE FUNCTION calculate_read_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
    word_count INTEGER;
    read_time INTEGER;
BEGIN
    -- Contar palabras (aproximadamente)
    word_count := array_length(string_to_array(content, ' '), 1);
    -- Asumir 200 palabras por minuto de lectura promedio
    read_time := CEIL(word_count::FLOAT / 200);
    -- Mínimo 1 minuto
    IF read_time < 1 THEN
        read_time := 1;
    END IF;
    RETURN read_time;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular tiempo de lectura automáticamente
CREATE OR REPLACE FUNCTION set_read_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.read_time := calculate_read_time(NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_read_time_trigger
    BEFORE INSERT OR UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION set_read_time();

-- RLS (Row Level Security) para que los usuarios solo puedan editar sus propios blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy para que los usuarios puedan ver blogs publicados de cualquiera
CREATE POLICY "Anyone can view published blogs" ON public.blogs
    FOR SELECT USING (status = 'published');

-- Policy para que los usuarios puedan ver todos sus propios blogs
CREATE POLICY "Users can view own blogs" ON public.blogs
    FOR SELECT USING (auth.uid() = author_id);

-- Policy para que los usuarios puedan crear sus propios blogs
CREATE POLICY "Users can create own blogs" ON public.blogs
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Policy para que los usuarios puedan actualizar sus propios blogs
CREATE POLICY "Users can update own blogs" ON public.blogs
    FOR UPDATE USING (auth.uid() = author_id);

-- Policy para que los usuarios puedan eliminar sus propios blogs
CREATE POLICY "Users can delete own blogs" ON public.blogs
    FOR DELETE USING (auth.uid() = author_id);

-- Crear bucket de storage para imágenes de blogs
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies para el bucket de imágenes
CREATE POLICY "Blog images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'blog-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own blog images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'blog-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own blog images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'blog-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Insertar algunos blogs de ejemplo
INSERT INTO public.blogs (
    title, 
    content, 
    excerpt,
    author_id, 
    status, 
    tags,
    featured_image,
    published_at
) VALUES 
(
    'Bienvenidos a Terreta Hub',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Descubre todo lo que Terreta Hub tiene para ofrecer a la comunidad valenciana.',
    'f2317142-17c1-4b12-817a-853b03645398', 
    'published',
    ARRAY['comunidad', 'valencia', 'innovación'],
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
    NOW()
),
(
    'El futuro de la innovación en Valencia',
    'Valencia se está convirtiendo en un hub tecnológico importante. Con iniciativas como Terreta Hub, estamos construyendo un ecosistema que conecta a profesionales, emprendedores y creativos de toda la región. Este artículo explora las tendencias y oportunidades que están surgiendo en nuestra querida terreta.',
    'Exploramos cómo Valencia se está posicionando como referente en innovación y tecnología.',
    'e2a7a24c-1e91-4d7a-a432-026880554129',
    'published',
    ARRAY['valencia', 'tecnología', 'startups', 'ecosistema'],
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070',
    NOW() - INTERVAL '2 days'
),
(
    'Guía para nuevos miembros de la comunidad',
    'Si eres nuevo en Terreta Hub, este artículo te ayudará a aprovechar al máximo todas las funcionalidades de la plataforma. Desde crear tu perfil hasta subir tu primer proyecto, te guiamos paso a paso.',
    'Todo lo que necesitas saber para empezar en Terreta Hub.',
    'f2317142-17c1-4b12-817a-853b03645398',
    'published',
    ARRAY['guía', 'nuevos miembros', 'tutorial'],
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2126',
    NOW() - INTERVAL '5 days'
); 