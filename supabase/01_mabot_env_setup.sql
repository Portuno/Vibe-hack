-- Configuración de variables de entorno para Mabot Authentication
-- 
-- IMPORTANTE: Este archivo contiene las instrucciones para configurar
-- las variables de entorno necesarias para la función mabot-auth
-- 
-- EJECUTA ESTOS COMANDOS EN TU DASHBOARD DE SUPABASE:
-- 1. Ve a Settings > Edge Functions
-- 2. En la sección "Environment Variables", añade:

-- Variable 1:
-- Nombre: MABOT_EMAIL
-- Valor: tu_email_de_mabot@ejemplo.com
-- Scope: Selecciona la función 'mabot-auth' o déjalo global

-- Variable 2:
-- Nombre: MABOT_PASSWORD  
-- Valor: tu_contraseña_de_mabot
-- Scope: Selecciona la función 'mabot-auth' o déjalo global

-- También puedes configurar estas variables usando el CLI de Supabase:
-- supabase secrets set MABOT_EMAIL=tu_email_de_mabot@ejemplo.com
-- supabase secrets set MABOT_PASSWORD=tu_contraseña_de_mabot

-- Para verificar que las variables están configuradas correctamente,
-- puedes usar la acción 'check' en la función:
-- POST /functions/v1/mabot-auth
-- Body: {"action": "check"}

SELECT 'Variables de entorno configuradas para mabot-auth' as message; 