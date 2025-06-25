import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Blog } from "@/types";
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Calendar, 
  Edit,
  Share2,
  User
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const getBlogBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .select(`
      *,
      author:professional_profiles!author_id(name, display_name, avatar_url, bio, headline)
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Blog;
};

const incrementViews = async (blogId: string) => {
  const { error } = await supabase.rpc('increment_blog_views', { 
    blog_id: blogId 
  });
  
  if (error) {
    // Si no existe la función RPC, usar una actualización simple
    const { data: currentBlog } = await supabase
      .from("blogs")
      .select("views_count")
      .eq("id", blogId)
      .single();
    
    if (currentBlog) {
      await supabase
        .from("blogs")
        .update({ views_count: (currentBlog.views_count || 0) + 1 })
        .eq("id", blogId);
    }
  }
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const queryClient = useQueryClient();
  const [hasIncrementedViews, setHasIncrementedViews] = useState(false);

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => getBlogBySlug(slug!),
    enabled: !!slug,
  });

  // Incrementar vistas una sola vez cuando se carga el blog
  useEffect(() => {
    if (blog && !hasIncrementedViews && blog.status === 'published') {
      incrementViews(blog.id);
      setHasIncrementedViews(true);
    }
  }, [blog, hasIncrementedViews]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt || blog?.title,
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

  if (isError || !blog) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto mt-10 pb-16">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-negro-suave mb-4">
              Artículo no encontrado
            </h1>
            <p className="text-gris-piedra mb-6">
              El artículo que buscas no existe o ha sido eliminado.
            </p>
            <Button asChild className="bg-terra-cotta hover:bg-terra-cotta/90">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al blog
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Verificar si el usuario puede ver este blog
  const canView = 
    blog.status === 'published' || 
    (session && blog.author_id === session.user.id);

  if (!canView) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto mt-10 pb-16">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-negro-suave mb-4">
              Artículo no disponible
            </h1>
            <p className="text-gris-piedra mb-6">
              Este artículo no está publicado o no tienes permisos para verlo.
            </p>
            <Button asChild className="bg-terra-cotta hover:bg-terra-cotta/90">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al blog
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const author = Array.isArray(blog.author) ? blog.author[0] : blog.author;
  const isAuthor = session && blog.author_id === session.user.id;

  return (
    <>
      <Navbar />
      <article className="container mx-auto mt-10 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Navegación */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate("/blog")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al blog
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              
              {isAuthor && (
                <Button asChild size="sm" variant="outline">
                  <Link to={`/blog/edit/${blog.id}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Cabecera del artículo */}
          <header className="mb-8">
            {/* Estado del artículo (solo para el autor) */}
            {isAuthor && blog.status !== 'published' && (
              <div className="mb-4">
                <Badge variant={blog.status === 'draft' ? 'secondary' : 'destructive'}>
                  {blog.status === 'draft' ? 'Borrador' : 'Archivado'}
                </Badge>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-negro-suave mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gris-piedra mb-6">
              {/* Autor */}
              {author && (
                <div className="flex items-center gap-2">
                  {author.avatar_url ? (
                    <img
                      src={author.avatar_url}
                      alt={author.display_name || author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-arena flex items-center justify-center">
                      <User className="w-5 h-5 text-gris-piedra" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-negro-suave">
                      {author.display_name || author.name}
                    </div>
                    {author.headline && (
                      <div className="text-xs text-gris-piedra">
                        {author.headline}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fecha de publicación */}
              {blog.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(blog.published_at), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </span>
                </div>
              )}

              {/* Tiempo de lectura */}
              {blog.read_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.read_time} min de lectura</span>
                </div>
              )}

              {/* Vistas */}
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views_count} vistas</span>
              </div>
            </div>

            {/* Resumen */}
            {blog.excerpt && (
              <div className="text-lg text-gris-piedra italic border-l-4 border-terra-cotta pl-6 mb-8">
                {blog.excerpt}
              </div>
            )}
          </header>

          {/* Imagen destacada */}
          {blog.featured_image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-card">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}

          {/* Contenido del artículo */}
          <div className="bg-white rounded-2xl shadow-card border border-arena p-8 mb-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-negro-suave prose-p:text-negro-suave prose-a:text-terra-cotta prose-strong:text-negro-suave prose-blockquote:border-terra-cotta prose-blockquote:text-gris-piedra"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {blog.content}
            </div>
          </div>

          {/* Información del autor */}
          {author && (
            <div className="bg-white rounded-2xl shadow-card border border-arena p-8">
              <h3 className="text-xl font-display font-bold text-negro-suave mb-4">
                Sobre el autor
              </h3>
              
              <div className="flex items-start gap-4">
                {author.avatar_url ? (
                  <img
                    src={author.avatar_url}
                    alt={author.display_name || author.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-arena flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gris-piedra" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-bold text-negro-suave text-lg">
                    {author.display_name || author.name}
                  </h4>
                  
                  {author.headline && (
                    <p className="text-terra-cotta font-medium mb-2">
                      {author.headline}
                    </p>
                  )}
                  
                  {author.bio && (
                    <p className="text-gris-piedra">
                      {author.bio}
                    </p>
                  )}
                  
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link to={`/profesionales/${author.id || blog.author_id}`}>
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