-- Configuración de variables de entorno para la función mabot-auth
-- Ejecutar estos comandos en el Dashboard de Supabase > Project Settings > Edge Functions

-- IMPORTANTE: Reemplazar los valores de ejemplo con las credenciales reales de Mabot

-- 1. Configurar email de Mabot
-- Ir a Project Settings > Edge Functions > Environment Variables
-- Agregar: MABOT_EMAIL = "tu-email-de-mabot@example.com"

-- 2. Configurar password de Mabot  
-- Agregar: MABOT_PASSWORD = "tu-password-de-mabot"

-- Alternativamente, usar Supabase CLI:
-- supabase secrets set MABOT_EMAIL="tu-email-de-mabot@example.com"
-- supabase secrets set MABOT_PASSWORD="tu-password-de-mabot"

-- Verificar que las variables estén configuradas:
-- supabase secrets list 