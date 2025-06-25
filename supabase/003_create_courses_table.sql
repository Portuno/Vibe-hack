-- Crear tabla courses con la estructura necesaria para la aplicación
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    vertical TEXT DEFAULT 'Tecnología',
    level TEXT CHECK (level IN ('Básico', 'Intermedio', 'Avanzado')) DEFAULT 'Básico',
    type TEXT CHECK (type IN ('Gratuito', 'Pago')) DEFAULT 'Gratuito',
    status TEXT CHECK (status IN ('borrador', 'publicado', 'archivado')) DEFAULT 'borrador',
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_courses_creator_id ON public.courses(creator_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_vertical ON public.courses(vertical);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON public.courses(created_at);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos datos de ejemplo
INSERT INTO public.courses (creator_id, name, description, vertical, level, type, status, url)
VALUES 
    (
        'f2317142-17c1-4b12-817a-853b03645398',
        'Introducción a React',
        'Aprende los fundamentos de React desde cero con ejemplos prácticos',
        'Tecnología',
        'Básico',
        'Gratuito',
        'publicado',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070'
    ),
    (
        'e2a7a24c-1e91-4d7a-a432-026880554129',
        'Marketing Digital Avanzado',
        'Estrategias avanzadas de marketing digital para empresas',
        'Marketing',
        'Avanzado',
        'Pago',
        'publicado',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015'
    ),
    (
        'f2317142-17c1-4b12-817a-853b03645398',
        'Diseño UX/UI Intermedio',
        'Mejora tus habilidades de diseño con herramientas profesionales',
        'Diseño',
        'Intermedio',
        'Gratuito',
        'publicado',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2064'
    )
ON CONFLICT (id) DO NOTHING; 