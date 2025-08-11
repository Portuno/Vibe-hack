import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Resource } from "@/components/ResourceCard";
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  User,
  BookOpen,
  Video,
  Podcast,
  FileText,
  FileCode,
  FileSpreadsheet,
  Share2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

type ResourceAuthor = {
  name: string;
  avatar_url?: string;
  bio?: string;
  headline?: string;
  user_id?: string;
};

const ICONS: Record<string, JSX.Element> = {
  "video": <Video className="text-mediterraneo w-8 h-8" />,
  "artículo": <BookOpen className="text-mediterraneo w-8 h-8" />,
  "podcast": <Podcast className="text-mediterraneo w-8 h-8" />,
  "guía": <FileText className="text-mediterraneo w-8 h-8" />,
  "documento": <FileSpreadsheet className="text-mediterraneo w-8 h-8" />,
  "tool": <FileCode className="text-mediterraneo w-8 h-8" />,
  "plantilla": <FileSpreadsheet className="text-mediterraneo w-8 h-8" />,
};

const getResourceById = async (id: string): Promise<Resource> => {
  // Obtener el recurso
  const { data: resourceData, error: resourceError } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();

  if (resourceError) {
    throw new Error(resourceError.message);
  }

  // Obtener información del autor
  let author: ResourceAuthor = { name: "Sin nombre", avatar_url: undefined };
  
  if (resourceData.creator_id) {
    const { data: profile } = await supabase
      .from("professional_profiles")
      .select("user_id, name, display_name, avatar_url, bio, headline")
      .eq("user_id", resourceData.creator_id)
      .single();

    if (profile) {
      author = {
        name: profile.display_name || profile.name || "Sin nombre",
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        headline: profile.headline,
        user_id: profile.user_id
      };
    }
  }

  return {
    ...resourceData,
    tags: [], // Por ahora tags vacío hasta que se agregue la columna
    author
  };
};

export default function RecursoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: resource, isLoading, isError } = useQuery({
    queryKey: ["resource", id],
    queryFn: () => getResourceById(id!),
    enabled: !!id,
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource?.name,
          text: resource?.description_short || resource?.name,
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

  const handleVisitResource = () => {
    if (resource?.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
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
            <Skeleton className="h-32 w-full rounded-xl" />
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

  if (isError || !resource) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto mt-10 pb-16">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-negro-suave mb-4">
              Recurso no encontrado
            </h1>
            <p className="text-gris-piedra mb-6">
              El recurso que buscas no existe o ha sido eliminado.
            </p>
            <Button asChild className="bg-terra-cotta hover:bg-terra-cotta/90">
              <Link to="/recursos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a recursos
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const icon = ICONS[resource.resource_type?.toLowerCase()] || <BookOpen className="text-mediterraneo w-8 h-8" />;

  return (
    <>
      <Navbar />
      <article className="container mx-auto mt-10 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Navegación */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate("/recursos")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a recursos
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              
              {resource.url && (
                <Button 
                  size="sm" 
                  className="bg-terra-cotta hover:bg-terra-cotta/90"
                  onClick={handleVisitResource}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver recurso original
                </Button>
              )}
            </div>
          </div>

          {/* Cabecera del recurso */}
          <header className="mb-8">
            {/* Icono y tipo */}
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-2xl bg-arena p-4 flex items-center justify-center">
                {icon}
              </div>
              <div>
                <Badge variant="outline" className="border-terra-cotta text-terra-cotta text-sm px-3 py-1">
                  {resource.resource_type}
                </Badge>
                {resource.category && (
                  <div className="text-gris-piedra text-sm mt-1">{resource.category}</div>
                )}
              </div>
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-negro-suave mb-6 leading-tight">
              {resource.name}
            </h1>

            {/* Resumen corto */}
            {resource.description_short && (
              <div className="text-lg text-gris-piedra border-l-4 border-terra-cotta pl-6 mb-6">
                {resource.description_short}
              </div>
            )}

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gris-piedra mb-6">
              {/* Autor */}
              {resource.author && (
                <div className="flex items-center gap-2">
                  {resource.author.avatar_url ? (
                    <img
                      src={resource.author.avatar_url}
                      alt={resource.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-arena flex items-center justify-center">
                      <User className="w-5 h-5 text-gris-piedra" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-negro-suave">
                      {resource.author.name}
                    </div>
                    {resource.author.headline && (
                      <div className="text-xs text-gris-piedra">
                        {resource.author.headline}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fecha de creación */}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  Agregado el {format(new Date(resource.created_at), "d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
            </div>
          </header>

          {/* Descripción completa */}
          {resource.description && (
            <div className="bg-white rounded-2xl shadow-card border border-arena p-8 mb-8">
              <h2 className="text-2xl font-display font-bold text-negro-suave mb-4">
                Sobre este recurso
              </h2>
              <div 
                className="prose prose-lg max-w-none prose-headings:text-negro-suave prose-p:text-negro-suave prose-a:text-terra-cotta prose-strong:text-negro-suave"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {resource.description}
              </div>
            </div>
          )}

          {/* Información del autor */}
          {resource.author && (
            <div className="bg-white rounded-2xl shadow-card border border-arena p-8">
              <h3 className="text-xl font-display font-bold text-negro-suave mb-4">
                Compartido por
              </h3>
              
              <div className="flex items-start gap-4">
                {resource.author.avatar_url ? (
                  <img
                    src={resource.author.avatar_url}
                    alt={resource.author.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-arena flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gris-piedra" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-bold text-negro-suave text-lg">
                    {resource.author.name}
                  </h4>
                  
                  {resource.author.headline && (
                    <p className="text-terra-cotta font-medium mb-2">
                      {resource.author.headline}
                    </p>
                  )}
                  
                  {resource.author.bio && (
                    <p className="text-gris-piedra">
                      {resource.author.bio}
                    </p>
                  )}
                  
                  {resource.author.user_id && (
                    <Button asChild variant="outline" size="sm" className="mt-4">
                      <Link to={`/profesionales/${resource.author.user_id}`}>
                        Ver perfil completo
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
