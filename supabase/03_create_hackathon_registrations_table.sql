-- Crear la tabla de registros del hackathon
CREATE TABLE IF NOT EXISTS hackathon_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Información personal básica
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    social_link TEXT,
    
    -- Rol y preferencias de equipo
    role TEXT NOT NULL,
    team_preference TEXT NOT NULL CHECK (team_preference IN ('solo', 'buscando', 'tengo_equipo')),
    team_name TEXT,
    team_members TEXT,
    
    -- Estado del proyecto
    project_status TEXT[],
    project_focus TEXT[],
    
    -- Habilidades auto-evaluadas (1-10)
    skills JSONB NOT NULL DEFAULT '{}',
    creativity INTEGER CHECK (creativity >= 1 AND creativity <= 10),
    programming INTEGER CHECK (programming >= 1 AND programming <= 10),
    design INTEGER CHECK (design >= 1 AND design <= 10),
    communication INTEGER CHECK (communication >= 1 AND communication <= 10),
    leadership INTEGER CHECK (leadership >= 1 AND leadership <= 10),
    ai_tools INTEGER CHECK (ai_tools >= 1 AND ai_tools <= 10),
    
    -- Información astrológica opcional
    astrology JSONB DEFAULT '{}',
    sun_sign TEXT,
    ascendant TEXT,
    moon_sign TEXT,
    astrology_opinion TEXT,
    
    -- Herramientas y expectativas
    ai_tools_used TEXT[],
    expectations TEXT[],
    
    -- Estado del registro
    registration_status TEXT DEFAULT 'pending' CHECK (registration_status IN ('pending', 'confirmed', 'rejected')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_email ON hackathon_registrations(email);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_status ON hackathon_registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_created_at ON hackathon_registrations(created_at);

-- Crear función para actualizar el timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar automáticamente updated_at
CREATE TRIGGER update_hackathon_registrations_updated_at 
    BEFORE UPDATE ON hackathon_registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE hackathon_registrations ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción de registros (cualquiera puede registrarse)
CREATE POLICY "Allow public registration" ON hackathon_registrations
    FOR INSERT WITH CHECK (true);

-- Política para permitir lectura de registros confirmados (para mostrar estadísticas)
CREATE POLICY "Allow reading confirmed registrations" ON hackathon_registrations
    FOR SELECT USING (registration_status = 'confirmed');

-- Política para permitir lectura del propio registro por email
CREATE POLICY "Allow users to view own registration" ON hackathon_registrations
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR current_setting('request.jwt.claims', true)::json IS NULL);

-- Política para permitir actualización del propio registro
CREATE POLICY "Allow users to update own registration" ON hackathon_registrations
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Comentarios para documentar la tabla
COMMENT ON TABLE hackathon_registrations IS 'Registros de participantes del hackathon';
COMMENT ON COLUMN hackathon_registrations.full_name IS 'Nombre completo del participante';
COMMENT ON COLUMN hackathon_registrations.email IS 'Email de contacto del participante';
COMMENT ON COLUMN hackathon_registrations.social_link IS 'Link a red social o portfolio';
COMMENT ON COLUMN hackathon_registrations.role IS 'Rol auto-percibido del participante';
COMMENT ON COLUMN hackathon_registrations.team_preference IS 'Preferencia de trabajo en equipo: solo, buscando, tengo_equipo';
COMMENT ON COLUMN hackathon_registrations.team_name IS 'Nombre del equipo (si aplica)';
COMMENT ON COLUMN hackathon_registrations.team_members IS 'Nombres de los miembros del equipo';
COMMENT ON COLUMN hackathon_registrations.project_status IS 'Estado del proyecto o idea';
COMMENT ON COLUMN hackathon_registrations.project_focus IS 'Enfoque del proyecto';
COMMENT ON COLUMN hackathon_registrations.skills IS 'Habilidades auto-evaluadas del 1 al 10';
COMMENT ON COLUMN hackathon_registrations.creativity IS 'Puntuación de creatividad (1-10)';
COMMENT ON COLUMN hackathon_registrations.programming IS 'Puntuación de programación (1-10)';
COMMENT ON COLUMN hackathon_registrations.design IS 'Puntuación de diseño (1-10)';
COMMENT ON COLUMN hackathon_registrations.communication IS 'Puntuación de comunicación (1-10)';
COMMENT ON COLUMN hackathon_registrations.leadership IS 'Puntuación de liderazgo (1-10)';
COMMENT ON COLUMN hackathon_registrations.ai_tools IS 'Puntuación de herramientas de IA (1-10)';
COMMENT ON COLUMN hackathon_registrations.astrology IS 'Información astrológica opcional';
COMMENT ON COLUMN hackathon_registrations.sun_sign IS 'Signo solar';
COMMENT ON COLUMN hackathon_registrations.ascendant IS 'Signo ascendente';
COMMENT ON COLUMN hackathon_registrations.moon_sign IS 'Signo lunar';
COMMENT ON COLUMN hackathon_registrations.astrology_opinion IS 'Opinión sobre astrología';
COMMENT ON COLUMN hackathon_registrations.ai_tools_used IS 'Herramientas de IA que usa';
COMMENT ON COLUMN hackathon_registrations.expectations IS 'Expectativas de la hackathon';
COMMENT ON COLUMN hackathon_registrations.registration_status IS 'Estado del registro: pending, confirmed, rejected';
