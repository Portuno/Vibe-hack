
import { Profile } from "@/types";
import { Badge } from "./Badge";
import { ArrowRight, MapPin } from "lucide-react";
import { SocialLinks } from "./SocialLinks";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  profile: Profile;
}

export function ProfessionalCard({ profile }: Props) {
  const {
    id,
    display_name,
    name,
    headline,
    bio,
    avatar_url,
    vertical,
    skills,
    social_links,
    location
  } = profile;

  return (
    <Card className="flex flex-col h-full bg-white/50 border-arena-light shadow-sm hover:shadow-card transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border-4 border-arena">
            <AvatarImage src={avatar_url ?? ""} alt={display_name || name} />
            <AvatarFallback>{(display_name || name).charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-negro-suave">{display_name || name}</h3>
          {headline && <p className="text-sm text-gris-piedra">{headline}</p>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Badge label={vertical} vertical={vertical as any} />
        {bio && <p className="text-gris-piedra text-sm leading-6 line-clamp-3">{bio}</p>}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 5).map((skill) => (
              <span key={skill} className="bg-arena text-terra-cotta px-3 py-1 rounded-full text-xs font-semibold">{skill}</span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 pt-4">
        <div className="flex justify-between w-full items-center">
            {location && <div className="flex items-center text-sm text-gris-piedra"><MapPin className="h-4 w-4 mr-1" /> {location}</div>}
            <SocialLinks links={social_links} />
        </div>
        <Button asChild className="w-full bg-terra-cotta hover:bg-terra-cotta/90 text-white">
          <Link to={`/profesionales/${id}`}>
            Ver Perfil <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
