// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface MabotAuthRequest {
  action: 'login' | 'refresh' | 'check';
  refresh_token?: string;
}

// Mabot API Types based on OpenAPI spec
interface MabotToken {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface RefreshTokenRequest {
  refresh_token: string;
}

serve(async (req) => {
  console.log(`🚀 Function started - ${req.method}`)
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS handled')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('📥 Reading request body...')
    const body: MabotAuthRequest = await req.json()
    console.log('📋 Body parsed:', JSON.stringify(body))
    
    const { action, refresh_token } = body
    console.log(`🎯 Action: ${action}`)
    
    // Check environment variables
    const email = Deno.env.get('MABOT_EMAIL')
    const password = Deno.env.get('MABOT_PASSWORD')
    
    console.log('🔐 Environment variables:')
    console.log(`- MABOT_EMAIL: ${email ? 'SET' : 'NOT SET'} (length: ${email?.length || 0})`)
    console.log(`- MABOT_PASSWORD: ${password ? 'SET' : 'NOT SET'} (length: ${password?.length || 0})`)
    
    if (action === 'check') {
      console.log('✅ Check action - returning success')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Function working',
          has_credentials: !!(email && password)
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }
    
    if (action === 'login') {
      console.log('🔐 Login action started')
      
      if (!email || !password) {
        console.error('❌ Missing credentials')
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Credentials not configured'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }
      
      console.log('🌐 Making request to Mabot API...')
      
      try {
        const formData = new FormData()
        formData.append('username', email)
        formData.append('password', password)
        
        console.log('📡 Sending FormData to back.mapeima.space:8443...')
        
        const response = await fetch('https://back.mapeima.space:8443/auth/login', {
          method: 'POST',
          body: formData
        })
        
        console.log(`📨 Mabot API responded: ${response.status} ${response.statusText}`)
        console.log(`📊 Response ok: ${response.ok}`)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`❌ Mabot API error: ${errorText.substring(0, 200)}`)
          
          return new Response(
            JSON.stringify({
              success: false,
              error: `Mabot API error: ${response.status}`
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          )
        }
        
        console.log('📦 Parsing Mabot response...')
        const data = await response.json()
        console.log('✅ Mabot response parsed successfully')
        console.log(`🔑 Has access_token: ${!!data.access_token}`)
        console.log(`🔄 Has refresh_token: ${!!data.refresh_token}`)
        
        return new Response(
          JSON.stringify({
            success: true,
            access_token: data.access_token,
            refresh_token: data.refresh_token
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
        
      } catch (fetchError: any) {
        console.error('💥 Fetch error:', fetchError.name, fetchError.message)
        
        return new Response(
          JSON.stringify({
            success: false,
            error: `Network error: ${fetchError.message}`
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        )
      }
    }

    if (action === 'refresh') {
      if (!refresh_token) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Refresh token requerido'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }

      console.log('🔄 Refreshing token...')
      
      try {
        const response = await fetch('https://back.mapeima.space:8443/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token })
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Refresh failed:', response.status)
          
          return new Response(
            JSON.stringify({
              success: false,
              error: `Error al renovar token: ${response.status}`
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          )
        }

        const data = await response.json()
        console.log('✅ Token refreshed successfully')
        
        return new Response(
          JSON.stringify({
            success: true,
            access_token: data.access_token,
            refresh_token: data.refresh_token
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
        
      } catch (refreshError: any) {
        console.error('💥 Refresh exception:', refreshError.message)
        
        return new Response(
          JSON.stringify({
            success: false,
            error: `Error de conexión al renovar: ${refreshError.message}`
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        )
      }
    }
    
    console.log(`❌ Unknown action: ${action}`)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unknown action'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
    
  } catch (error: any) {
    console.error('💥 Function error:', error.name, error.message)
    console.error('🔍 Stack trace:', error.stack?.substring(0, 500))
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Function error: ${error.message}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
}) 