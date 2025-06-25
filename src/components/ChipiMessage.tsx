import { cn } from "@/lib/utils";
import { type MabotMessage, type MessageContent } from "@/integrations/mabot/client";
import { FileText, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

interface ChipiMessageProps {
  message: MabotMessage;
  isChipi?: boolean;
}

const ContentRenderer: React.FC<{ content: MessageContent }> = ({ content }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayAudio = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  switch (content.type) {
    case 'text':
      return (
        <span className="block whitespace-pre-line">
          {content.value}
        </span>
      );

    case 'audio':
      const audioSrc = `data:${content.mimetype};base64,${content.value}`;
      
      return (
        <div className="flex flex-col gap-2">
          {/* Show parsed text if available */}
          {content.parsed_text && (
            <span className="block whitespace-pre-line text-sm italic">
              "{content.parsed_text}"
            </span>
          )}
          
          {/* Audio player */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayAudio}
              className="p-1 h-auto"
            >
              {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <span className="text-xs text-gray-600 flex-1">
              Audio: {content.filename}
            </span>
            
            <audio
              ref={audioRef}
              src={audioSrc}
              onEnded={handleAudioEnd}
              preload="metadata"
            />
          </div>
        </div>
      );

    case 'document':
      return (
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded border">
          <FileText className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <div className="font-medium text-sm">{content.filename}</div>
            <div className="text-xs text-gray-600">Documento subido</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const link = document.createElement('a');
              link.href = `data:${content.mimetype};base64,${content.value}`;
              link.download = content.filename;
              link.click();
            }}
            className="text-xs"
          >
            Descargar
          </Button>
        </div>
      );

    default:
      return (
        <span className="text-gray-500 italic">
          Tipo de contenido no soportado
        </span>
      );
  }
};

export const ChipiMessage: React.FC<ChipiMessageProps> = ({ 
  message, 
  isChipi = false 
}) => {
  return (
    <div
      className={cn("flex w-full", {
        "justify-end": !isChipi,
        "justify-start": isChipi,
      })}
    >
      {isChipi ? (
        <div className="flex items-end gap-2">
          <img
            src="/lovable-uploads/cd8f5122-d206-49ff-bf94-0fc1da28a181.png"
            alt="Chipi"
            className="w-12 h-12 rounded-full border-2 border-terra-cotta shadow bg-white object-cover"
            style={{ background: '#fff' }}
          />
          <div className="bg-white text-negro-suave px-4 py-3 rounded-2xl rounded-tl-sm shadow-card max-w-xs sm:max-w-sm text-sm">
            <div className="space-y-2">
              {message.contents.map((content, index) => (
                <ContentRenderer key={index} content={content} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-2 flex-row-reverse">
          <div className="bg-terra-cotta text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-card max-w-xs sm:max-w-sm text-sm text-right">
            <div className="space-y-2">
              {message.contents.map((content, index) => (
                <ContentRenderer key={index} content={content} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 