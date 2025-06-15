
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/EventCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";

// Separar getEvents: no cambios porque ya filtra por status "publicado"
const getEvents = async () => {
  const { data, error } = await supabase.from("events").select("*").order('start_date', { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error(error.message);
  }
  return data;
};

export default function Eventos() {
  const { session } = useAuth();
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  // Separar eventos en "próximos" y "pasados"
  const now = new Date();
  const [upcoming, past] = useMemo(() => {
    if (!events) return [[], []];
    const upcomingE = events.filter(ev => ev.start_date && new Date(ev.start_date) >= now);
    const pastE = events.filter(ev => ev.start_date && new Date(ev.start_date) < now);
    return [upcomingE, pastE];
  }, [events, now]);

  return (
    <>
      <Navbar />
      <div className="bg-crema-claro min-h-screen">
        <div className="container mx-auto pt-10 pb-16">
          <div className="text-center mb-8">
              <h1 className="text-4xl font-display text-terra-cotta mb-2">Eventos de la Comunidad</h1>
              <p className="text-lg text-gris-piedra max-w-3xl mx-auto">
                Explorá los próximos eventos de la comunidad Terreta. Participá, conectá y creá experiencias que suman valor.
              </p>
          </div>

          <div className="flex justify-between items-center mb-8 flex-wrap gap-4 p-4 bg-white/50 rounded-xl border border-arena-light shadow-sm">
            <div className="flex gap-4 flex-wrap flex-1">
              {/* Filters */}
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnologia">Tecnología</SelectItem>
                  <SelectItem value="arte">Arte</SelectItem>
                  <SelectItem value="salud">Salud</SelectItem>
                  <SelectItem value="comunidad">Comunidad</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Costo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gratuito">Gratuito</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {session && (
              <Button asChild className="bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card hover:shadow-lg w-full sm:w-auto">
                <Link to="/eventos/crear">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear Evento
                </Link>
              </Button>
            )}
          </div>

          {/* Próximos eventos */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-mediterraneo">Próximos eventos</h2>
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[450px] w-full rounded-2xl bg-white" />
                ))}
              </div>
            )}
            {isError && <p className="text-center text-rojo-oxidado">Error al cargar los eventos. Por favor, intentá de nuevo más tarde.</p>}
            {upcoming && upcoming.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcoming.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center text-gris-piedra mt-12 bg-white p-8 rounded-xl border border-arena-light">
                  <h3 className="text-xl font-semibold mb-2">No hay eventos próximos</h3>
                  <p>¡Parece que no hay nada en la agenda! Sé el primero en crear un evento y movilizar a la comunidad.</p>
                </div>
              )
            )}
          </section>

          {/* Eventos pasados */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-arena">Eventos pasados</h2>
            {past && past.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {past.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center text-gris-piedra mt-4">
                  <span>No hay eventos pasados.</span>
                </div>
              )
            )}
          </section>
        </div>
      </div>
    </>
  );
}

