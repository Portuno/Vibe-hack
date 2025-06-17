
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import { VerticalFilterBar } from "@/components/VerticalFilterBar";
import { SearchBar } from "@/components/SearchBar";
import { Plus } from "lucide-react";
import { CourseFormDialog } from "@/components/CourseFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export default function Cursos() {
  const [search, setSearch] = useState("");
  const [vertical, setVertical] = useState("Todos");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadCourses = async () => {
    setLoading(true);
    console.log("Cargando cursos...");
    
    const { data, error } = await supabase
      .from("courses")
      .select(`
        id, name, description, vertical, level, type, url, created_at,
        profiles:creator_id ( name, avatar_url )
      `)
      .eq("status", "publicado")
      .order("created_at", { ascending: false });
    
    console.log("Datos de cursos:", data);
    console.log("Error al cargar cursos:", error);
    
    setLoading(false);
    
    if (error) {
      console.error("Error cargando cursos:", error);
      toast({ 
        title: "Error", 
        description: "No se pudieron cargar los cursos", 
        variant: "destructive" 
      });
      return;
    }

    if (data) {
      const formattedCourses: Course[] = data.map((course: any) => ({
        id: course.id,
        title: course.name,
        description_short: course.description || "Sin descripción",
        image: course.url,
        verticals: course.vertical ? [course.vertical] : ["Tecnología"],
        creator: {
          name: course.profiles?.name || "Anónimo",
          avatar_url: course.profiles?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=terreta",
        },
        level: course.level as "Básico" | "Intermedio" | "Avanzado" || "Básico",
        type: course.type as "Gratuito" | "Pago" || "Gratuito",
        // Marcar como "Nuevo" si fue creado en los últimos 7 días
        tag: new Date(course.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 ? "Nuevo" : undefined,
      }));
      
      setCourses(formattedCourses);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

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
              <CourseFormDialog onCourseAdded={loadCourses} />
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-6">
          <VerticalFilterBar selected={vertical} onSelect={v => setVertical(v)} />
        </div>
      </section>

      {/* Listado de cursos */}
      <section className="container mx-auto pt-6 pb-12 animate-fade-in-up">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-lg text-gris-piedra">
            Cargando cursos...
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
