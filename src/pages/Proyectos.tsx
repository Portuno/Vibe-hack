
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/ProjectCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const getProjects = async () => {
  console.log("Cargando proyectos...");
  
  // Obtener proyectos
  const { data: projectsData, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .order('created_at', { ascending: false });

  if (projectsError) {
    console.error("Error fetching projects:", projectsError);
    throw new Error(projectsError.message);
  }

  if (!projectsData || projectsData.length === 0) return [];

  // Obtener los IDs únicos de creadores
  const creatorIds = [...new Set(projectsData.map(project => project.creator_id))].filter(Boolean);
  
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

  console.log("Datos de proyectos:", projectsData);
  console.log("Datos de perfiles:", profilesData);

  return projectsData.map((project: any) => {
    const profile = profilesMap.get(project.creator_id);
    
    return {
      ...project,
      creator: {
        name: profile?.display_name || profile?.name || "Anónimo",
        avatar_url: profile?.avatar_url
      }
    };
  });
};

export default function Proyectos() {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 pb-16">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display text-terra-cotta mb-2">Proyectos de la Comunidad</h1>
            <p className="text-gris-piedra">Explorá las iniciativas y productos que están creando nuestros miembros.</p>
          </div>
          <Button asChild className="bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card hover:shadow-lg">
            <Link to="/proyectos/subir">
              <Upload className="mr-2 h-4 w-4" />
              Subí tu Proyecto
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-2xl" />
            ))}
          </div>
        )}
        {isError && <p className="text-center text-rojo-oxidado">Error al cargar los proyectos. Por favor, intentá de nuevo más tarde.</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description || ''}
              vertical={(project.vertical as any) || 'Tecnología'}
              highlightImg={project.highlight_img || undefined}
              problem={project.problem || ''}
              demoUrl={project.demo_url || undefined}
              websiteUrl={project.website_url || undefined}
              repoUrl={project.repo_url || undefined}
              creatorName={project.creator?.name || 'Anónimo'}
              creatorAvatar={project.creator?.avatar_url}
            />
          ))}
        </div>
      </div>
    </>
  );
}
