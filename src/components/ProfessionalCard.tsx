
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface Props {
  name: string;
  bio: string;
  avatarUrl?: string;
  vertical: "Legal" | "Arte" | "Tecnología" | "Educación" | "Ciencia" | "Social";
  skills: string[];
  links?: { label: string; url: string }[];
}

export function ProfessionalCard({
  name,
  bio,
  avatarUrl,
  vertical,
  skills,
  links,
}: Props) {
  return (
    <div className={cn(
      "card-fade-in bg-card p-6 rounded-2xl card-shadow flex flex-col gap-3 items-start w-full max-w-xs hover:scale-105 transition-all duration-300 hover:shadow-lg",
      "border border-arena"
    )}>
      <div className="flex items-center gap-3 w-full mb-2">
        <img
          src={avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=terreta"}
          alt={`${name} avatar`}
          className="w-14 h-14 rounded-full border-4 border-arena object-cover"
        />
        <div>
          <div className="font-display text-xl font-bold">{name}</div>
          <Badge label={vertical} vertical={vertical} />
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-6 mb-1 line-clamp-3">{bio}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill) => (
          <span key={skill} className="bg-arena text-terra-cotta px-3 py-1 rounded-xl text-xs font-semibold">{skill}</span>
        ))}
      </div>
      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {links.map((link) => (
            <a
              href={link.url}
              key={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-mediterraneo hover:underline font-medium"
            >
              {link.label} <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
