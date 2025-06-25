# Solución CORS para función Edge mabot-auth

## Problema
La aplicación está mostrando errores CORS al intentar acceder a la función Edge `mabot-auth` desde `terretahub.com`:

```
Access to fetch at 'https://itchfpnqnbxnqxgizjai.supabase.co/functions/v1/mabot-auth' 
from origin 'https://terretahub.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Soluciones Implementadas

### 1. ✅ Función Edge actualizada
La función `mabot-auth` ha sido actualizada con:
- Soporte para múltiples dominios permitidos
- Headers CORS más completos
- Manejo dinámico del origen de las solicitudes

### 2. 📋 Configuración de Supabase (ACCIÓN REQUERIDA)
Debes configurar CORS en el dashboard de Supabase:

#### Pasos para configurar CORS:
1. Ve a tu [dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings > API**
4. Busca la sección **"CORS" o "API Settings"**
5. Agrega estos orígenes permitidos:
   - `https://terretahub.com`
   - `http://localhost:5173` (para desarrollo)
   - `http://localhost:3000` (para desarrollo)

#### Configuración alternativa:
Si no encuentras la sección CORS en Settings > API, revisa:
- **Settings > Edge Functions** (si hay configuración específica para funciones)
- **Project Settings > General** (configuración de dominio)

### 3. 🔧 Desplegar la función actualizada

Después de configurar CORS en Supabase, despliega la función actualizada:

```bash
# Desde la carpeta raíz del proyecto
supabase functions deploy mabot-auth
```

## Verificación

Una vez aplicados los cambios:

1. **Verifica la configuración**: El error CORS debería desaparecer
2. **Prueba en desarrollo**: La función debería funcionar en localhost
3. **Prueba en producción**: La función debería funcionar en terretahub.com

## Dominios Configurados

La función ahora soporta estos orígenes:
- ✅ `https://terretahub.com` (producción)
- ✅ `http://localhost:5173` (desarrollo Vite)
- ✅ `http://localhost:3000` (desarrollo alternativo)
- ✅ `https://localhost:5173` (desarrollo HTTPS)
- ✅ `https://localhost:3000` (desarrollo HTTPS alternativo)

## Headers CORS Incluidos

- `Access-Control-Allow-Origin`: Dinámico basado en el origen
- `Access-Control-Allow-Headers`: Todos los headers necesarios de Supabase
- `Access-Control-Allow-Methods`: GET, POST, OPTIONS
- `Access-Control-Allow-Credentials`: true
- `Access-Control-Max-Age`: 24 horas

## Notas Importantes

1. **Tiempo de propagación**: Los cambios en la configuración CORS pueden tardar unos minutos en aplicarse
2. **Caché del navegador**: Limpia la caché del navegador si sigues viendo errores
3. **Configuración de Supabase**: La configuración CORS en el dashboard es crítica, la función Edge por sí sola no es suficiente

## Troubleshooting

Si el error persiste:

1. **Verifica la configuración**: Asegúrate de que `terretahub.com` esté en la lista de orígenes permitidos
2. **Revisa los logs**: Comprueba los logs de la función Edge en el dashboard de Supabase
3. **Prueba en localhost**: Si funciona en desarrollo pero no en producción, es un problema de configuración CORS
4. **Contacta soporte**: Si nada funciona, contacta al soporte de Supabase con los detalles de tu configuración

## Archivos Modificados

- ✅ `supabase/functions/mabot-auth/index.ts` - Función Edge actualizada
- ✅ `supabase/002_cors_configuration.sql` - Documentación de configuración
- ✅ `supabase/CORS_SOLUTION_README.md` - Esta documentación 