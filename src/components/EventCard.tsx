
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  name: string;
  description: string | null;
  start_date: string | null;
  location: string | null;
  url: string | null;
  purchase_url: string | null;
}

export function EventCard({ name, description, start_date, location, url, purchase_url }: EventCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description && <CardDescription className="line-clamp-3">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {start_date && (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(start_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            )}
            {location && (
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4">
        {url && (
          <a href={url} target="_blank" rel="noreferrer">
            <Button variant="outline">Más info</Button>
          </a>
        )}
        {purchase_url && (
          <a href={purchase_url} target="_blank" rel="noreferrer">
            <Button>Comprar tickets <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
