import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  User,
  Github,
  Globe,
  Play,
  Share2,
  Target
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string;
  vertical: "Legal" | "Arte" | "Tecnología" | "Educación" | "Ciencia" | "Social";
  highlight_img?: string;
  problem: string;
  demo_url?: string;
  website_url?: string;
  repo_url?: string;
  creator_id: string;
  created_at: string;
  creator?: {
    name: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
    headline?: string;
    user_id: string;
  };
}

const getProjectById = async (id: string): Promise<Project> => {
  console.log("🔍 Obteniendo proyecto por ID:", id);

  // Obtener el proyecto
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  console.log("📊 Respuesta del proyecto:", { projectData, error: projectError });

  if (projectError) {
    console.error("❌ Error fetching project:", projectError);
    throw new Error(projectError.message);
  }

  if (!projectData) {
    throw new Error("Proyecto no encontrado");
  }

  console.log("✅ Proyecto obtenido exitosamente");

  // Obtener información del creador
  let creatorData = null;
  if (projectData.creator_id) {
    console.log("👤 Obteniendo datos del creador:", projectData.creator_id);
    
    const { data: creator, error: creatorError } = await supabase
      .from("professional_profiles")
      .select("user_id, name, display_name, avatar_url, bio, headline")
      .eq("user_id", projectData.creator_id)
      .single();

    if (creatorError) {
      console.error("⚠️ Error fetching creator (continuando sin datos de creador):", creatorError);
    } else {
      console.log("👤 Creador obtenido:", creator?.display_name || creator?.name);
      creatorData = creator;
    }
  }

  // Combinar los datos
  const projectWithCreator = {
    ...projectData,
    creator: creatorData
  };

  console.log("🎯 Proyecto final con creador:", projectWithCreator.name);
  
  return projectWithCreator as Project;
};

export default function ProyectoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id!),
    enabled: !!id,
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.name,
          text: project?.description || project?.name,
          url: window.location.href,
        });
      } catch (error) {
        // Usuario canceló el share
      }
    } else {
      // Fallback: copiar URL al portapapeles
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Enlace copiado al portapapeles");
      } catch (error) {
        toast.error("No se pudo copiar el enlace");
      }
    }
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto mt-10 pb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isError || !project) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto mt-10 pb-16">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-negro-suave mb-4">
              Proyecto no encontrado
            </h1>
            <p className="text-gris-piedra mb-6">
              El proyecto que buscas no existe o ha sido eliminado.
            </p>
            <Button asChild className="bg-terra-cotta hover:bg-terra-cotta/90">
              <Link to="/proyectos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a proyectos
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <article className="container mx-auto mt-10 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Navegación */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate("/proyectos")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a proyectos
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>

          {/* Cabecera del proyecto */}
          <header className="mb-8">
            {/* Badge del vertical */}
            <div className="flex items-center gap-4 mb-6">
              <Badge label={project.vertical} vertical={project.vertical} />
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-negro-suave mb-6 leading-tight">
              {project.name}
            </h1>

            {/* Descripción */}
            {project.description && (
              <div className="text-lg text-gris-piedra border-l-4 border-terra-cotta pl-6 mb-6">
                {project.description}
              </div>
            )}

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gris-piedra mb-6">
              {/* Creador */}
              {project.creator && (
                <div className="flex items-center gap-2">
                  {project.creator.avatar_url ? (
                    <img
                      src={project.creator.avatar_url}
                      alt={project.creator.display_name || project.creator.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-arena flex items-center justify-center">
                      <User className="w-5 h-5 text-gris-piedra" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-negro-suave">
                      {project.creator.display_name || project.creator.name}
                    </div>
                    {project.creator.headline && (
                      <div className="text-xs text-gris-piedra">
                        {project.creator.headline}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fecha de creación */}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  Publicado el {format(new Date(project.created_at), "d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
            </div>
          </header>

          {/* Imagen destacada */}
          {project.highlight_img && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-card">
              <img
                src={project.highlight_img}
                alt={project.name}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}

          {/* Problema que resuelve */}
          {project.problem && (
            <div className="bg-white rounded-2xl shadow-card border border-arena p-8 mb-8">
              <h2 className="text-2xl font-display font-bold text-negro-suave mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-terra-cotta" />
                Problema que resuelve
              </h2>
              <div 
                className="prose prose-lg max-w-none prose-headings:text-negro-suave prose-p:text-negro-suave prose-a:text-terra-cotta prose-strong:text-negro-suave"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {project.problem}
              </div>
            </div>
          )}

          {/* Enlaces del proyecto */}
          {(project.website_url || project.demo_url || project.repo_url) && (
            <div className="bg-white rounded-2xl shadow-card border border-arena p-8 mb-8">
              <h2 className="text-2xl font-display font-bold text-negro-suave mb-4">
                Enlaces del proyecto
              </h2>
              
              <div className="flex flex-wrap gap-4">
                {project.website_url && (
                  <Button 
                    asChild 
                    className="bg-terra-cotta hover:bg-terra-cotta/90"
                  >
                    <a
                      href={project.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Sitio Web
                    </a>
                  </Button>
                )}
                
                {project.demo_url && (
                  <Button 
                    asChild 
                    variant="outline"
                  >
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Ver Demo
                    </a>
                  </Button>
                )}
                
                {project.repo_url && (
                  <Button 
                    asChild 
                    variant="outline"
                  >
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Repositorio
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Información del creador */}
          {project.creator && (
            <div className="bg-white rounded-2xl shadow-card border border-arena p-8">
              <h3 className="text-xl font-display font-bold text-negro-suave mb-4">
                Sobre el creador
              </h3>
              
              <div className="flex items-start gap-4">
                {project.creator.avatar_url ? (
                  <img
                    src={project.creator.avatar_url}
                    alt={project.creator.display_name || project.creator.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-arena flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gris-piedra" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-bold text-negro-suave text-lg">
                    {project.creator.display_name || project.creator.name}
                  </h4>
                  
                  {project.creator.headline && (
                    <p className="text-terra-cotta font-medium mb-2">
                      {project.creator.headline}
                    </p>
                  )}
                  
                  {project.creator.bio && (
                    <p className="text-gris-piedra">
                      {project.creator.bio}
                    </p>
                  )}
                  
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link to={`/profesionales/${project.creator.user_id}`}>
                      Ver perfil completo
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
} 