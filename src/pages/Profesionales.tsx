
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Profile } from "@/types";

const getPublicProfiles = async () => {
  const { data, error } = await supabase
    .from("professional_profiles")
    .select("*")
    .eq("is_public", true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
    throw new Error(error.message);
  }
  return data as Profile[];
};

export default function Profesionales() {
    const { session } = useAuth();
    const { data: profiles, isLoading, isError } = useQuery({
        queryKey: ["publicProfiles"],
        queryFn: getPublicProfiles,
    });

  return (
    <>
      <Navbar />
      <div className="bg-crema-claro min-h-screen">
        <div className="container mx-auto pt-10 pb-16">
          <div className="text-center mb-8">
              <h1 className="text-4xl font-display text-terra-cotta mb-2">Profesionales de Terreta Hub</h1>
              <p className="text-lg text-gris-piedra max-w-3xl mx-auto">
                Conectá con emprendedores y visionarios trabajando por cambiar el futuro.
              </p>
          </div>

          <div className="flex justify-between items-center mb-8 flex-wrap gap-4 p-4 bg-white/50 rounded-xl border border-arena-light shadow-sm">
            <div className="flex gap-4 flex-wrap flex-1">
              {/* Filters */}
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Vertical / Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnologia">Tecnología</SelectItem>
                  <SelectItem value="arte">Arte</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="educacion">Educación</SelectItem>
                  <SelectItem value="ciencia">Ciencia</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Buscar por habilidad, rol..."
                className="w-full sm:w-[240px]"
              />
            </div>
             {session ? (
              <Button asChild className="bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card hover:shadow-lg w-full sm:w-auto">
                <Link to="/mi-perfil">
                  Editar mi Perfil
                </Link>
              </Button>
            ) : (
                 <Button asChild className="bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card hover:shadow-lg w-full sm:w-auto">
                    <Link to="/auth">
                    Crear Perfil
                    </Link>
                </Button>
            )}
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[480px] w-full rounded-2xl bg-white" />
              ))}
            </div>
          )}
          {isError && <p className="text-center text-rojo-oxidado">Error al cargar los perfiles. Por favor, intentá de nuevo más tarde.</p>}
          
          {profiles && profiles.length > 0 ? (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {profiles.map((profile) => (
                    <ProfessionalCard key={profile.id} profile={profile} />
                ))}
                </div>
                <Pagination className="mt-12">
                    <PaginationContent>
                        <PaginationItem>
                        <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </>
          ) : (
            !isLoading && (
              <div className="text-center text-gris-piedra mt-12 bg-white p-8 rounded-xl border border-arena-light">
                <h3 className="text-xl font-semibold mb-2">No hay perfiles para mostrar</h3>
                <p>¡Todavía no hay profesionales aquí! Sé el primero en crear tu perfil y aparecer en la comunidad.</p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
