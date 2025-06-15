
import { Badge } from "./Badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  description: string;
  vertical: "Legal" | "Arte" | "Tecnología" | "Educación" | "Ciencia" | "Social";
  highlightImg?: string;
  problem: string;
  demoUrl?: string;
  creatorName: string;
  creatorAvatar?: string;
}

export function ProjectCard({
  name,
  description,
  vertical,
  highlightImg,
  problem,
  demoUrl,
  creatorName,
  creatorAvatar,
}: Props) {
  return (
    <div className={cn(
      "bg-arena card-fade-in p-5 rounded-2xl card-shadow flex flex-col gap-3 w-full max-w-sm hover:scale-105 transition-all duration-300 hover:shadow-lg border border-arena"
    )}>
      {highlightImg && (
        <div
          className="w-full h-36 bg-cover bg-center rounded-xl mb-2"
          style={{
            backgroundImage: `url(${highlightImg})`,
          }}
        />
      )}
      <div className="flex items-center gap-2 mb-1">
        <Badge label={vertical} vertical={vertical} />
        <div className="flex items-center gap-1 ml-auto">
          <img
            src={creatorAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=terreta"}
            alt={creatorName}
            className="w-8 h-8 rounded-full border-2 border-arena object-cover"
          />
          <div className="text-xs font-medium">{creatorName}</div>
        </div>
      </div>
      <div className="font-display text-lg font-bold mb-1">{name}</div>
      <div className="text-gray-700 text-sm line-clamp-2 mb-2">{description}</div>
      <div className="text-xs italic text-gris-piedra mb-1">Problema: {problem}</div>
      {demoUrl && (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-terra mt-2 flex justify-center items-center gap-1 w-fit px-4 py-1 text-sm"
        >
          Ver demo <ArrowRight className="w-4 h-4 ml-0.5" />
        </a>
      )}
    </div>
  );
}
