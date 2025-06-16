
import { Badge } from "./Badge";
import { ArrowRight, Github, Globe, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  description: string;
  vertical: "Legal" | "Arte" | "Tecnología" | "Educación" | "Ciencia" | "Social";
  highlightImg?: string;
  problem: string;
  demoUrl?: string;
  websiteUrl?: string;
  repoUrl?: string;
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
  websiteUrl,
  repoUrl,
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
      <div className="text-xs italic text-gris-piedra mb-3">Problema: {problem}</div>
      
      {/* Enlaces del proyecto */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-terra flex items-center gap-1 px-3 py-1 text-xs"
          >
            <Globe className="w-3 h-3" />
            Website
          </a>
        )}
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-terra flex items-center gap-1 px-3 py-1 text-xs"
          >
            <Play className="w-3 h-3" />
            Demo
          </a>
        )}
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-terra flex items-center gap-1 px-3 py-1 text-xs"
          >
            <Github className="w-3 h-3" />
            Repo
          </a>
        )}
      </div>
    </div>
  );
}
