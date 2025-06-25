import { useState, useEffect, useCallback } from 'react';
import { mabotClient, type MabotBot, type UpdateOutput, type MabotMessage } from '@/integrations/mabot/client';

interface UseMabotOptions {
  autoInitialize?: boolean;
  botUsername?: string;
}

interface UseMabotReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentBot: MabotBot | null;
  sendMessage: (message: string | MabotMessage) => Promise<UpdateOutput | null>;
  sendAudio: (audioFile: File) => Promise<UpdateOutput | null>;
  sendDocument: (documentFile: File) => Promise<UpdateOutput | null>;
  clearError: () => void;
  retryConnection: () => Promise<void>;
}

export const useMabot = (options: UseMabotOptions = {}): UseMabotReturn => {
  const { autoInitialize = true, botUsername = 'chipi' } = options;
  
  // 🚧 TEMPORAL: Deshabilitar Mabot mientras se diagnostica el error 500
  const MABOT_DISABLED = false;
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBot, setCurrentBot] = useState<MabotBot | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  // Generate unique chat ID for the session (UUID format required by Mabot)
  const generateChatId = useCallback(() => {
    // Generate a valid UUID v4
    const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setChatId(id);
    localStorage.setItem('mabot_chat_id', id);
    console.log('🆔 UUID generado para chat:', id);
    return id;
  }, []);

  // Initialize chat ID
  useEffect(() => {
    const existingChatId = localStorage.getItem('mabot_chat_id');
    
    // Check if existing chat_id is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (existingChatId && uuidRegex.test(existingChatId)) {
      console.log('🔄 Usando chat_id existente válido:', existingChatId);
      setChatId(existingChatId);
    } else {
      console.log('🧹 Limpiando chat_id inválido y generando nuevo UUID');
      if (existingChatId) {
        localStorage.removeItem('mabot_chat_id');
      }
      generateChatId();
    }
  }, [generateChatId]);

  // Auto-login function using server credentials via Supabase Edge Function
  const autoLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🤖 Iniciando auto-login de Chipi...');
      
      // First check server configuration
      const serverOk = await mabotClient.checkServerConfiguration();
      console.log('🛠️ Configuración del servidor:', serverOk ? '✅ OK' : '❌ Error');
      
      if (!serverOk) {
        throw new Error('El servidor no está configurado correctamente. Verifica las variables de entorno MABOT_EMAIL y MABOT_PASSWORD.');
      }
      
      // Use the secure server-side authentication
      await mabotClient.loginWithServerCredentials();
      setIsAuthenticated(true);
      
      console.log('🎯 Autenticación exitosa, cargando bot...');
      
      // Load bot after successful login
      await loadBot();
    } catch (err: any) {
      console.error('💥 Auto-login error:', err);
      const errorMessage = err.message || 'Error desconocido al conectar con Chipi';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize on mount
  useEffect(() => {
    if (MABOT_DISABLED) {
      console.log('🚧 Mabot temporalmente deshabilitado - usando modo legacy');
      setIsAuthenticated(false);
      setError('Chipi está en modo básico temporalmente');
      return;
    }
    
    if (autoInitialize) {
      const hasTokens = mabotClient.initializeFromStorage();
      if (hasTokens) {
        setIsAuthenticated(true);
        loadBot();
      } else {
        // Try auto-login with server credentials
        autoLogin();
      }
    }
  }, [autoInitialize, botUsername]);

  const loadBot = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Cargando bots disponibles...');
      
      const bots = await mabotClient.getBots();
      console.log('📋 Bots encontrados:', bots.length);
      
      const bot = bots.find(b => b.username === botUsername);
      
      if (bot) {
        console.log('🎯 Bot encontrado:', bot.name);
        setCurrentBot(bot);
      } else {
        console.log('🔨 Bot no encontrado, creando nuevo...');
        // If bot doesn't exist, create it
        await createChipiBot();
      }
    } catch (err: any) {
      console.error('💥 Error loading bot:', err);
      setError(`Error al cargar el bot: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [botUsername]);

  const createChipiBot = async () => {
    try {
      setIsLoading(true);
      
      // Create the bot
      const newBot = await mabotClient.createBot({
        name: 'Chipi',
        username: 'chipi',
        description: 'Asistente virtual de Terreta Hub que ayuda a la comunidad de emprendedores y profesionales de Valencia.',
        instructions: `Eres Chipi, el asistente virtual de Terreta Hub. Tu personalidad es amigable, servicial y con un toque valenciano. 

Tus responsabilidades principales son:
- Ayudar a los usuarios a navegar por la plataforma Terreta Hub
- Conectar profesionales y emprendedores
- Proporcionar información sobre proyectos, eventos y recursos
- Resolver dudas sobre la comunidad valenciana de innovación
- Mantener un tono cercano y profesional

Siempre termina tus respuestas con "¡Pío pío!" para mantener tu identidad de mascota.

Información sobre Terreta Hub:
- Es una plataforma que conecta a la comunidad de emprendedores y profesionales de Valencia
- Permite compartir proyectos, encontrar talento y acceder a recursos
- Organiza eventos y cursos para la comunidad
- Facilita el networking entre profesionales de diferentes sectores`,
        private: false,
      });

      // Add input modalities: text, audio, document
      await mabotClient.addInputModality('chipi', 'text');
      await mabotClient.addInputModality('chipi', 'audio');
      await mabotClient.addInputModality('chipi', 'document');

      // Add output modality: text
      await mabotClient.addOutputModality('chipi', 'text');

      // Deploy the bot
      await mabotClient.deployBot(newBot.id);

      setCurrentBot(newBot);
    } catch (err) {
      console.error('Error creating Chipi bot:', err);
      setError('Error al crear el bot Chipi');
    } finally {
      setIsLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:type/subtype;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const sendMessage = async (message: string | MabotMessage): Promise<UpdateOutput | null> => {
    if (!isAuthenticated || !currentBot) {
      setError('Chipi no está disponible en este momento');
      return null;
    }

    if (!chatId) {
      setError('Error: No se pudo establecer la conversación');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const mabotMessage = typeof message === 'string' 
        ? mabotClient.createTextMessage(message)
        : message;

      console.log('📤 Enviando mensaje a Mabot:', {
        platform: 'web',
        chat_id: chatId,
        bot_username: botUsername,
        message: typeof message === 'string' ? message : 'archivo/audio'
      });

      const input = {
        platform: 'web' as const,
        chat_id: chatId,
        messages: [mabotMessage],
        bot_username: botUsername,
        prefix_with_bot_name: false,
      };

      const response = await mabotClient.sendMessage(input);
      console.log('📨 Respuesta recibida:', response);
      
      return response;
    } catch (err: any) {
      console.error('Error sending message:', err);
      
      // Si es error 422, mostrar más detalles
      if (err.response?.status === 422) {
        console.error('💥 Error 422 - Datos inválidos:', {
          status: err.response.status,
          data: err.response.data,
          config: err.config
        });
        setError(`Error de validación: ${err.response?.data?.detail || 'Datos inválidos'}`);
      } else {
        setError('Error al enviar mensaje a Chipi');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const sendAudio = async (audioFile: File): Promise<UpdateOutput | null> => {
    if (!isAuthenticated || !currentBot) {
      setError('Chipi no está disponible en este momento');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const base64Audio = await convertFileToBase64(audioFile);
      const audioMessage = mabotClient.createAudioMessage(
        base64Audio,
        audioFile.name,
        audioFile.type,
        true // Parse to text
      );

      return await sendMessage(audioMessage);
    } catch (err: any) {
      console.error('Error sending audio:', err);
      setError('Error al enviar audio a Chipi');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const sendDocument = async (documentFile: File): Promise<UpdateOutput | null> => {
    if (!isAuthenticated || !currentBot) {
      setError('Chipi no está disponible en este momento');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const base64Document = await convertFileToBase64(documentFile);
      const documentMessage = mabotClient.createDocumentMessage(
        base64Document,
        documentFile.name,
        documentFile.type
      );

      return await sendMessage(documentMessage);
    } catch (err: any) {
      console.error('Error sending document:', err);
      setError('Error al enviar documento a Chipi');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const retryConnection = async () => {
    await autoLogin();
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    currentBot,
    sendMessage,
    sendAudio,
    sendDocument,
    clearError,
    retryConnection,
  };
}; 