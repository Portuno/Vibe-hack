
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VERTICALS = ["Tecnología", "Derecho", "Finanzas", "Salud", "Arte", "Comunidad", "Innovación"];
const LEVELS = ["Básico", "Intermedio", "Avanzado"];
const TYPES = ["Gratuito", "Pago"];

export function CourseFormDialog({ onCourseAdded }: { onCourseAdded?: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vertical, setVertical] = useState(VERTICALS[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [type, setType] = useState(TYPES[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imagePublicUrl = "";
    if (imageFile) {
      const filename = `courses/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filename, imageFile, { upsert: true });
      if (uploadError) {
        toast({ title: "Error al subir imagen", description: uploadError.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      // obtén la URL pública
      const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
      imagePublicUrl = data.publicUrl;
    }

    // obtener id de usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    const creator_id = user?.id;

    const { error } = await supabase.from("courses").insert({
      name,
      description,
      vertical,
      level,
      type,
      creator_id,
      url: imagePublicUrl || null,
      // Puedes añadir otros campos si tu tabla los requiere
    });

    setLoading(false);

    if (error) {
      toast({ title: "Error al crear curso", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "¡Curso publicado!", description: "Se ha subido tu curso correctamente." });
    setOpen(false);
    if (onCourseAdded) onCourseAdded();
    // Reset fields
    setName(""); setDescription(""); setLevel(LEVELS[0]); setVertical(VERTICALS[0]); setType(TYPES[0]); setImageFile(null); setImageUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 text-base font-semibold bg-terra-cotta hover:bg-terra-cotta/80 shadow hover-scale transition" size="lg">
          Subir un curso
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Subir nuevo curso</DialogTitle></DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm">Nombre del curso<span className="text-terra-cotta">*</span></label>
            <Input required value={name} onChange={e => setName(e.target.value)} maxLength={70} />
          </div>
          <div>
            <label className="text-sm">Descripción<span className="text-terra-cotta">*</span></label>
            <Textarea required value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm">Vertical</label>
              <select className="w-full border rounded-md p-2" value={vertical} onChange={e => setVertical(e.target.value)}>
                {VERTICALS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm">Nivel</label>
              <select className="w-full border rounded-md p-2" value={level} onChange={e => setLevel(e.target.value)}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm">Tipo</label>
              <select className="w-full border rounded-md p-2" value={type} onChange={e => setType(e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm">Imagen del curso</label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {imageUrl && <img src={imageUrl} alt="preview" className="mt-2 w-24 h-24 object-cover rounded" />}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Subiendo..." : "Subir curso"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
