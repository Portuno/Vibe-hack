-- Diagnóstico y solución para el creator_id específico que no aparece
-- Creator ID problemático: f2317142-17c1-4b12-817a-853b03645398

-- 1. Verificar si este creator_id tiene perfil profesional
SELECT 
    'VERIFICACIÓN PERFIL ESPECÍFICO' as tipo,
    user_id,
    name,
    display_name,
    avatar_url,
    is_public,
    created_at
FROM professional_profiles 
WHERE user_id = 'f2317142-17c1-4b12-817a-853b03645398';

-- 2. Verificar todos los recursos de este creator_id
SELECT 
    'RECURSOS DE ESTE CREATOR' as tipo,
    id,
    name,
    creator_id,
    status,
    created_at
FROM resources 
WHERE creator_id = 'f2317142-17c1-4b12-817a-853b03645398';

-- 3. Verificar si este user_id existe en auth.users (tabla de autenticación)
SELECT 
    'VERIFICACIÓN AUTH.USERS' as tipo,
    id,
    email,
    created_at
FROM auth.users 
WHERE id = 'f2317142-17c1-4b12-817a-853b03645398';

-- 4. Crear perfil profesional básico para este creator_id si no existe
INSERT INTO professional_profiles (
    user_id, 
    name, 
    display_name, 
    bio, 
    is_public,
    created_at
)
SELECT 
    'f2317142-17c1-4b12-817a-853b03645398',
    'Usuario Terreta',
    'Usuario Terreta',
    'Miembro de la comunidad Terreta Hub',
    true,
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM professional_profiles 
    WHERE user_id = 'f2317142-17c1-4b12-817a-853b03645398'
);

-- 5. Verificar que el perfil se creó correctamente
SELECT 
    'VERIFICACIÓN FINAL' as tipo,
    user_id,
    name,
    display_name,
    avatar_url,
    is_public
FROM professional_profiles 
WHERE user_id = 'f2317142-17c1-4b12-817a-853b03645398';

-- 6. Crear perfiles para TODOS los creator_ids que no tengan perfil profesional
INSERT INTO professional_profiles (
    user_id, 
    name, 
    display_name, 
    bio, 
    is_public,
    created_at
)
SELECT DISTINCT 
    creator_id,
    'Usuario Terreta',
    'Usuario Terreta', 
    'Miembro de la comunidad Terreta Hub',
    true,
    NOW()
FROM (
    SELECT creator_id FROM projects WHERE creator_id IS NOT NULL AND creator_id != ''
    UNION
    SELECT creator_id FROM resources WHERE creator_id IS NOT NULL AND creator_id != ''
    UNION  
    SELECT creator_id FROM courses WHERE creator_id IS NOT NULL AND creator_id != ''
) all_creators
WHERE creator_id NOT IN (
    SELECT user_id FROM professional_profiles WHERE user_id IS NOT NULL
); 