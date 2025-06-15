
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserCircle, BookOpen, Video, Podcast, FileText, FileCode, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { TagList } from "./TagList";

const ICONS: Record<string, JSX.Element> = {
  "video": <Video className="text-mediterraneo" />,
  "artículo": <BookOpen className="text-mediterraneo" />,
  "podcast": <Podcast className="text-mediterraneo" />,
  "guía": <FileText className="text-mediterraneo" />,
  "documento": <FileSpreadsheet className="text-mediterraneo" />,
  "tool": <FileCode className="text-mediterraneo" />,
  "plantilla": <FileSpreadsheet className="text-mediterraneo" />,
};

export type Resource = {
  id: string;
  name: string;
  description?: string;
  description_short: string;
  resource_type: string;
  category?: string;
  tags?: string[];
  url?: string;
  created_at: string;
  author: {
    name: string;
    avatar_url?: string;
  };
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="bg-crema rounded-xl shadow-card p-4 flex flex-col min-h-[265px] relative group hover:shadow-lg focus-within:shadow-lg transition-all">
      <div className="flex items-center gap-4 mb-2">
        <div className={cn(
          "rounded-lg bg-arena w-12 h-12 flex items-center justify-center text-xl shrink-0",
          !ICONS[resource.resource_type?.toLowerCase()]?.type && "bg-gris-piedra/20"
        )}>
          {ICONS[resource.resource_type?.toLowerCase()] ?? <BookOpen className="text-mediterraneo" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base text-terra-cotta truncate" title={resource.name}>{resource.name}</h3>
          {resource.category && <span className="text-gris-piedra text-xs">{resource.category}</span>}
        </div>
        <Badge variant="outline" className="ml-auto capitalize border-terra-cotta text-terra-cotta">{resource.resource_type}</Badge>
      </div>
      <div className="text-negro-suave text-sm mb-2">
        {resource.description_short ?? resource.description}
      </div>
      {resource.tags && resource.tags.length > 0 && (
        <TagList tags={resource.tags} />
      )}
      <div className="flex items-end gap-2 mt-auto pt-4 w-full justify-between">
        <div className="flex items-center gap-2 text-xs flex-1 min-w-0">
          {resource.author?.avatar_url
            ? <img src={resource.author.avatar_url} className="w-6 h-6 rounded-full object-cover" />
            : <UserCircle className="w-5 h-5 text-gris-piedra" />
          }
          <span className="truncate">{resource.author?.name}</span>
        </div>
        <span className="text-xs text-gris-piedra min-w-max">
          {format(new Date(resource.created_at), "d MMM yy", { locale: es })}
        </span>
      </div>
      {/* Overlay for click/focus, future: click -> detail modal */}
      <a
        href={resource.url ?? "#"}
        className="absolute inset-0 rounded-xl z-10 focus:outline-terra-cotta"
        tabIndex={0}
        aria-label={`Ver recurso: ${resource.name}`}
        target="_blank"
        rel="noopener noreferrer"
      ></a>
    </div>
  );
}
