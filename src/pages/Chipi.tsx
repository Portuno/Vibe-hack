
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Message {
  from: "chipi" | "user";
  text: string;
}

export default function Chipi() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "chipi",
      text: "¡Hola! Soy Chipi, tu asistente de Terreta Hub. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth and navigation
  const { session } = useAuth();
  const navigate = useNavigate();

  // Track not-authenticated message flow
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
  }, [messages]);

  // On closing modal: if anonymous sends again, Chipi sends last message
  useEffect(() => {
    // If registration just closed after hitting anonMessageCount>=3
    if (!registrationOpen && !isAuthenticated && anonMessageCount >= 3 && sentFinalPrompt === false) {
      // block sending new messages and send one last Chipi prompt on next attempt
      setBlocked(true);
      setSentFinalPrompt(false);
    }
  }, [registrationOpen, isAuthenticated, anonMessageCount, sentFinalPrompt]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (blocked && !sentFinalPrompt && !isAuthenticated) {
      // Show one last chipi message when user tries to send after closing registration
      setMessages((prev) => [
        ...prev,
        { from: "chipi", text: "chip chip chip (regístrate)" },
      ]);
      setSentFinalPrompt(true);
      return;
    }
    if (blocked && sentFinalPrompt && !isAuthenticated) {
      // Do nothing, blocked.
      return;
    }
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        { from: "user", text: input },
      ]);
      setInput("");

      // If user is not authenticated, track attempts
      if (!isAuthenticated) {
        if (anonMessageCount < 2) {
          setAnonMessageCount((n) => n + 1);

          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                from: "chipi",
                text:
                  "¡Gracias por tu mensaje! Pío pío… Estoy en la Terreta investigando tu consulta 🕵️‍♂️. Pronto te respondo aquí.",
              },
            ]);
          }, 1000);
        } else if (anonMessageCount === 2) {
          // On the third message, open registration
          setAnonMessageCount((n) => n + 1);
          setRegistrationOpen(true);
        } 
        // If anonMessageCount >= 3, block handled above.
        return;
      }

      // Authenticated users: chipi replies after a delay just as before
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            from: "chipi",
            text:
              "¡Gracias por tu mensaje! Pío pío… Estoy en la Terreta investigando tu consulta 🕵️‍♂️. Pronto te respondo aquí.",
          },
        ]);
      }, 1000);
    }
  };

  const handleRegisterRedirect = () => {
    setRegistrationOpen(false);
    navigate("/auth");
  };

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
              Chatbot de Terreta Hub
            </p>
            <div className="w-[70%] h-[2px] bg-arena mb-2 rounded" />
          </div>
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto pr-0 sm:pr-2 space-y-4 pb-2">
            {messages.map((message, index) => (
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
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Formulario de entrada */}
          <form
            onSubmit={handleSend}
            className="mt-2 flex items-center gap-2 p-2 bg-crema rounded-b-2xl"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje…"
              className="flex-1 py-3 bg-arena"
              disabled={blocked && sentFinalPrompt && !isAuthenticated}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-terra-cotta hover:bg-terra-cotta/90"
              aria-label="Enviar mensaje"
              disabled={blocked && sentFinalPrompt && !isAuthenticated}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </main>
      {/* Modal de registro para usuarios no logueados */}
      <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Regístrate para seguir chateando!</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-sm text-negro-suave">
            Para continuar conversando con Chipi y acceder a todos los recursos de Terreta Hub, por favor crea una cuenta.
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
