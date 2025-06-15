
import { Badge } from "./ui/badge";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";

export function EventCard({ event }: { event: Tables<'events'> }) {
  const { name, description, event_type, start_date, location, city, category } = event;
  const highlight_img = (event as any).highlight_img;

  const formattedDate = start_date
    ? new Date(start_date).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Fecha por confirmar";

  return (
    <div className={cn(
      "bg-white card-fade-in p-5 rounded-2xl shadow-card flex flex-col gap-3 w-full hover:scale-105 transition-all duration-300 hover:shadow-lg border border-arena"
    )}>
      {highlight_img && (
        <div
          className="w-full h-40 bg-cover bg-center rounded-xl mb-2"
          style={{
            backgroundImage: `url(${highlight_img})`,
          }}
        />
      )}
      <div className="flex items-center flex-wrap gap-2 mb-1">
        {category && <Badge className="bg-terra-cotta/20 text-terra-cotta hover:bg-terra-cotta/30">{category}</Badge>}
        {event_type && <Badge variant="outline">{event_type}</Badge>}
      </div>
      <div className="font-display text-xl font-bold mb-1 flex-grow">{name}</div>
      <p className="text-gray-700 text-sm line-clamp-3 mb-2">{description}</p>
      
      <div className="text-sm text-gris-piedra flex items-center gap-2 mt-auto pt-2 border-t border-arena-light">
        <Calendar className="w-4 h-4" />
        <span>{formattedDate}</span>
      </div>

      {(location || city) && (
        <div className="text-sm text-gris-piedra flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}{location && city && ", "}{city}</span>
        </div>
      )}
      
      <Button variant="link" asChild className="text-terra-cotta p-0 h-auto justify-start mt-2">
        <a
            href={`#`} // Assuming a detail page will exist
            className="flex items-center gap-1"
        >
            Ver evento <ArrowRight className="w-4 h-4 ml-0.5" />
        </a>
      </Button>
    </div>
  );
}
