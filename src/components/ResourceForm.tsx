
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

const RESOURCE_TYPES = [
  "video", "artículo", "podcast", "guía", "documento", "tool", "plantilla"
];

export function ResourceForm({ open, onOpenChange, onCreated }: {
  open: boolean,
  onOpenChange: (v: boolean) => void,
  onCreated?: () => void
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    description_short: "",
    resource_type: "",
    category: "",
    tags: "",
    url: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Procesar tags (separar por coma, quitar espacios etc)
    // let tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    // Eliminar por completo el uso de tags ya que la tabla no la soporta

    const { error } = await supabase.from("resources").insert([{
      name: form.name,
      description: form.description,
      description_short: form.description_short,
      resource_type: form.resource_type,
      category: form.category,
      // tags: tags, // ELIMINADO: la tabla no soporta esta columna
      url: form.url,
      creator_id: "f2317142-17c1-4b12-817a-853b03645398", // temp id
      status: "publicado"
    }]);
    setLoading(false);
    if (!error) {
      onOpenChange(false);
      onCreated?.();
    } else {
      alert("Error al subir recurso: " + error.message);
    }
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
            <Button type="submit" disabled={loading}>
              {loading ? "Subiendo..." : "Agregar recurso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
