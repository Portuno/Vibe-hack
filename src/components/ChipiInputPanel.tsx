import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Paperclip, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChipiInputPanelProps {
  onSendText: (text: string) => void;
  onSendAudio: (file: File) => void;
  onSendDocument: (file: File) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ChipiInputPanel: React.FC<ChipiInputPanelProps> = ({
  onSendText,
  onSendAudio,
  onSendDocument,
  disabled = false,
  isLoading = false
}) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendText(input.trim());
      setInput("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El archivo no puede superar los 10MB",
        variant: "destructive"
      });
      return;
    }

    // Check if it's an audio file
    const audioTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/mpeg'];
    if (audioTypes.includes(file.type)) {
      onSendAudio(file);
    } else {
      // Treat as document
      const allowedDocTypes = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (allowedDocTypes.includes(file.type)) {
        onSendDocument(file);
      } else {
        toast({
          title: "Tipo de archivo no soportado",
          description: "Solo se permiten archivos PDF, Word, Excel y archivos de texto",
          variant: "destructive"
        });
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        onSendAudio(audioFile);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Error de micrófono",
        description: "No se pudo acceder al micrófono. Verifica los permisos.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText(e as any);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-crema border-t border-arena">
      {/* File upload inputs (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main input area */}
      <form onSubmit={handleSendText} className="flex items-center gap-2">
        {/* Text input */}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje…"
          className="flex-1 py-3 bg-arena resize-none"
          disabled={disabled || isLoading}
        />

        {/* Action buttons */}
        <div className="flex gap-1">
          {/* Document upload button */}
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className="bg-white hover:bg-arena/50"
            aria-label="Subir documento"
            title="Subir documento (PDF, Word, Excel, TXT)"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Audio recording button */}
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled || isLoading}
            className={cn(
              "bg-white hover:bg-arena/50",
              isRecording && "bg-red-100 hover:bg-red-200 text-red-600"
            )}
            aria-label={isRecording ? "Detener grabación" : "Grabar audio"}
            title={isRecording ? "Detener grabación" : "Grabar mensaje de voz"}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Audio file upload button */}
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => audioInputRef.current?.click()}
            disabled={disabled || isLoading}
            className="bg-white hover:bg-arena/50"
            aria-label="Subir audio"
            title="Subir archivo de audio"
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send button */}
          <Button
            type="submit"
            size="icon"
            className="bg-terra-cotta hover:bg-terra-cotta/90"
            disabled={disabled || isLoading || !input.trim()}
            aria-label="Enviar mensaje"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center justify-center gap-2 py-2 bg-red-50 rounded-lg border border-red-200">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-600 text-sm font-medium">Grabando... Haz clic en el micrófono para detener</span>
        </div>
      )}

      {/* Supported formats info */}
      <div className="text-xs text-gris-piedra text-center">
        Soporta texto, audio (MP3, WAV, OGG) y documentos (PDF, Word, Excel, TXT)
      </div>
    </div>
  );
}; 