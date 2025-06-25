import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Blog, BlogFormData, BlogFilters } from "@/types";
import { toast } from "sonner";

// Funciones auxiliares para interactuar con la API de blogs
export const blogApi = {
  // Obtener blogs con filtros
  getBlogs: async (filters: BlogFilters = {}) => {
    let query = supabase
      .from("blogs")
      .select(`
        *,
        author:professional_profiles!author_id(name, display_name, avatar_url, bio, headline)
      `)
      .order("published_at", { ascending: false, nullsFirst: false });

    // Aplicar filtros
    if (filters.status) {
      query = query.eq("status", filters.status);
    } else {
      query = query.eq("status", "published");
    }

    if (filters.author_id) {
      query = query.eq("author_id", filters.author_id);
    }

    if (filters.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps("tags", filters.tags);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data as unknown as Blog[];
  },

  // Obtener un blog por slug
  getBlogBySlug: async (slug: string) => {
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

    return data as unknown as Blog;
  },

  // Obtener un blog por ID
  getBlogById: async (id: string) => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Blog;
  },

  // Crear un nuevo blog
  createBlog: async (blogData: BlogFormData & { author_id: string }) => {
    const { data, error } = await supabase
      .from("blogs")
      .insert(blogData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Blog;
  },

  // Actualizar un blog existente
  updateBlog: async (id: string, blogData: Partial<BlogFormData>) => {
    const { data, error } = await supabase
      .from("blogs")
      .update(blogData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Blog;
  },

  // Eliminar un blog
  deleteBlog: async (id: string) => {
    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },

  // Incrementar vistas de un blog
  incrementViews: async (blogId: string) => {
    const { error } = await supabase.rpc('increment_blog_views', { 
      blog_id: blogId 
    });
    
    if (error) {
      // Fallback si no existe la función RPC
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
  },

  // Buscar blogs por contenido
  searchBlogs: async (searchTerm: string) => {
    const { data, error } = await supabase.rpc('search_blogs', {
      search_term: searchTerm
    });

    if (error) {
      // Fallback a búsqueda simple
      return blogApi.getBlogs({ search: searchTerm });
    }

    return data as Blog[];
  },

  // Obtener blogs relacionados
  getRelatedBlogs: async (blogId: string, limit: number = 3) => {
    const { data, error } = await supabase.rpc('get_related_blogs', {
      blog_id: blogId,
      limit_count: limit
    });

    if (error) {
      // Fallback: obtener blogs recientes
      const { data: fallbackData } = await supabase
        .from("blogs")
        .select("*")
        .eq("status", "published")
        .neq("id", blogId)
        .order("published_at", { ascending: false })
        .limit(limit);
      
      return fallbackData as Blog[] || [];
    }

    return data as Blog[];
  },

  // Obtener estadísticas de autor
  getAuthorStats: async (authorId: string) => {
    const { data, error } = await supabase.rpc('get_author_blog_stats', {
      author_user_id: authorId
    });

    if (error) {
      // Fallback: calcular manualmente
      const { data: blogs } = await supabase
        .from("blogs")
        .select("status, views_count, read_time")
        .eq("author_id", authorId);

      if (!blogs) return null;

      return {
        total_blogs: blogs.length,
        published_blogs: blogs.filter(b => b.status === 'published').length,
        draft_blogs: blogs.filter(b => b.status === 'draft').length,
        total_views: blogs.reduce((sum, b) => sum + (b.views_count || 0), 0),
        avg_read_time: blogs.reduce((sum, b) => sum + (b.read_time || 0), 0) / blogs.length
      };
    }

    return data;
  },

  // Obtener tags populares
  getPopularTags: async (limit: number = 20) => {
    const { data, error } = await supabase.rpc('get_popular_tags', {
      limit_count: limit
    });

    if (error) {
      // Fallback: calcular manualmente
      const { data: blogs } = await supabase
        .from("blogs")
        .select("tags")
        .eq("status", "published")
        .not("tags", "is", null);

      if (!blogs) return [];

      const tagCounts = new Map<string, number>();
      blogs.forEach(blog => {
        blog.tags?.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      return Array.from(tagCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    }

    return data;
  },
};

// Hook para obtener lista de blogs
export const useBlogs = (filters?: BlogFilters) => {
  return useQuery({
    queryKey: ["blogs", filters],
    queryFn: () => blogApi.getBlogs(filters),
  });
};

// Hook para obtener un blog por slug
export const useBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: () => blogApi.getBlogBySlug(slug),
    enabled: !!slug,
  });
};

// Hook para obtener un blog por ID
export const useBlogById = (id: string) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogApi.getBlogById(id),
    enabled: !!id,
  });
};

// Hook para crear un blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.createBlog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Artículo creado correctamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al crear el artículo");
    },
  });
};

// Hook para actualizar un blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogFormData> }) =>
      blogApi.updateBlog(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", data.id] });
      queryClient.invalidateQueries({ queryKey: ["blog", data.slug] });
      toast.success("Artículo actualizado correctamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar el artículo");
    },
  });
};

// Hook para eliminar un blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Artículo eliminado correctamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el artículo");
    },
  });
};

// Hook para obtener blogs relacionados
export const useRelatedBlogs = (blogId: string, limit?: number) => {
  return useQuery({
    queryKey: ["related-blogs", blogId, limit],
    queryFn: () => blogApi.getRelatedBlogs(blogId, limit),
    enabled: !!blogId,
  });
};

// Hook para obtener estadísticas de autor
export const useAuthorStats = (authorId: string) => {
  return useQuery({
    queryKey: ["author-stats", authorId],
    queryFn: () => blogApi.getAuthorStats(authorId),
    enabled: !!authorId,
  });
};

// Hook para obtener tags populares
export const usePopularTags = (limit?: number) => {
  return useQuery({
    queryKey: ["popular-tags", limit],
    queryFn: () => blogApi.getPopularTags(limit),
  });
}; 