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
import NameField from "./project-form-fields/NameField";
import VerticalField from "./project-form-fields/VerticalField";
import DescriptionField from "./project-form-fields/DescriptionField";
import ProblemField from "./project-form-fields/ProblemField";
import HighlightImageField from "./project-form-fields/HighlightImageField";
import ProjectImageUploadField from "./project-form-fields/ProjectImageUploadField";
import ProjectLinksSection from "./project-form-fields/ProjectLinksSection";
import CollaborationSettingsSection from "./project-form-fields/CollaborationSettingsSection";

export const projectFormSchema = z.object({
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

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

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
          <NameField control={form.control} />
          <VerticalField control={form.control} />
          <DescriptionField control={form.control} />
          <ProblemField control={form.control} />
          <ProjectImageUploadField control={form.control} />
          <ProjectLinksSection control={form.control} />
          <CollaborationSettingsSection control={form.control} />
          <Button type="submit" className="w-full bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card py-6 text-lg font-semibold" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Subiendo proyecto..." : "Compartir mi Proyecto"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
