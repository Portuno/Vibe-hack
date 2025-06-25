import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const RESOURCE_TYPES = [
  "video", "artículo", "podcast", "guía", "documento", "tool", "plantilla"
];

type ResourceFormData = {
  name: string;
  description: string;
  description_short: string;
  resource_type: string;
  category: string;
  url: string;
};

const createResource = async (formData: ResourceFormData) => {
  // Obtener el usuario actual
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Debes estar logueado para crear un recurso");
  }

  const { error, data } = await supabase.from("resources").insert([{
    name: formData.name,
    description: formData.description,
    description_short: formData.description_short,
    resource_type: formData.resource_type,
    category: formData.category,
    url: formData.url,
    creator_id: user.id,
    status: "publicado"
  }]).select();

  if (error) {
    throw new Error(`Error al crear recurso: ${error.message}`);
  }

  return data?.[0];
};

export function ResourceForm({ open, onOpenChange }: {
  open: boolean,
  onOpenChange: (v: boolean) => void,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    description_short: "",
    resource_type: "",
    category: "",
    tags: "",
    url: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createResourceMutation = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      // Invalidar el cache de recursos para que se recarguen automáticamente
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({
        title: "¡Recurso agregado!",
        description: "El recurso se ha añadido correctamente.",
      });
      onOpenChange(false);
      // Reset form
      setForm({
        name: "",
        description: "",
        description_short: "",
        resource_type: "",
        category: "",
        tags: "",
        url: ""
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear recurso",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createResourceMutation.mutate({
      name: form.name,
      description: form.description,
      description_short: form.description_short,
      resource_type: form.resource_type,
      category: form.category,
      url: form.url,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <DialogHeader>
            <DialogTitle>Agregar recurso</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Título</Label>
            <Input name="name" required maxLength={80} value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Descripción corta</Label>
            <Input name="description_short" required maxLength={100} value={form.description_short} onChange={handleChange} />
          </div>
          <div>
            <Label>Descripción larga</Label>
            <Textarea name="description" maxLength={350} value={form.description} onChange={handleChange} />
          </div>
          <div>
            <Label>Tipo/Formato</Label>
            <select
              name="resource_type"
              required
              className="block w-full rounded-md border p-2"
              value={form.resource_type}
              onChange={handleChange}
            >
              <option value="">Seleccionar formato...</option>
              {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <Label>Categoría / Vertical</Label>
            <Input name="category" maxLength={40} value={form.category} onChange={handleChange} />
          </div>
          <div>
            <Label>Tags (separados por coma)</Label>
            <Input name="tags" maxLength={60} value={form.tags} onChange={handleChange} placeholder="ej: innovación, salud, ux" />
          </div>
          <div>
            <Label>URL al recurso</Label>
            <Input name="url" type="url" required value={form.url} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button 
              type="submit" 
              disabled={createResourceMutation.isPending}
            >
              {createResourceMutation.isPending ? "Subiendo..." : "Agregar recurso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
