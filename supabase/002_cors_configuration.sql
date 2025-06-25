-- Configuración CORS para el proyecto Supabase
-- Este archivo debe ejecutarse manualmente en el dashboard de Supabase

-- Nota: La configuración CORS para funciones Edge se hace principalmente
-- a través del dashboard de Supabase en: 
-- Settings > API > CORS

-- Para configurar manualmente vía SQL (si está disponible):
-- UPDATE auth.config 
-- SET cors_allowed_origins = 'https://terretahub.com,http://localhost:5173,http://localhost:3000'
-- WHERE parameter = 'cors_allowed_origins';

-- Configuración recomendada para el dashboard:
-- Dominios permitidos para CORS:
-- - https://terretahub.com
-- - http://localhost:5173 (desarrollo)
-- - http://localhost:3000 (desarrollo)

-- Headers permitidos:
-- - authorization
-- - x-client-info
-- - apikey
-- - content-type
-- - x-requested-with
-- - accept
-- - origin
-- - referer
-- - user-agent

-- Métodos permitidos:
-- - GET
-- - POST
-- - OPTIONS
-- - PUT
-- - DELETE

-- INSTRUCCIONES PARA CONFIGURAR CORS EN SUPABASE:
-- 1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
-- 2. Selecciona tu proyecto
-- 3. Ve a Settings > API
-- 4. En la sección "CORS" o "API Settings", agrega:
--    - Origin: https://terretahub.com
--    - Origin: http://localhost:5173 (para desarrollo)
-- 5. Guarda los cambios y espera unos minutos para que se apliquen

-- También puedes verificar/configurar en Settings > Edge Functions
-- si hay una sección específica para CORS de funciones Edge 