
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/ProjectCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const getProjects = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      professional_profiles!projects_creator_id_fkey (
        display_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    throw new Error(error.message);
  }
  return data;
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
              name={project.name}
              description={project.description || ''}
              vertical={(project.vertical as any) || 'Tecnología'}
              highlightImg={project.highlight_img || undefined}
              problem={project.problem || ''}
              demoUrl={project.demo_url || undefined}
              websiteUrl={project.website_url || undefined}
              repoUrl={project.repo_url || undefined}
              creatorName={project.professional_profiles?.display_name || 'Usuario sin perfil'}
              creatorAvatar={project.professional_profiles?.avatar_url || undefined}
            />
          ))}
        </div>
      </div>
    </>
  );
}
