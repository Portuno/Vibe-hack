import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const projectFormSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }).max(100, {
    message: "El nombre no puede tener más de 100 caracteres."
  }),
  description: z.string().max(500, {
    message: "La descripción no puede tener más de 500 caracteres."
  }).optional(),
  problem: z.string().max(280, {
    message: "El problema no puede tener más de 280 caracteres."
  }).optional(),
  vertical: z.enum(["Tecnología", "Arte", "Legal", "Educación", "Ciencia", "Social"], {
    required_error: "Por favor, selecciona un vertical."
  }),
  highlight_img: z.string().url({ message: "Por favor, introduce una URL válida para la imagen." }).optional().or(z.literal('')),
  demo_url: z.string().url({ message: "Por favor, introduce una URL válida para la demo." }).optional().or(z.literal('')),
  repo_url: z.string().url({ message: "Por favor, introduce una URL válida para el repositorio." }).optional().or(z.literal('')),
  website_url: z.string().url({ message: "Por favor, introduce una URL válida para el sitio web." }).optional().or(z.literal('')),
  open_to_feedback: z.boolean().default(false),
  wants_to_monetize: z.boolean().default(false),
  wants_updates: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function ProjectForm() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      problem: "",
      open_to_feedback: true,
      wants_to_monetize: false,
      wants_updates: false,
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    if (!session?.user) {
      toast.error("Debes iniciar sesión para crear un proyecto.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("projects").insert({
        name: values.name,
        description: values.description,
        problem: values.problem,
        vertical: values.vertical,
        highlight_img: values.highlight_img,
        demo_url: values.demo_url,
        repo_url: values.repo_url,
        website_url: values.website_url,
        open_to_feedback: values.open_to_feedback,
        wants_to_monetize: values.wants_to_monetize,
        wants_updates: values.wants_updates,
        creator_id: session.user.id,
      });

      if (error) {
        throw error;
      }

      toast.success("¡Proyecto subido con éxito!");
      navigate("/proyectos");
    } catch (error: any) {
      console.error("Error submitting project:", error);
      toast.error("Hubo un error al subir el proyecto. Por favor, intentá de nuevo.", {
        description: error.message || "Error desconocido",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (!session) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-arena text-center">
        <h3 className="text-xl font-bold mb-2 text-terra-cotta">Acceso Restringido</h3>
        <p className="text-gris-piedra">
          Necesitás <a href="/auth" className="text-terra-cotta underline">iniciar sesión</a> o <a href="/auth" className="text-terra-cotta underline">crear una cuenta</a> para poder subir un proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-arena">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Proyecto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Terreta Hub" {...field} />
                </FormControl>
                <FormDescription>
                  El nombre que identificará tu proyecto en la comunidad.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vertical"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vertical / Sector</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná el sector principal de tu proyecto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-crema">
                    <SelectItem value="Tecnología">Tecnología</SelectItem>
                    <SelectItem value="Arte">Arte</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Educación">Educación</SelectItem>
                    <SelectItem value="Ciencia">Ciencia</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Ayuda a clasificar tu proyecto y a que otros lo encuentren.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción Corta</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contá en pocas palabras de qué se trata tu proyecto, qué hace y para quién es."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                 <FormDescription>
                  Este es el 'elevator pitch' de tu proyecto. (Máx 500 caracteres)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problema que Resuelve</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Falta de conexión entre profesionales creativos en Valencia." {...field} />
                </FormControl>
                 <FormDescription>
                  ¿Qué necesidad o problema específico aborda tu iniciativa? (Máx 280 caracteres)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highlight_img"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la Imagen Principal</FormLabel>
                <FormControl>
                  <Input placeholder="https://unsplash.com/foto.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  Una imagen vale más que mil palabras. Pegá una URL a una imagen que represente tu proyecto.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
             <h3 className="text-lg font-medium text-negro-suave">Links del Proyecto</h3>
             <FormField
                control={form.control}
                name="website_url"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Sitio Web / Landing Page</FormLabel>
                    <FormControl>
                    <Input placeholder="https://tuproyecto.com" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="demo_url"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Demo / Prototipo</FormLabel>
                    <FormControl>
                    <Input placeholder="https://figma.com/proto/..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="repo_url"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Repositorio (GitHub, etc.)</FormLabel>
                    <FormControl>
                    <Input placeholder="https://github.com/usuario/proyecto" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>


          <div className="space-y-4">
            <h3 className="text-lg font-medium text-negro-suave">Ajustes de Colaboración</h3>
            <FormField
              control={form.control}
              name="open_to_feedback"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Abierto a recibir feedback
                    </FormLabel>
                    <FormDescription>
                      Marcá esta opción si te gustaría que otros miembros te den su opinión.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wants_to_monetize"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Buscando monetizar
                    </FormLabel>
                    <FormDescription>
                      ¿Estás explorando formas de generar ingresos con este proyecto?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card py-6 text-lg font-semibold" disabled={isSubmitting}>
             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Subiendo proyecto..." : "Compartir mi Proyecto"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
