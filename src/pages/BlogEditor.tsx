import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Blog, BlogFormData } from "@/types";
import { 
  Save, 
  Eye, 
  Upload, 
  X, 
  Plus, 
  ArrowLeft,
  Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const blogSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(200, "El título no puede tener más de 200 caracteres"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  excerpt: z.string().max(280, "El resumen no puede tener más de 280 caracteres").optional(),
  featured_image: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.string()),
});

type BlogFormSchema = z.infer<typeof blogSchema>;

const getBlog = async (id: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Blog;
};

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [newTag, setNewTag] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Cargar blog existente si estamos editando
  const { data: blog, isLoading: isLoadingBlog } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlog(id!),
    enabled: isEditing,
  });

  const form = useForm<BlogFormSchema>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      featured_image: "",
      status: "draft",
      tags: [],
    },
  });

  // Cargar datos del blog en el formulario si estamos editando
  useEffect(() => {
    if (blog && isEditing) {
      form.reset({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt || "",
        featured_image: blog.featured_image || "",
        status: blog.status,
        tags: blog.tags || [],
      });
    }
  }, [blog, isEditing, form]);

  // Verificar autenticación y onboarding
  useEffect(() => {
    // No hacer nada mientras se está cargando la autenticación
    if (loading) return;

    if (!session) {
      // Guardar la URL actual para volver después del login
      const currentPath = window.location.pathname;
      navigate(`/auth?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Si estamos editando, verificar que el usuario es el autor
    if (isEditing && blog && blog.author_id !== session.user.id) {
      toast.error("No tienes permisos para editar este artículo");
      navigate("/blog");
      return;
    }
  }, [session, blog, isEditing, navigate, loading]);

  // Mutación para crear/actualizar blog
  const saveBlogMutation = useMutation({
    mutationFn: async (data: BlogFormSchema) => {
      const blogData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        featured_image: data.featured_image || null,
        status: data.status,
        tags: data.tags,
        author_id: session!.user.id,
      };

      if (isEditing) {
        const { data: updatedBlog, error } = await supabase
          .from("blogs")
          .update({
            title: blogData.title,
            content: blogData.content,
            excerpt: blogData.excerpt,
            featured_image: blogData.featured_image,
            status: blogData.status,
            tags: blogData.tags,
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return updatedBlog;
      } else {
        const { data: newBlog, error } = await supabase
          .from("blogs")
          .insert({
            title: blogData.title,
            content: blogData.content,
            excerpt: blogData.excerpt,
            featured_image: blogData.featured_image,
            status: blogData.status,
            tags: blogData.tags,
            author_id: blogData.author_id,
            slug: '', // Proporcionar slug vacío - será reemplazado por el trigger
          })
          .select()
          .single();

        if (error) throw error;
        return newBlog;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", data.id] });
      
      toast.success(isEditing ? "Artículo actualizado correctamente" : "Artículo creado correctamente");
      navigate(`/blog/${data.slug}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al guardar el artículo");
    },
  });

  // Mutación para eliminar blog
  const deleteBlogMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Artículo eliminado correctamente");
      navigate("/blog");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el artículo");
    },
  });

  const onSubmit = (data: BlogFormSchema) => {
    saveBlogMutation.mutate(data);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.getValues("tags").includes(newTag.trim())) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede ser mayor a 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${session!.user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      form.setValue("featured_image", publicUrl.publicUrl);
      toast.success("Imagen subida correctamente");
    } catch (error: any) {
      toast.error(error.message || "Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
      deleteBlogMutation.mutate();
    }
  };

  // Loading state
  if (isEditing && isLoadingBlog) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto mt-10 pb-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return null; // Navegación ya manejada en useEffect
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/blog")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al blog
              </Button>
              <h1 className="text-3xl font-display text-terra-cotta">
                {isEditing ? "Editar Artículo" : "Nuevo Artículo"}
              </h1>
            </div>
            
            {isEditing && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteBlogMutation.isPending}
              >
                {deleteBlogMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Eliminar
              </Button>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-white rounded-2xl shadow-card border border-arena p-8 space-y-6">
                {/* Título */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del Artículo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Escribe un título atractivo..."
                          className="text-lg"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Resumen */}
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumen (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Un breve resumen que aparecerá en las tarjetas de vista previa..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Máximo 280 caracteres. Se mostrará en las tarjetas de vista previa.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Imagen destacada */}
                <FormField
                  control={form.control}
                  name="featured_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen Destacada</FormLabel>
                      <div className="space-y-4">
                        <FormControl>
                          <Input 
                            placeholder="URL de la imagen destacada..."
                            {...field} 
                          />
                        </FormControl>
                        
                        <div className="flex items-center gap-4">
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <div className="flex items-center gap-2 px-4 py-2 border border-arena rounded-lg hover:bg-arena transition-colors">
                              <Upload className="w-4 h-4" />
                              {isUploading ? "Subiendo..." : "Subir imagen"}
                            </div>
                          </Label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </div>

                        {field.value && (
                          <div className="relative inline-block">
                            <img 
                              src={field.value} 
                              alt="Vista previa" 
                              className="max-w-xs h-32 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => form.setValue("featured_image", "")}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etiquetas</FormLabel>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Añadir etiqueta..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleAddTag}
                            disabled={!newTag.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((tag) => (
                              <Badge key={tag} variant="secondary" className="gap-1">
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormDescription>
                        Añade etiquetas para categorizar tu artículo y facilitar su búsqueda.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Estado */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de Publicación</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                          <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Solo los artículos "Publicados" serán visibles para otros usuarios.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contenido */}
              <div className="bg-white rounded-2xl shadow-card border border-arena p-8">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenido del Artículo</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Escribe aquí el contenido de tu artículo... Puedes usar Markdown para dar formato."
                          className="min-h-[500px] font-mono text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Puedes usar formato Markdown. El tiempo de lectura se calculará automáticamente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/blog")}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  className="bg-terra-cotta hover:bg-terra-cotta/90"
                  disabled={saveBlogMutation.isPending}
                >
                  {saveBlogMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Actualizar" : "Guardar"} Artículo
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
