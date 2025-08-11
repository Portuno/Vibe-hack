-- Crear la tabla de contactos
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  reason VARCHAR(100) NOT NULL CHECK (reason IN ('sponsorship', 'mentoria', 'consultas', 'otro')),
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'en_revision', 'respondido', 'cerrado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_reason ON contacts(reason);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción pública (cualquiera puede crear contactos)
CREATE POLICY "Allow public insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

-- Política para permitir lectura solo a administradores
CREATE POLICY "Allow admin read contacts" ON contacts
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    auth.email() IN (
      SELECT email FROM auth.users WHERE role = 'service_role'
    )
  );

-- Política para permitir actualización solo a administradores
CREATE POLICY "Allow admin update contacts" ON contacts
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    auth.email() IN (
      SELECT email FROM auth.users WHERE role = 'service_role'
    )
  );

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();

-- Insertar algunos contactos de ejemplo (opcional)
-- INSERT INTO contacts (name, email, phone, reason, description) VALUES
--   ('Juan Pérez', 'juan@ejemplo.com', '+34 600 000 001', 'sponsorship', 'Me interesa ser sponsor del evento. ¿Podrían enviarme más información sobre los paquetes disponibles?'),
--   ('María García', 'maria@ejemplo.com', '+34 600 000 002', 'mentoria', 'Soy desarrolladora senior y me gustaría participar como mentora. ¿Qué necesito hacer?'),
--   ('Carlos López', 'carlos@ejemplo.com', '+34 600 000 003', 'consultas', 'Tengo una sugerencia para mejorar la experiencia de los participantes.');

-- Comentarios sobre la estructura:
-- Esta tabla almacena todos los contactos recibidos a través del formulario:
-- 
-- - id: Identificador único UUID
-- - name: Nombre completo del contacto
-- - email: Email de contacto (requerido)
-- - phone: Teléfono (opcional)
-- - reason: Motivo del contacto (sponsorship, mentoría, consultas, otro)
-- - description: Descripción detallada del mensaje
-- - status: Estado del contacto (nuevo, en_revision, respondido, cerrado)
-- - created_at: Fecha de creación
-- - updated_at: Fecha de última actualización
-- 
-- Seguridad:
-- - Solo administradores pueden leer/editar contactos
-- - Cualquiera puede crear nuevos contactos
-- - RLS habilitado para control granular
-- 
-- Para usar esta tabla:
-- 1. Ejecuta este SQL en tu proyecto de Supabase
-- 2. Configura las variables de entorno en tu app
-- 3. Usa el hook useContacts para interactuar con la tabla 