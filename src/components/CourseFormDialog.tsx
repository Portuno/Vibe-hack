import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const VERTICALS = ["Tecnología", "Derecho", "Finanzas", "Salud", "Arte", "Comunidad", "Innovación"];
const LEVELS = ["Básico", "Intermedio", "Avanzado"];
const TYPES = ["Gratuito", "Pago"];

type CourseFormData = {
  name: string;
  description: string;
  vertical: string;
  level: string;
  type: string;
  imageFile: File | null;
};

const createCourse = async ({ name, description, vertical, level, type, imageFile }: CourseFormData) => {
  console.log("Iniciando proceso de creación de curso...");

  let imagePublicUrl = "";
  if (imageFile) {
    console.log("Subiendo imagen:", imageFile.name, "Tamaño:", imageFile.size);
    
    // Generar nombre único para el archivo
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `courses/${fileName}`;
    
    console.log("Ruta del archivo:", filePath);
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("avatars")
      .upload(filePath, imageFile, { upsert: true });
    
    console.log("Resultado de upload:", { uploadError, uploadData });
    
    if (uploadError) {
      console.error("Error detallado de upload:", uploadError);
      throw new Error(`Error al subir imagen: ${uploadError.message}`);
    }
    
    // obtén la URL pública
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    imagePublicUrl = data.publicUrl;
    console.log("URL pública generada:", imagePublicUrl);
  }

  // obtener id de usuario actual
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  const creator_id = user?.id;

  console.log("Usuario autenticado:", { user: user?.email, creator_id });

  // Si hay error autenticando, mostrarlo
  if (authError || !creator_id) {
    console.error("Error de autenticación:", authError);
    throw new Error("Debes estar logueado para crear un curso");
  }

  // Insertar curso con los campos correctos
  console.log("Insertando curso con datos:", {
    name,
    description,
    vertical,
    level,
    type,
    creator_id,
    url: imagePublicUrl || null,
    category: vertical
  });

  const { error, data: insertedData } = await supabase.from("courses").insert({
    name,
    description,
    vertical,
    level,
    type,
    creator_id,
    url: imagePublicUrl || null,
    category: vertical,
  }).select();

  console.log("Resultado de inserción:", { error, insertedData });

  if (error) {
    console.error("Error al crear curso:", error);
    throw new Error(`Error al crear curso: ${error.message}`);
  }
  
  console.log("Curso creado exitosamente");
  return insertedData?.[0];
};

export function CourseFormDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vertical, setVertical] = useState(VERTICALS[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [type, setType] = useState(TYPES[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      // Invalidar el cache de cursos para que se recarguen automáticamente
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ 
        title: "¡Curso publicado!", 
        description: "Se ha subido tu curso correctamente." 
      });
      setOpen(false);
      // Reset fields
      setName(""); 
      setDescription(""); 
      setLevel(LEVELS[0]); 
      setVertical(VERTICALS[0]); 
      setType(TYPES[0]); 
      setImageFile(null); 
      setImageUrl("");
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error al crear curso", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createCourseMutation.mutate({
      name,
      description,
      vertical,
      level,
      type,
      imageFile,
    });
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
            <Button 
              type="submit" 
              disabled={createCourseMutation.isPending}
            >
              {createCourseMutation.isPending ? "Subiendo..." : "Subir curso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
