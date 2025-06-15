
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Calendar, MapPin, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader as SheetSheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface EventCardProps {
  name: string;
  description: string | null;
  start_date: string | null;
  location: string | null;
  url: string | null;
  purchase_url: string | null;
  category?: string | null;
  event_type?: string | null;
  city?: string | null;
  price?: number | null;
  highlight_img?: string | null;
}

export function EventCard({
  name,
  description,
  start_date,
  location,
  url,
  purchase_url,
  category,
  event_type,
  city,
  price,
  highlight_img,
}: EventCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Card className="flex flex-col h-full relative group overflow-hidden">
        {/* Imagen destacada visible en la card, si existe */}
        {highlight_img ? (
          <img
            src={highlight_img}
            alt="Imagen destacada del evento"
            className="block w-full h-44 object-cover object-center border-b border-arena rounded-t-lg transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-44 flex items-center justify-center bg-arena border-b border-arena rounded-t-lg text-mediterraneo">
            <ImageIcon className="h-12 w-12 opacity-40" />
          </div>
        )}
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          {description && (
            <CardDescription className="line-clamp-3">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(start_date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {location}
                  {city ? `, ${city}` : ""}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-4">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label="Link al sitio externo"
            >
              <Button
                variant="outline"
                className="flex items-center"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Link
              </Button>
            </a>
          )}
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center">
              Más info
            </Button>
          </SheetTrigger>
          {purchase_url && (
            <a href={purchase_url} target="_blank" rel="noreferrer">
              <Button>
                Comprar tickets{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          )}
        </CardFooter>
      </Card>
      <SheetContent side="right" className="max-w-md w-full">
        <SheetSheetHeader>
          <SheetTitle>{name}</SheetTitle>
          {category && (
            <span className="inline-block text-xs px-2 py-1 rounded bg-arena text-mediterraneo font-medium mb-2">
              {category}
            </span>
          )}
        </SheetSheetHeader>
        <div className="mt-2 flex flex-col gap-4 text-sm">
          {highlight_img && (
            <img
              src={highlight_img}
              alt="Imagen destacada del evento"
              className="block rounded-lg w-full max-h-52 object-cover border border-arena"
            />
          )}

          <div className="space-y-1">
            {start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(start_date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {event_type && (
              <div>
                <span className="font-semibold mr-1">Modalidad:</span>
                {event_type}
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{location}{city ? `, ${city}` : ""}</span>
              </div>
            )}
            {price !== undefined && price !== null && (
              <div>
                <span className="font-semibold mr-1">Precio:</span>€{price}
              </div>
            )}
          </div>
          {description && (
            <div>
              <h4 className="font-semibold mb-1">Descripción</h4>
              <p className="whitespace-pre-line">{description}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-6">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="w-full"
              aria-label="Link al sitio externo"
            >
              <Button variant="outline" className="w-full flex items-center">
                <LinkIcon className="mr-2 h-4 w-4" />
                Link externo
              </Button>
            </a>
          )}
          {purchase_url && (
            <a
              href={purchase_url}
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              <Button className="w-full">
                Comprar tickets
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

