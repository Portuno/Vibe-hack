
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bird, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  from: 'chipi' | 'user';
  text: string;
}

export default function Chipi() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'chipi', text: '¡Pío! Soy Chipi, el gorrión de Terreta Hub. Estoy acá para ayudarte a navegar la comunidad. ¿Qué buscás hoy?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessages: Message[] = [...messages, { from: 'user', text: input }];
      setMessages(newMessages);
      setInput('');

      setTimeout(() => {
        setMessages(prev => [...prev, { from: 'chipi', text: 'Pío, pío... ¡Entendido! Estoy buscando en la Terreta... Dame un segundo.' }]);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-crema">
      <Navbar />
      <main className="flex-1 flex flex-col container mx-auto py-4 w-full max-w-3xl">
        <div className="flex-1 overflow-y-auto pr-4 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex items-start gap-4", {
                "justify-end": message.from === 'user',
              })}
            >
              {message.from === 'chipi' && (
                <Avatar className="w-10 h-10 border-2 border-terra-cotta/50">
                  <AvatarFallback className="bg-terra-cotta text-white">
                    <Bird size={24} />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn("max-w-md p-4 rounded-2xl shadow-sm", {
                  "bg-white text-negro-suave rounded-tl-none": message.from === 'chipi',
                  "bg-terra-cotta text-white rounded-br-none": message.from === 'user',
                })}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribile algo a Chipi..."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-terra-cotta hover:bg-terra-cotta/90">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </main>
    </div>
  );
}
