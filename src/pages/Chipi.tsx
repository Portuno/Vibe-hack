import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ChipiInputPanel } from "@/components/ChipiInputPanel";
import { ChipiMessage } from "@/components/ChipiMessage";
import { useAuth } from "@/hooks/useAuth";
import { useMabot } from "@/hooks/useMabot";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { type MabotMessage, mabotClient } from "@/integrations/mabot/client";
import { cn } from "@/lib/utils";
import { Bot, AlertCircle } from "lucide-react";

interface LegacyMessage {
  from: "chipi" | "user";
  text: string;
}

export default function Chipi() {
  // Legacy messages for non-authenticated users
  const [legacyMessages, setLegacyMessages] = useState<LegacyMessage[]>([
    {
      from: "chipi",
      text: "¡Hola! Soy Chipi, tu asistente de Terreta Hub. ¿En qué puedo ayudarte hoy?",
    },
  ]);

  // Mabot messages for authenticated users
  const [mabotMessages, setMabotMessages] = useState<MabotMessage[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auth and navigation
  const { session } = useAuth();
  const navigate = useNavigate();

  // Mabot integration (now automatic)
  const {
    isAuthenticated: isMabotAuth,
    isLoading: isMabotLoading,
    error: mabotError,
    currentBot,
    sendMessage: sendMabotMessage,
    sendAudio: sendMabotAudio,
    sendDocument: sendMabotDocument,
    clearError: clearMabotError,
    retryConnection
  } = useMabot();

  // Track not-authenticated message flow (legacy)
  const [anonMessageCount, setAnonMessageCount] = useState(0);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [sentFinalPrompt, setSentFinalPrompt] = useState(false);

  const isAuthenticated = !!session;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [legacyMessages, mabotMessages]);

  // Show Mabot error as toast
  useEffect(() => {
    if (mabotError) {
      toast({
        title: "Error de Chipi",
        description: mabotError,
        variant: "destructive"
      });
      clearMabotError();
    }
  }, [mabotError, toast, clearMabotError]);

  // Initialize Mabot messages when authenticated
  useEffect(() => {
    if (isAuthenticated && isMabotAuth && mabotMessages.length === 0) {
      const welcomeMessage: MabotMessage = {
        role: "assistant",
        contents: [{
          type: "text",
          value: "¡Hola! Soy Chipi, tu asistente inteligente de Terreta Hub. Ahora puedo ayudarte con funciones avanzadas como audio y documentos. ¿En qué puedo ayudarte hoy? ¡Pío pío!"
        }]
      };
      setMabotMessages([welcomeMessage]);
    }
  }, [isAuthenticated, isMabotAuth, mabotMessages.length]);

  // On closing modal: if anonymous sends again, Chipi sends last message
  useEffect(() => {
    if (!registrationOpen && !isAuthenticated && anonMessageCount >= 3 && sentFinalPrompt === false) {
      setBlocked(true);
      setSentFinalPrompt(false);
    }
  }, [registrationOpen, isAuthenticated, anonMessageCount, sentFinalPrompt]);

  // Handle text message sending
  const handleSendText = async (text: string) => {
    if (!isAuthenticated) {
      // Legacy flow for non-authenticated users
      handleLegacySend(text);
      return;
    }

    // For authenticated users, always try to use Mabot
    if (!isMabotAuth) {
      // Show error and suggest retry
      toast({
        title: "Chipi no disponible",
        description: "Hay un problema con la conexión. Intenta de nuevo.",
        variant: "destructive"
      });
      return;
    }

    // Add user message to chat
    const userMessage: MabotMessage = mabotClient.createTextMessage(text);
    setMabotMessages(prev => [...prev, userMessage]);

    // Send to Mabot
    const response = await sendMabotMessage(text);
    if (response && response.messages.length > 0) {
      setMabotMessages(prev => [...prev, ...response.messages]);
    }
  };

  // Handle audio message sending
  const handleSendAudio = async (file: File) => {
    if (!isAuthenticated) {
      toast({
        title: "Función Premium",
        description: "Debes estar registrado para enviar audio.",
        variant: "destructive"
      });
      return;
    }

    if (!isMabotAuth) {
      toast({
        title: "Chipi no disponible",
        description: "Hay un problema con la conexión de IA.",
        variant: "destructive"
      });
      return;
    }

    // Add user audio message to chat (will be shown with transcription)
    const userMessage = mabotClient.createAudioMessage(
      await fileToBase64(file),
      file.name,
      file.type,
      true
    );
    setMabotMessages(prev => [...prev, userMessage]);

    // Send to Mabot
    const response = await sendMabotAudio(file);
    if (response && response.messages.length > 0) {
      setMabotMessages(prev => [...prev, ...response.messages]);
    }
  };

  // Handle document message sending
  const handleSendDocument = async (file: File) => {
    if (!isAuthenticated) {
      toast({
        title: "Función Premium",
        description: "Debes estar registrado para enviar documentos.",
        variant: "destructive"
      });
      return;
    }

    if (!isMabotAuth) {
      toast({
        title: "Chipi no disponible",
        description: "Hay un problema con la conexión de IA.",
        variant: "destructive"
      });
      return;
    }

    // Add user document message to chat
    const userMessage = mabotClient.createDocumentMessage(
      await fileToBase64(file),
      file.name,
      file.type
    );
    setMabotMessages(prev => [...prev, userMessage]);

    // Send to Mabot
    const response = await sendMabotDocument(file);
    if (response && response.messages.length > 0) {
      setMabotMessages(prev => [...prev, ...response.messages]);
    }
  };

  // Legacy message handling for non-authenticated users
  const handleLegacySend = (text: string) => {
    if (blocked && !sentFinalPrompt) {
      setLegacyMessages((prev) => [
        ...prev,
        { from: "chipi", text: "chip chip chip (regístrate)" },
      ]);
      setSentFinalPrompt(true);
      return;
    }
    if (blocked && sentFinalPrompt) {
      return;
    }

    setLegacyMessages((prev) => [...prev, { from: "user", text }]);

    if (anonMessageCount < 2) {
      setAnonMessageCount((n) => n + 1);
      setTimeout(() => {
        setLegacyMessages((prev) => [
          ...prev,
          {
            from: "chipi",
            text: "¡Gracias por tu mensaje! Pío pío… Estoy en la Terreta investigando tu consulta 🕵️‍♂️. Para funciones avanzadas como IA, audio y documentos, regístrate en Terreta Hub.",
          },
        ]);
      }, 1000);
    } else if (anonMessageCount === 2) {
      setAnonMessageCount((n) => n + 1);
      setRegistrationOpen(true);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRegisterRedirect = () => {
    setRegistrationOpen(false);
    navigate("/auth");
  };

  // Determine which messages to show
  const isUsingMabot = isAuthenticated && isMabotAuth;

  return (
    <div className="flex flex-col h-screen bg-crema">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full max-w-full py-0 sm:py-6 px-2 sm:px-0 bg-crema">
        <div className="w-full max-w-xl flex flex-col h-full">
          {/* Header de Chipi */}
          <div className="flex flex-col items-center justify-center pt-6 pb-3 gap-2 animate-fade-in-up">
            <img
              src="/lovable-uploads/cd8f5122-d206-49ff-bf94-0fc1da28a181.png"
              alt="Chipi profile"
              className="rounded-full w-20 h-20 border-4 border-terra-cotta shadow-lg bg-white object-cover"
              style={{ background: '#fff' }}
            />
            <div className="font-display font-bold text-terra-cotta text-2xl">Chipi</div>
            <p className="text-mediterraneo text-sm mb-1 text-center px-1">
              {isUsingMabot ? "Asistente IA Avanzado" : "Chatbot de Terreta Hub"}
            </p>
            
            {/* Status indicators */}
            {isAuthenticated && (
              <div className="flex items-center gap-1">
                {isMabotAuth ? (
                  <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                    <Bot className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">IA Conectada</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                    <span className="text-xs text-yellow-700 font-medium">IA Desconectada</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 px-1 text-xs text-yellow-700 hover:text-yellow-800"
                      onClick={retryConnection}
                    >
                      Reintentar
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <div className="w-[70%] h-[2px] bg-arena mb-2 rounded" />
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto pr-0 sm:pr-2 space-y-4 pb-2">
            {isUsingMabot ? (
              // Mabot messages
              mabotMessages.map((message, index) => (
                <ChipiMessage
                  key={index}
                  message={message}
                  isChipi={message.role === "assistant"}
                />
              ))
            ) : (
              // Legacy messages
              legacyMessages.map((message, index) => (
                <div
                  key={index}
                  className={cn("flex w-full", {
                    "justify-end": message.from === "user",
                    "justify-start": message.from === "chipi",
                  })}
                >
                  {message.from === "chipi" ? (
                    <div className="flex items-end gap-2">
                      <img
                        src="/lovable-uploads/cd8f5122-d206-49ff-bf94-0fc1da28a181.png"
                        alt="Chipi"
                        className="w-12 h-12 rounded-full border-2 border-terra-cotta shadow bg-white object-cover"
                        style={{ background: '#fff' }}
                      />
                      <div className="bg-white text-negro-suave px-4 py-3 rounded-2xl rounded-tl-sm shadow-card max-w-xs sm:max-w-sm text-sm">
                        <span className="block whitespace-pre-line">{message.text}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2 flex-row-reverse">
                      <div className="bg-terra-cotta text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-card max-w-xs sm:max-w-sm text-sm text-right">
                        <span className="block whitespace-pre-line">{message.text}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isMabotLoading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <img
                    src="/lovable-uploads/cd8f5122-d206-49ff-bf94-0fc1da28a181.png"
                    alt="Chipi"
                    className="w-12 h-12 rounded-full border-2 border-terra-cotta shadow bg-white object-cover"
                  />
                  <div className="bg-white text-negro-suave px-4 py-3 rounded-2xl rounded-tl-sm shadow-card">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-terra-cotta border-t-transparent rounded-full" />
                      <span className="text-sm">Chipi está pensando...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          {isUsingMabot ? (
            <ChipiInputPanel
              onSendText={handleSendText}
              onSendAudio={handleSendAudio}
              onSendDocument={handleSendDocument}
              disabled={blocked && sentFinalPrompt && !isAuthenticated}
              isLoading={isMabotLoading}
            />
          ) : (
            // Legacy input for non-authenticated users
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const text = formData.get('message') as string;
                if (text?.trim()) {
                  handleSendText(text.trim());
                  (e.target as HTMLFormElement).reset();
                }
              }}
              className="mt-2 flex items-center gap-2 p-2 bg-crema rounded-b-2xl"
            >
              <Input
                name="message"
                placeholder="Escribe tu mensaje…"
                className="flex-1 py-3 bg-arena"
                disabled={blocked && sentFinalPrompt && !isAuthenticated}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-terra-cotta hover:bg-terra-cotta/90"
                disabled={blocked && sentFinalPrompt && !isAuthenticated}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </form>
          )}
        </div>
      </main>

      {/* Modal de registro para usuarios no logueados */}
      <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Regístrate para funciones avanzadas!</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-sm text-negro-suave">
            Para continuar conversando con Chipi y acceder a funciones de IA avanzadas como audio y documentos, por favor crea una cuenta.
          </div>
          <DialogFooter>
            <Button onClick={handleRegisterRedirect} className="bg-terra-cotta hover:bg-terra-cotta/90 w-full">
              Ir a registro
            </Button>
            <Button variant="outline" onClick={() => setRegistrationOpen(false)} className="w-full">
              Seguir explorando sin registrarse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 