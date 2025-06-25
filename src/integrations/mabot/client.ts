import axios, { AxiosInstance } from 'axios';
import { supabase } from '@/integrations/supabase/client';

// Types based on Mabot API schema
export interface MabotAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface MabotBot {
  id: string;
  name: string;
  username: string;
  description?: string;
  instructions?: string;
  input_modalities: Modality[];
  output_modalities: Modality[];
  private: boolean;
}

export interface Modality {
  id: string;
  name: string;
  description?: string;
}

export interface TextContent {
  type: 'text';
  value: string;
}

export interface AudioContent {
  type: 'audio';
  value: string;
  filename: string;
  mimetype: string;
  parse_to_text?: boolean;
  parsed_text?: string;
}

export interface DocumentContent {
  type: 'document';
  value: string;
  filename: string;
  mimetype: string;
}

export type MessageContent = TextContent | AudioContent | DocumentContent;

export interface MabotMessage {
  role: 'user' | 'assistant' | 'system' | 'developer' | 'tool' | 'function';
  contents: MessageContent[];
  reply_to_message?: MabotMessage;
}

export interface UpdateInput {
  platform: 'web' | 'whatsapp' | 'telegram';
  chat_id?: string;
  platform_chat_id?: string;
  messages: MabotMessage[];
  bot_username: string;
  prefix_with_bot_name?: boolean;
}

export interface UpdateOutput {
  chat_id: string;
  platform_chat_id?: string;
  messages: MabotMessage[];
}

class MabotClient {
  private api: AxiosInstance;
  private accessToken?: string;
  private refreshToken?: string;

  constructor(baseURL: string = import.meta.env.VITE_MABOT_API_URL || 'https://back.mapeima.space:8443') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAccessToken();
            // Retry the original request
            error.config.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.api.request(error.config);
          } catch (refreshError) {
            // Refresh failed, redirect to login or handle accordingly
            this.clearTokens();
            throw refreshError;
          }
        }
        throw error;
      }
    );
  }

  // Secure authentication through Supabase Edge Function
  async loginWithServerCredentials(): Promise<MabotAuthResponse> {
    try {
      console.log('🔐 Iniciando autenticación con servidor...');
      
      const { data, error } = await supabase.functions.invoke('mabot-auth', {
        body: { action: 'login' }
      });

      console.log('📡 Respuesta del servidor:', { data, error });

      if (error) {
        console.error('❌ Error en la función:', error);
        throw new Error(error.message || 'Error en la función de autenticación');
      }

      if (!data) {
        console.error('❌ No se recibieron datos del servidor');
        throw new Error('No se recibieron datos del servidor');
      }

      if (!data.success) {
        console.error('❌ Error de autenticación:', data.error);
        throw new Error(data.error || 'Error de autenticación');
      }

      if (!data.access_token || !data.refresh_token) {
        console.error('❌ Tokens faltantes en la respuesta:', data);
        throw new Error('Tokens de acceso no recibidos');
      }

      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      
      // Store tokens in localStorage
      localStorage.setItem('mabot_access_token', this.accessToken);
      localStorage.setItem('mabot_refresh_token', this.refreshToken);

      console.log('✅ Autenticación exitosa');

      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: 'Bearer'
      };
    } catch (error: any) {
      console.error('💥 Server login error:', error);
      throw new Error(`Error de autenticación del servidor: ${error.message}`);
    }
  }

  // Legacy login method (removed - now uses server credentials only)
  async login(email: string, password: string): Promise<MabotAuthResponse> {
    // Redirect to server-based login
    return this.loginWithServerCredentials();
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.api.post('/auth/register', {
      name,
      email,
      password,
    });
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const { data, error } = await supabase.functions.invoke('mabot-auth', {
        body: { 
          action: 'refresh',
          refresh_token: this.refreshToken
        }
      });

      if (error) {
        throw new Error(error.message || 'Error al renovar token');
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al renovar token');
      }

      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      
      // Update tokens in localStorage
      localStorage.setItem('mabot_access_token', this.accessToken);
      localStorage.setItem('mabot_refresh_token', this.refreshToken);
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw new Error(`Error al renovar token: ${error.message}`);
    }
  }

  // Initialize tokens from localStorage
  initializeFromStorage(): boolean {
    const accessToken = localStorage.getItem('mabot_access_token');
    const refreshToken = localStorage.getItem('mabot_refresh_token');

    if (accessToken && refreshToken) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      return true;
    }
    return false;
  }

  clearTokens(): void {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    localStorage.removeItem('mabot_access_token');
    localStorage.removeItem('mabot_refresh_token');
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Check server configuration
  async checkServerConfiguration(): Promise<boolean> {
    try {
      console.log('🔍 Verificando configuración del servidor...');
      
      const { data, error } = await supabase.functions.invoke('mabot-auth', {
        body: { action: 'check' }
      });

      console.log('📊 Resultado de verificación:', { data, error });

      if (error) {
        console.error('❌ Error en verificación:', error);
        return false;
      }

      if (!data || !data.success) {
        console.error('❌ Servidor no configurado correctamente:', data);
        return false;
      }

      console.log('✅ Servidor configurado correctamente');
      console.log('🔑 Tiene credenciales:', data.has_credentials ? '✅ Sí' : '❌ No');
      
      return data.success && data.has_credentials;
    } catch (error) {
      console.error('💥 Error verificando servidor:', error);
      return false;
    }
  }

  // Bot management methods
  async createBot(botData: {
    name: string;
    username: string;
    description?: string;
    instructions?: string;
    private?: boolean;
  }): Promise<MabotBot> {
    const response = await this.api.post<MabotBot>('/bot', botData);
    return response.data;
  }

  async getBots(): Promise<MabotBot[]> {
    const response = await this.api.get<MabotBot[]>('/bot');
    return response.data;
  }

  async getBot(botId: string): Promise<MabotBot> {
    const response = await this.api.get<MabotBot>(`/bot/${botId}`);
    return response.data;
  }

  async updateBot(botId: string, botData: {
    name: string;
    username: string;
    description?: string;
    instructions?: string;
    private?: boolean;
  }): Promise<MabotBot> {
    const response = await this.api.put<MabotBot>(`/bot/${botId}`, botData);
    return response.data;
  }

  async deleteBot(botId: string): Promise<void> {
    await this.api.delete(`/bot/${botId}`);
  }

  async deployBot(botId: string): Promise<any> {
    const response = await this.api.post(`/bot/${botId}/deploy`);
    return response.data;
  }

  // Modality management
  async getSupportedModalities(): Promise<Modality[]> {
    const response = await this.api.get<Modality[]>('/supported_modalities');
    return response.data;
  }

  async addInputModality(username: string, modalityName: string): Promise<void> {
    await this.api.post(`/bot/${username}/input_modality/${modalityName}`);
  }

  async removeInputModality(username: string, modalityName: string): Promise<void> {
    await this.api.delete(`/bot/${username}/input_modality/${modalityName}`);
  }

  async addOutputModality(username: string, modalityName: string): Promise<void> {
    await this.api.post(`/bot/${username}/output_modality/${modalityName}`);
  }

  async removeOutputModality(username: string, modalityName: string): Promise<void> {
    await this.api.delete(`/bot/${username}/output_modality/${modalityName}`);
  }

  // Chat methods
  async sendMessage(input: UpdateInput): Promise<UpdateOutput> {
    const response = await this.api.post<UpdateOutput>('/io/input', input);
    return response.data;
  }

  // Helper method to create a text message
  createTextMessage(text: string, role: 'user' | 'assistant' = 'user'): MabotMessage {
    return {
      role,
      contents: [{
        type: 'text',
        value: text,
      }],
    };
  }

  // Helper method to create an audio message
  createAudioMessage(
    audioBase64: string, 
    filename: string, 
    mimetype: string, 
    parseToText: boolean = true
  ): MabotMessage {
    return {
      role: 'user',
      contents: [{
        type: 'audio',
        value: audioBase64,
        filename,
        mimetype,
        parse_to_text: parseToText,
      }],
    };
  }

  // Helper method to create a document message
  createDocumentMessage(
    documentBase64: string, 
    filename: string, 
    mimetype: string
  ): MabotMessage {
    return {
      role: 'user',
      contents: [{
        type: 'document',
        value: documentBase64,
        filename,
        mimetype,
      }],
    };
  }
}

// Create a singleton instance
export const mabotClient = new MabotClient(
  import.meta.env.VITE_MABOT_API_URL || 'https://back.mapeima.space:8443'
);

export default MabotClient; 