-- Sistema de contactos para Terreta Hub
-- Incluye tabla de contactos, tipos de motivos, y almacenamiento de archivos

-- 1. Crear enum para motivos de contacto
CREATE TYPE contact_reason AS ENUM (
    'consulta_general',
    'soporte_tecnico',
    'propuesta_colaboracion',
    'reportar_problema',
    'sugerencia_mejora',
    'solicitar_evento',
    'partnership',
    'prensa_media',
    'otro'
);

-- 2. Crear tabla de contactos
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Información básica
    full_name TEXT NOT NULL,
    email TEXT,
    reason contact_reason NOT NULL,
    message TEXT NOT NULL,
    
    -- Archivo adjunto
    attachment_url TEXT,
    attachment_filename TEXT,
    attachment_size BIGINT,
    attachment_mime_type TEXT,
    
    -- Metadatos del contacto
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    
    -- Estado del contacto
    status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'en_revision', 'respondido', 'cerrado')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('baja', 'normal', 'alta', 'urgente')),
    
    -- Información de seguimiento
    assigned_to UUID, -- ID del admin que lo maneja
    internal_notes TEXT, -- Notas internas para el equipo
    response_sent_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crear bucket de almacenamiento para archivos adjuntos
INSERT INTO storage.buckets (id, name, public)
VALUES ('contact-attachments', 'contact-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Políticas de RLS para la tabla contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden crear contactos (público)
CREATE POLICY "Anyone can create contacts"
ON public.contacts
FOR INSERT
WITH CHECK (true);

-- Política: Solo administradores pueden ver contactos
CREATE POLICY "Only admins can view contacts"
ON public.contacts
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.uid() = auth.users.id 
        AND auth.users.email LIKE '%@terretahub.com'
    )
);

-- Política: Solo administradores pueden actualizar contactos
CREATE POLICY "Only admins can update contacts"
ON public.contacts
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.uid() = auth.users.id 
        AND auth.users.email LIKE '%@terretahub.com'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.uid() = auth.users.id 
        AND auth.users.email LIKE '%@terretahub.com'
    )
);

-- 5. Políticas de almacenamiento para archivos adjuntos
-- Permitir subir archivos a cualquier usuario (temporalmente)
CREATE POLICY "Anyone can upload contact attachments"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'contact-attachments');

-- Solo admins pueden ver los archivos adjuntos
CREATE POLICY "Only admins can view contact attachments"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'contact-attachments' 
    AND EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.uid() = auth.users.id 
        AND auth.users.email LIKE '%@terretahub.com'
    )
);

-- 6. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger para actualizar updated_at
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Índices para mejorar performance
CREATE INDEX idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX idx_contacts_status ON public.contacts(status);
CREATE INDEX idx_contacts_reason ON public.contacts(reason);
CREATE INDEX idx_contacts_email ON public.contacts(email) WHERE email IS NOT NULL;

-- 9. Función para obtener estadísticas de contactos (solo para admins)
CREATE OR REPLACE FUNCTION public.get_contact_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    -- Verificar que el usuario es admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.uid() = auth.users.id 
        AND auth.users.email LIKE '%@terretahub.com'
    ) THEN
        RAISE EXCEPTION 'Acceso denegado: Solo administradores pueden ver estadísticas';
    END IF;

    SELECT json_build_object(
        'total_contacts', (SELECT COUNT(*) FROM public.contacts),
        'new_contacts', (SELECT COUNT(*) FROM public.contacts WHERE status = 'nuevo'),
        'pending_contacts', (SELECT COUNT(*) FROM public.contacts WHERE status = 'en_revision'),
        'completed_contacts', (SELECT COUNT(*) FROM public.contacts WHERE status = 'cerrado'),
        'contacts_by_reason', (
            SELECT json_object_agg(reason, count)
            FROM (
                SELECT reason, COUNT(*) as count
                FROM public.contacts
                GROUP BY reason
            ) subq
        ),
        'contacts_last_7_days', (
            SELECT COUNT(*) FROM public.contacts 
            WHERE created_at >= NOW() - INTERVAL '7 days'
        )
    ) INTO result;

    RETURN result;
END;
$$;

-- 10. Insertar datos de ejemplo (comentado para producción)
/*
INSERT INTO public.contacts (full_name, email, reason, message) VALUES
('Ana García', 'ana@example.com', 'consulta_general', 'Hola, me gustaría saber más sobre Terreta Hub y cómo puedo participar en la comunidad.'),
('Carlos Martínez', 'carlos@startup.com', 'propuesta_colaboracion', 'Tenemos una startup local y nos interesa colaborar con Terreta Hub para eventos y networking.'),
('María López', NULL, 'sugerencia_mejora', 'Sería genial tener más eventos de tecnología blockchain en Valencia.');
*/

-- 11. Comentarios para documentación
COMMENT ON TABLE public.contacts IS 'Tabla para gestionar mensajes de contacto desde el formulario web';
COMMENT ON COLUMN public.contacts.full_name IS 'Nombre completo o seudónimo del contacto';
COMMENT ON COLUMN public.contacts.email IS 'Email opcional para responder al contacto';
COMMENT ON COLUMN public.contacts.reason IS 'Motivo o categoría del mensaje';
COMMENT ON COLUMN public.contacts.message IS 'Contenido del mensaje';
COMMENT ON COLUMN public.contacts.attachment_url IS 'URL del archivo adjunto en storage';
COMMENT ON COLUMN public.contacts.status IS 'Estado actual del contacto para seguimiento interno';
COMMENT ON COLUMN public.contacts.priority IS 'Prioridad asignada por el equipo de administración'; 