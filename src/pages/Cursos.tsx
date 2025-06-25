import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import { VerticalFilterBar } from "@/components/VerticalFilterBar";
import { SearchBar } from "@/components/SearchBar";
import { Plus } from "lucide-react";
import { CourseFormDialog } from "@/components/CourseFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type Course = {
  id: string;
  title: string;
  description_short: string;
  image?: string;
  verticals: string[];
  creator: {
    name: string;
    avatar_url: string;
  };
  level: "Básico" | "Intermedio" | "Avanzado";
  type: "Gratuito" | "Pago";
  tag?: "Nuevo" | "Destacado";
};

const getCourses = async (): Promise<Course[]> => {
  console.log("Cargando cursos...");
  
  // Obtener cursos
  const { data: coursesData, error: coursesError } = await supabase
    .from("courses")
    .select(`
      id, name, description, vertical, level, type, url, created_at, creator_id
    `)
    .eq("status", "publicado")
    .order("created_at", { ascending: false });
  
  if (coursesError) {
    console.error("Error cargando cursos:", coursesError);
    throw new Error(coursesError.message);
  }

  if (!coursesData || coursesData.length === 0) return [];

  // Obtener los IDs únicos de creadores
  const creatorIds = [...new Set(coursesData.map(course => course.creator_id))].filter(Boolean);
  
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
    (profilesData || []).map(profile => [profile.user_id, profile])
  );

  console.log("Datos de cursos:", coursesData);
      // console.log("Datos de perfiles:", profilesData);

  const formattedCourses: Course[] = coursesData.map((course: any) => {
    const profile = profilesMap.get(course.creator_id);
    
    return {
      id: course.id,
      title: course.name,
      description_short: course.description || "Sin descripción",
      image: course.url,
      verticals: course.vertical ? [course.vertical] : ["Tecnología"],
      creator: {
        name: profile?.display_name || profile?.name || "Anónimo",
        avatar_url: profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=terreta",
      },
      level: course.level as "Básico" | "Intermedio" | "Avanzado" || "Básico",
      type: course.type as "Gratuito" | "Pago" || "Gratuito",
      // Marcar como "Nuevo" si fue creado en los últimos 7 días
      tag: new Date(course.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 ? "Nuevo" : undefined,
    };
  });
  
  return formattedCourses;
};

export default function Cursos() {
  const [search, setSearch] = useState("");
  const [vertical, setVertical] = useState("Todos");

  const { data: courses = [], isLoading, isError, error } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const filteredCourses = courses.filter(c => {
    const matchVertical =
      vertical === "Todos" || c.verticals.includes(vertical);
    const searchText = (
      c.title +
      " " +
      c.description_short +
      " " +
      c.creator.name
    ).toLowerCase();
    return matchVertical && searchText.includes(search.toLowerCase());
  });

  if (isError) {
    console.error("Error en query de cursos:", error);
  }

  return (
    <>
      <Navbar />
      {/* Hero/encabezado */}
      <section className="bg-arena px-2 py-10 rounded-b-3xl shadow animate-fade-in-up">
        <div className="container mx-auto flex flex-col md:flex-row md:justify-between items-center gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-display font-bold text-terra-cotta mb-4 flex items-center gap-2">
              <span className="text-5xl">🎓</span>
              Aprendé, creá y conectá desde la Terreta
            </h1>
            <p className="max-w-xl text-lg text-negro-suave/80 mb-4">
              Descubrí cursos, talleres y formaciones de calidad creadas por y para la comunidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <SearchBar
                value={search}
                onChange={setSearch}
                className="flex-1 max-w-xl"
                placeholder="Buscar cursos, talleres, creadores…"
              />
              <CourseFormDialog />
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-6">
          <VerticalFilterBar selected={vertical} onSelect={v => setVertical(v)} />
        </div>
      </section>

      {/* Listado de cursos */}
      <section className="container mx-auto pt-6 pb-12 animate-fade-in-up">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
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
            Error al cargar los cursos. Por favor, intenta de nuevo más tarde.
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex justify-center items-center py-16 text-lg text-gris-piedra">
            {courses.length === 0 ? "No hay cursos disponibles..." : "No hay cursos con esos filtros…"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2">
            {filteredCourses.map(c => <CourseCard course={c} key={c.id} />)}
          </div>
        )}
      </section>
    </>
  );
}
