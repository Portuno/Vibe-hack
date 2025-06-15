
import { Badge } from "@/components/ui/badge";

export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map(tag => (
        <Badge key={tag} variant="secondary" className="rounded px-2 py-0.5 text-xs bg-mediterraneo/10 text-mediterraneo">
          #{tag}
        </Badge>
      ))}
    </div>
  );
}
