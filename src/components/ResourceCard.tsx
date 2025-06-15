
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserCircle, BookOpen, Video, Podcast, FileText, FileCode, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

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
  title: string;
  description_short: string;
  format: string;
  category: string;
  tags: string[];
  url: string;
  created_at: string;
  author: {
    name: string;
    avatar_url?: string;
  };
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="bg-crema p-4 rounded-2xl shadow-card min-h-[210px] flex flex-col group transition-all hover:bg-arena/80 hover:shadow-lg cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={cn("rounded-lg bg-arena w-12 h-12 flex items-center justify-center text-xl", !ICONS[resource.format]?.type && "bg-gris-piedra/20")}>
          {ICONS[resource.format?.toLowerCase()] ?? <BookOpen className="text-mediterraneo" />}
        </div>
        <div className="flex-1">
          <div className="text-terra-cotta font-display font-bold text-base truncate">{resource.title}</div>
          <div className="text-gris-piedra text-xs">{resource.category}</div>
        </div>
        <Badge variant="outline" className="ml-auto capitalize border-terra-cotta text-terra-cotta">{resource.format}</Badge>
      </div>
      <div className="text-negro-suave line-clamp-2 text-sm my-2">{resource.description_short}</div>
      <div className="flex flex-wrap gap-1 mb-2">
        {resource.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="rounded px-2 py-0.5 text-xs bg-mediterraneo/10 text-mediterraneo">
            #{tag}
          </Badge>
        ))}
      </div>
      <div className="flex items-center mt-auto justify-between pt-2">
        <div className="flex items-center gap-2 text-xs">
          {resource.author.avatar_url ? (
            <img src={resource.author.avatar_url} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <UserCircle className="w-5 h-5 text-gris-piedra" />
          )}
          <span>{resource.author.name}</span>
        </div>
        <span className="text-xs text-gris-piedra">{format(new Date(resource.created_at), "d MMM yy", { locale: es })}</span>
      </div>
    </div>
  );
}
