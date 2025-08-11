-- =====================================================
-- BASE DE DATOS PARA RECURSOS - VIBEHACK
-- =====================================================

-- Habilitar la extensión UUID si no está disponible
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: CATEGORÍAS DE HERRAMIENTAS
-- =====================================================
CREATE TABLE IF NOT EXISTS tool_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Color hex para la UI
    icon VARCHAR(50) DEFAULT 'wrench', -- Nombre del icono de Lucide
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: HERRAMIENTAS
-- =====================================================
CREATE TABLE IF NOT EXISTS tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES tool_categories(id) ON DELETE SET NULL,
    link VARCHAR(500) NOT NULL,
    tags TEXT[] DEFAULT '{}', -- Array de tags
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    downloads INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT true,
    price VARCHAR(100) DEFAULT 'Gratis',
    featured BOOLEAN DEFAULT false, -- Para destacar herramientas importantes
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para búsquedas rápidas
    CONSTRAINT tools_name_unique UNIQUE(name)
);

-- =====================================================
-- TABLA: CATEGORÍAS DE GUÍAS
-- =====================================================
CREATE TABLE IF NOT EXISTS guide_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#10B981', -- Color hex para la UI
    icon VARCHAR(50) DEFAULT 'book-open', -- Nombre del icono de Lucide
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: GUÍAS Y TUTORIALES
-- =====================================================
CREATE TABLE IF NOT EXISTS guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES guide_categories(id) ON DELETE SET NULL,
    content TEXT, -- Contenido completo del tutorial (opcional)
    duration VARCHAR(20) NOT NULL, -- Ej: "15 min", "1 hora"
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Fácil', 'Intermedio', 'Avanzado')),
    author VARCHAR(200) NOT NULL,
    tags TEXT[] DEFAULT '{}', -- Array de tags
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    views INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false, -- Para destacar guías importantes
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para búsquedas rápidas
    CONSTRAINT guides_title_unique UNIQUE(title)
);

-- =====================================================
-- TABLA: VALORACIONES DE HERRAMIENTAS
-- =====================================================
CREATE TABLE IF NOT EXISTS tool_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID, -- Referencia al usuario (puede ser NULL para usuarios anónimos)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un usuario solo puede valorar una herramienta una vez
    CONSTRAINT unique_tool_user_rating UNIQUE(tool_id, user_id)
);

-- =====================================================
-- TABLA: VALORACIONES DE GUÍAS
-- =====================================================
CREATE TABLE IF NOT EXISTS guide_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
    user_id UUID, -- Referencia al usuario (puede ser NULL para usuarios anónimos)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un usuario solo puede valorar una guía una vez
    CONSTRAINT unique_guide_user_rating UNIQUE(guide_id, user_id)
);

-- =====================================================
-- TABLA: DESCARGAS DE HERRAMIENTAS
-- =====================================================
CREATE TABLE IF NOT EXISTS tool_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID, -- Referencia al usuario (puede ser NULL para usuarios anónimos)
    ip_address INET, -- Para tracking de descargas únicas
    user_agent TEXT, -- Para analytics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: VISUALIZACIONES DE GUÍAS
-- =====================================================
CREATE TABLE IF NOT EXISTS guide_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
    user_id UUID, -- Referencia al usuario (puede ser NULL para usuarios anónimos)
    ip_address INET, -- Para tracking de visualizaciones únicas
    user_agent TEXT, -- Para analytics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tool_categories_updated_at BEFORE UPDATE ON tool_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_categories_updated_at BEFORE UPDATE ON guide_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar el rating promedio de una herramienta
CREATE OR REPLACE FUNCTION update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tools 
    SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM tool_ratings 
        WHERE tool_id = NEW.tool_id
    )
    WHERE id = NEW.tool_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para actualizar el rating promedio de una guía
CREATE OR REPLACE FUNCTION update_guide_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE guides 
    SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM guide_ratings 
        WHERE guide_id = NEW.guide_id
    )
    WHERE id = NEW.guide_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar ratings automáticamente
CREATE TRIGGER update_tool_rating_trigger AFTER INSERT OR UPDATE OR DELETE ON tool_ratings
    FOR EACH ROW EXECUTE FUNCTION update_tool_rating();

CREATE TRIGGER update_guide_rating_trigger AFTER INSERT OR UPDATE OR DELETE ON guide_ratings
    FOR EACH ROW EXECUTE FUNCTION update_guide_rating();

-- Función para actualizar el contador de descargas
CREATE OR REPLACE FUNCTION update_tool_downloads_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tools 
    SET downloads = (
        SELECT COUNT(*)
        FROM tool_downloads 
        WHERE tool_id = NEW.tool_id
    )
    WHERE id = NEW.tool_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para actualizar el contador de visualizaciones
CREATE OR REPLACE FUNCTION update_guide_views_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE guides 
    SET views = (
        SELECT COUNT(*)
        FROM guide_views 
        WHERE guide_id = NEW.guide_id
    )
    WHERE id = NEW.guide_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar contadores automáticamente
CREATE TRIGGER update_tool_downloads_trigger AFTER INSERT OR DELETE ON tool_downloads
    FOR EACH ROW EXECUTE FUNCTION update_tool_downloads_count();

CREATE TRIGGER update_guide_views_trigger AFTER INSERT OR DELETE ON guide_views
    FOR EACH ROW EXECUTE FUNCTION update_guide_views_count();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar categorías de herramientas
INSERT INTO tool_categories (name, description, color, icon) VALUES
('IA & Machine Learning', 'Herramientas de inteligencia artificial y machine learning', '#8B5CF6', 'brain'),
('Desarrollo', 'Herramientas para desarrollo de software', '#3B82F6', 'code'),
('Diseño & Multimedia', 'Herramientas de diseño gráfico y multimedia', '#EF4444', 'palette'),
('Backend & Base de Datos', 'Herramientas para backend y gestión de datos', '#10B981', 'database'),
('Frontend & UI', 'Herramientas para desarrollo frontend', '#F59E0B', 'layout'),
('DevOps & Deployment', 'Herramientas para CI/CD y deployment', '#6B7280', 'server');

-- Insertar categorías de guías
INSERT INTO guide_categories (name, description, color, icon) VALUES
('Configuración', 'Guías de configuración del entorno de desarrollo', '#3B82F6', 'settings'),
('Desarrollo Web', 'Tutoriales de desarrollo web y aplicaciones', '#10B981', 'globe'),
('Backend', 'Guías de desarrollo backend y APIs', '#8B5CF6', 'server'),
('IA & Machine Learning', 'Tutoriales de inteligencia artificial', '#EF4444', 'brain'),
('Diseño & UX', 'Guías de diseño de interfaces y experiencia de usuario', '#F59E0B', 'eye'),
('DevOps', 'Tutoriales de deployment y operaciones', '#6B7280', 'cloud');

-- Insertar herramientas de ejemplo
INSERT INTO tools (name, description, category_id, link, tags, rating, downloads, is_free, price) VALUES
('ChatGPT API', 'Integración con GPT-4 para generación de texto y código', 
 (SELECT id FROM tool_categories WHERE name = 'IA & Machine Learning'),
 'https://openai.com/api', ARRAY['API', 'IA', 'Texto', 'Código'], 4.8, 1250, false, '$0.002/1K tokens'),

('GitHub Copilot', 'Asistente de código impulsado por IA que sugiere código en tiempo real',
 (SELECT id FROM tool_categories WHERE name = 'Desarrollo'),
 'https://github.com/features/copilot', ARRAY['IA', 'Código', 'Productividad', 'IDE'], 4.6, 8900, false, '$10/mes'),

('Midjourney', 'Generación de imágenes con IA de alta calidad',
 (SELECT id FROM tool_categories WHERE name = 'Diseño & Multimedia'),
 'https://midjourney.com', ARRAY['IA', 'Imágenes', 'Diseño', 'Creatividad'], 4.9, 3200, false, '$10/mes'),

('Supabase', 'Alternativa open source a Firebase con base de datos PostgreSQL',
 (SELECT id FROM tool_categories WHERE name = 'Backend & Base de Datos'),
 'https://supabase.com', ARRAY['Base de Datos', 'Backend', 'Auth', 'Open Source'], 4.7, 5600, true, 'Gratis');

-- Insertar guías de ejemplo
INSERT INTO guides (title, description, category_id, duration, difficulty, author, tags, rating, views, is_premium) VALUES
('Configuración del Entorno de Desarrollo', 'Guía completa para configurar tu entorno de desarrollo en 5 minutos',
 (SELECT id FROM guide_categories WHERE name = 'Configuración'),
 '5 min', 'Fácil', 'Equipo VibeHack', ARRAY['Setup', 'Entorno', 'Principiantes'], 4.9, 2100, false),

('Primera API con Next.js y TypeScript', 'Crea tu primera API REST con Next.js y TypeScript paso a paso',
 (SELECT id FROM guide_categories WHERE name = 'Desarrollo Web'),
 '15 min', 'Intermedio', 'María García', ARRAY['Next.js', 'TypeScript', 'API', 'Backend'], 4.8, 1800, false),

('Integración con Supabase para Autenticación', 'Conecta tu app con Supabase para autenticación y base de datos',
 (SELECT id FROM guide_categories WHERE name = 'Backend'),
 '20 min', 'Intermedio', 'Carlos Rodríguez', ARRAY['Supabase', 'Auth', 'Base de Datos', 'Backend'], 4.7, 1500, false),

('Creando un Chatbot con IA en 30 minutos', 'Tutorial avanzado para crear un chatbot funcional usando APIs de IA',
 (SELECT id FROM guide_categories WHERE name = 'IA & Machine Learning'),
 '30 min', 'Avanzado', 'Ana Martínez', ARRAY['IA', 'Chatbot', 'API', 'Avanzado'], 4.9, 950, true);

-- =====================================================
-- ÍNDICES PARA OPTIMIZAR BÚSQUEDAS
-- =====================================================

-- Índices para herramientas
CREATE INDEX idx_tools_name ON tools USING gin(to_tsvector('spanish', name));
CREATE INDEX idx_tools_description ON tools USING gin(to_tsvector('spanish', description));
CREATE INDEX idx_tools_tags ON tools USING gin(tags);
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_featured ON tools(featured);
CREATE INDEX idx_tools_rating ON tools(rating DESC);
CREATE INDEX idx_tools_downloads ON tools(downloads DESC);

-- Índices para guías
CREATE INDEX idx_guides_title ON guides USING gin(to_tsvector('spanish', title));
CREATE INDEX idx_guides_description ON guides USING gin(to_tsvector('spanish', description));
CREATE INDEX idx_guides_tags ON guides USING gin(tags);
CREATE INDEX idx_guides_category ON guides(category_id);
CREATE INDEX idx_guides_status ON guides(status);
CREATE INDEX idx_guides_featured ON guides(featured);
CREATE INDEX idx_guides_rating ON guides(rating DESC);
CREATE INDEX idx_guides_views ON guides(views DESC);
CREATE INDEX idx_guides_difficulty ON guides(difficulty);

-- Índices para valoraciones
CREATE INDEX idx_tool_ratings_tool ON tool_ratings(tool_id);
CREATE INDEX idx_tool_ratings_user ON tool_ratings(user_id);
CREATE INDEX idx_guide_ratings_guide ON guide_ratings(guide_id);
CREATE INDEX idx_guide_ratings_user ON guide_ratings(user_id);

-- =====================================================
-- POLÍTICAS RLS (Row Level Security) - OPCIONAL
-- =====================================================

-- Habilitar RLS en las tablas principales
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_categories ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública de herramientas activas
CREATE POLICY "Tools are viewable by everyone" ON tools
    FOR SELECT USING (status = 'active');

-- Política para permitir lectura pública de guías activas
CREATE POLICY "Guides are viewable by everyone" ON guides
    FOR SELECT USING (status = 'active');

-- Política para permitir lectura pública de categorías
CREATE POLICY "Categories are viewable by everyone" ON tool_categories
    FOR SELECT USING (true);

CREATE POLICY "Guide categories are viewable by everyone" ON guide_categories
    FOR SELECT USING (true);

-- =====================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE tools IS 'Catálogo de herramientas y software para desarrolladores';
COMMENT ON TABLE guides IS 'Tutoriales y guías de aprendizaje para desarrolladores';
COMMENT ON TABLE tool_categories IS 'Categorías para organizar las herramientas';
COMMENT ON TABLE guide_categories IS 'Categorías para organizar las guías';
COMMENT ON TABLE tool_ratings IS 'Valoraciones de los usuarios para las herramientas';
COMMENT ON TABLE guide_ratings IS 'Valoraciones de los usuarios para las guías';
COMMENT ON TABLE tool_downloads IS 'Registro de descargas de herramientas';
COMMENT ON TABLE guide_views IS 'Registro de visualizaciones de guías';

COMMENT ON COLUMN tools.tags IS 'Array de tags para facilitar la búsqueda y categorización';
COMMENT ON COLUMN guides.tags IS 'Array de tags para facilitar la búsqueda y categorización';
COMMENT ON COLUMN tools.rating IS 'Rating promedio de 0.0 a 5.0';
COMMENT ON COLUMN guides.rating IS 'Rating promedio de 0.0 a 5.0';
COMMENT ON COLUMN tools.status IS 'Estado de la herramienta: active, inactive, pending';
COMMENT ON COLUMN guides.status IS 'Estado de la guía: active, inactive, draft'; 