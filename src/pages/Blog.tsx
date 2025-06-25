import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Blog, BlogFilters } from "@/types";
import { PenTool, Search, Filter, Clock, Eye, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const getBlogs = async (filters: BlogFilters = {}) => {
  let query = supabase
    .from("blogs")
    .select(`
      *,
      author:professional_profiles!author_id(name, display_name, avatar_url)
    `)
    .order("published_at", { ascending: false, nullsFirst: false });

  // Filtros de estado
  if (filters.status) {
    query = query.eq("status", filters.status);
  } else {
    // Por defecto, solo mostrar publicados si no hay filtro específico
    query = query.eq("status", "published");
  }

  // Filtro por autor
  if (filters.author_id) {
    query = query.eq("author_id", filters.author_id);
  }

  // Búsqueda por título
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching blogs:", error);
    throw new Error(error.message);
  }

  return data as unknown as Blog[];
};

export default function Blog() {
  const { session, profile } = useAuth();
  const [filters, setFilters] = useState<BlogFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: blogs, isLoading, isError, refetch } = useQuery({
    queryKey: ["blogs", filters],
    queryFn: () => getBlogs(filters),
    enabled: false, // Temporalmente deshabilitado hasta ejecutar migraciones
  });

  // Manejar búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm || undefined }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterChange = (key: keyof BlogFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const BlogCard = ({ blog }: { blog: Blog }) => {
    const author = Array.isArray(blog.author) ? blog.author[0] : blog.author;
    
    return (
      <article className="bg-white rounded-2xl shadow-card border border-arena p-6 hover:shadow-lg transition-shadow duration-300">
        {blog.featured_image && (
          <div className="mb-4 rounded-xl overflow-hidden">
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <h2 className="text-xl font-display font-bold text-negro-suave mb-2 line-clamp-2 hover:text-terra-cotta transition-colors">
          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h2>

        {blog.excerpt && (
          <p className="text-gris-piedra mb-4 line-clamp-3">{blog.excerpt}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gris-piedra">
          <div className="flex items-center gap-4">
            {author && (
              <div className="flex items-center gap-2">
                {author.avatar_url && (
                  <img
                    src={author.avatar_url}
                    alt={author.display_name || author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="font-medium">
                  {author.display_name || author.name}
                </span>
              </div>
            )}
            
            {blog.read_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blog.read_time} min</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views_count}</span>
            </div>
            
            {blog.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(blog.published_at), "d MMM yyyy", { locale: es })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción para el autor */}
        {session && profile && blog.author_id === session.user.id && (
          <div className="mt-4 pt-4 border-t border-arena flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to={`/blog/edit/${blog.id}`}>Editar</Link>
            </Button>
            <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
              {blog.status === 'published' ? 'Publicado' : 
               blog.status === 'draft' ? 'Borrador' : 'Archivado'}
            </Badge>
          </div>
        )}
      </article>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 pb-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display text-terra-cotta mb-2">Blog de la Comunidad</h1>
            <p className="text-gris-piedra">
              Artículos, noticias y contenido creado por la comunidad de Terreta Hub.
            </p>
          </div>
          
          {session && (
            <Button asChild className="bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card hover:shadow-lg">
              <Link to="/blog/nuevo">
                <PenTool className="mr-2 h-4 w-4" />
                Escribir Artículo
              </Link>
            </Button>
          )}
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-2xl shadow-card border border-arena p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gris-piedra w-4 h-4" />
              <Input
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por estado (solo para autores) */}
            {session && (
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Borradores</SelectItem>
                  <SelectItem value="archived">Archivados</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Filtro mis artículos */}
            {session && (
              <Select
                value={filters.author_id === session.user.id ? "mine" : ""}
                onValueChange={(value) => 
                  handleFilterChange("author_id", value === "mine" ? session.user.id : "")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Autor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los autores</SelectItem>
                  <SelectItem value="mine">Mis artículos</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Botón limpiar filtros */}
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <Filter className="w-4 h-4" />
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Lista de blogs */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center text-rojo-oxidado py-8">
            Error al cargar los artículos. Por favor, intentá de nuevo más tarde.
          </div>
        )}

        {blogs && blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-arena rounded-2xl p-8 max-w-md mx-auto">
              <PenTool className="w-16 h-16 text-gris-piedra mx-auto mb-4" />
              <h3 className="text-xl font-bold text-negro-suave mb-2">
                No hay artículos aún
              </h3>
              <p className="text-gris-piedra mb-4">
                {Object.keys(filters).length > 1 
                  ? "No se encontraron artículos con estos filtros."
                  : "Sé el primero en compartir contenido con la comunidad."
                }
              </p>
              {session && (
                <Button asChild className="bg-terra-cotta hover:bg-terra-cotta/90">
                  <Link to="/blog/nuevo">Escribir primer artículo</Link>
                </Button>
              )}
            </div>
          </div>
        )}

        {blogs && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
