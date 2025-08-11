-- Crear la tabla de sponsors
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT NOT NULL,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('principal', 'co-sponsor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_sponsors_created_at ON sponsors(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
-- Permitir lectura pública a todos los sponsors
CREATE POLICY "Allow public read access to sponsors" ON sponsors
    FOR SELECT USING (true);

-- Permitir inserción, actualización y eliminación solo a usuarios autenticados con rol admin
CREATE POLICY "Allow admin full access to sponsors" ON sponsors
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        auth.jwt() ->> 'role' = 'admin'
    );

-- Crear función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar automáticamente updated_at
CREATE TRIGGER update_sponsors_updated_at 
    BEFORE UPDATE ON sponsors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo (opcional - puedes eliminarlos después)
INSERT INTO sponsors (name, description, logo_url, website_url, tier) VALUES
(
    'Base44',
    'Construye apps funcionales en minutos solamente con palabras',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop&crop=center',
    'https://base44.com',
    'principal'
),
(
    'Mabot',
    'Plataforma de inteligencia artificial para automatización de procesos empresariales',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop&crop=center',
    'https://mabot.ai',
    'co-sponsor'
);

-- Comentarios sobre la estructura:
-- 
-- Esta tabla almacena información sobre los sponsors del hackathon:
-- - id: Identificador único UUID generado automáticamente
-- - name: Nombre de la empresa sponsor
-- - description: Descripción de la empresa y su participación
-- - logo_url: URL de la imagen del logo (debe ser una imagen válida)
-- - website_url: URL del sitio web de la empresa
-- - tier: Nivel del sponsor ('principal' o 'co-sponsor')
-- - created_at: Fecha de creación del registro
-- - updated_at: Fecha de última actualización (se actualiza automáticamente)
--
-- Características de seguridad:
-- - RLS habilitado para control de acceso
-- - Solo usuarios admin pueden modificar datos
-- - Lectura pública para mostrar sponsors en el frontend
-- - Validación de tier con CHECK constraint
--
-- Para agregar más sponsors, usa:
-- INSERT INTO sponsors (name, description, logo_url, website_url, tier) 
-- VALUES ('Nombre', 'Descripción', 'URL_Logo', 'URL_Website', 'principal'|'co-sponsor');
