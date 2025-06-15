
import { useRef, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Control, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProjectFormValues } from "../ProjectForm";

interface Props {
  control: Control<ProjectFormValues>;
}

export default function ProjectImageUploadField({ control }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { setValue } = useFormContext<ProjectFormValues>();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    toast.info("Subiendo imagen...");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error } = await supabase.storage
      .from("project-images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      setUploading(false);
      toast.error("No se pudo subir la imagen.");
      return;
    }

    // Obtener URL pública
    const { data } = supabase.storage.from("project-images").getPublicUrl(filePath);

    if (data?.publicUrl) {
      setValue("highlight_img", data.publicUrl, { shouldValidate: true });
      setPreview(data.publicUrl);
      toast.success("Imagen subida correctamente.");
    } else {
      toast.error("No se pudo obtener la URL de la imagen.");
    }
    setUploading(false);
  };

  return (
    <FormField
      control={control}
      name="highlight_img"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Imagen Principal</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? "Subiendo..." : "Subir imagen"}
              </Button>
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              {/* Imagen previsualización */}
              {(field.value || preview) && (
                <img src={field.value || preview!} alt="Previsualización" className="mt-2 w-full max-w-xs rounded shadow" />
              )}
            </div>
          </FormControl>
          <FormDescription>
            Seleccioná una imagen para tu proyecto. Formato recomendado: JPG o PNG.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
