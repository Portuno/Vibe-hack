-- Configurar políticas de acceso para la tabla hackathon_registrations
-- Esto permitirá que la clave anónima pueda leer los registros

-- 1. Habilitar RLS (Row Level Security) si no está habilitado
ALTER TABLE hackathon_registrations ENABLE ROW LEVEL SECURITY;

-- 2. Crear política para permitir lectura pública (solo para contar registros)
CREATE POLICY "Allow public read access for counting" ON hackathon_registrations
    FOR SELECT
    USING (true);

-- 3. Crear política para permitir inserción de nuevos registros
CREATE POLICY "Allow public insert for registrations" ON hackathon_registrations
    FOR INSERT
    WITH CHECK (true);

-- 4. Crear política para permitir actualización de registros existentes
CREATE POLICY "Allow public update for registrations" ON hackathon_registrations
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 5. Verificar que las políticas se crearon correctamente
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename = 'hackathon_registrations';

-- 6. Verificar permisos del usuario anónimo
-- SELECT grantee, table_name, privilege_type 
-- FROM information_schema.role_table_grants 
-- WHERE table_name = 'hackathon_registrations' 
-- AND grantee = 'anon'; 