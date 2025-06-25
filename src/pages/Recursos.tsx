import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ResourceCard, Resource } from "@/components/ResourceCard";
// import { ResourceDebugInfo } from "@/components/ResourceDebugInfo"; // Temporalmente comentado
import { SearchBar } from "@/components/SearchBar";
import { FormatFilterBar } from "@/components/FormatFilterBar";
import { ResourceForm } from "@/components/ResourceForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const getResources = async (): Promise<Resource[]> => {
  console.log("Cargando recursos...");
  
  // Obtener recursos
  const { data: resourcesData, error: resourcesError } = await supabase
    .from("resources")
    .select(`
      id, name, description, description_short, resource_type, category, url, created_at, creator_id
    `)
    .eq("status", "publicado")
    .order("created_at", { ascending: false });

  // console.log("Recursos obtenidos:", resourcesData?.length || 0);
  // console.log("Recursos con creator_id:", resourcesData?.filter(r => r.creator_id)?.length || 0);
  
  if (resourcesError) {
    console.error("Error cargando recursos:", resourcesError);
    throw new Error(resourcesError.message);
  }

  if (!resourcesData || resourcesData.length === 0) return [];

  // Obtener los IDs únicos de creadores
  const creatorIds = [...new Set(resourcesData.map(resource => resource.creator_id))].filter(Boolean);
  
  let profilesData = [];
  if (creatorIds.length > 0) {
    // Obtener perfiles profesionales
    const { data: profiles, error: profilesError } = await supabase
      .from("professional_profiles")
      .select("user_id, name, display_name, avatar_url")
      .in("user_id", creatorIds);
    
    if (profilesError) {
      console.error("Error cargando perfiles:", profilesError);
      // No lanzar error, usar datos por defecto
    } else {
      profilesData = profiles || [];
    }
  }

  // Crear un mapa de perfiles para búsqueda rápida
  const profilesMap = new Map(
    profilesData.map(profile => [profile.user_id, profile])
  );

  // console.log("Datos de recursos:", resourcesData);
  // console.log("Datos de perfiles:", profilesData);
  // console.log("Mapa de perfiles:", profilesMap);

  return resourcesData.map((r: any) => {
    const profile = profilesMap.get(r.creator_id);
    // console.log(`Recurso: ${r.name}, creator_id: ${r.creator_id}, profile encontrado:`, profile);
    
    const authorName = profile?.display_name || profile?.name || "Sin nombre";
    // console.log(`Nombre del autor para ${r.name}: ${authorName}`);
    
    return {
      ...r,
      tags: [], // Por ahora tags vacío hasta que se agregue la columna
      author: {
        name: authorName,
        avatar_url: profile?.avatar_url ?? undefined
      }
    };
  });
};

export default function Recursos() {
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("todos");
  const [openForm, setOpenForm] = useState(false);

  const { data: resources = [], isLoading, isError, error } = useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
  });

  const filtered = resources.filter(r => {
    const matchFormat = format === "todos" || (r.resource_type ?? "").toLowerCase() === format;
    const searchText = (
      r.name +
      " " + (r.description_short ?? "") +
      " " + (r.author?.name ?? "") +
      " " + (r.category ?? "")
    ).toLowerCase();
    return matchFormat && searchText.includes(search.toLowerCase());
  });

  if (isError) {
    console.error("Error en query de recursos:", error);
  }

  return (
    <>
      <Navbar />
      {/* Hero / Cabecera */}
      <section className="bg-arena px-2 py-10 rounded-b-3xl shadow animate-fade-in-up">
        <div className="container mx-auto flex flex-col md:flex-row md:justify-between items-center gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-display font-bold text-terra-cotta mb-4 flex items-center gap-2">
              <span className="text-5xl">📚</span>
              Recursos abiertos para mentes inquietas
            </h1>
            <p className="max-w-xl text-lg text-negro-suave/80 mb-4">
              Videos, artículos, guías, podcasts y más… seleccionados por la comunidad para crecer juntos.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <SearchBar
                value={search}
                onChange={setSearch}
                className="flex-1 max-w-xl"
                placeholder="Buscar recursos, autores, categorías…"
              />
              <Button
                className="h-12 text-base font-semibold bg-terra-cotta hover:bg-terra-cotta/80 shadow hover-scale transition"
                size="lg"
                onClick={() => setOpenForm(true)}
              >
                + Subir recurso
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-6">
          <FormatFilterBar selected={format} onSelect={setFormat} />
        </div>
      </section>

      {/* Listado de recursos */}
      <section className="container mx-auto pt-6 pb-12 animate-fade-in-up">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center py-16 text-lg text-red-500">
            Error al cargar los recursos. Por favor, intenta de nuevo más tarde.
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex justify-center items-center py-16 text-lg text-gris-piedra">
            {resources.length === 0 ? "No hay recursos disponibles..." : "No hay recursos con esos filtros…"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
            {filtered.map(r => (
              <div key={r.id}>
                {/* <ResourceDebugInfo resource={r} /> */}
                <ResourceCard resource={r} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal para crear recurso */}
      <ResourceForm 
        open={openForm} 
        onOpenChange={(v) => setOpenForm(v)} 
      />
    </>
  );
}
