
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  onProfileUpdated: (updated: Profile) => void;
}

const VERTICAL_OPTIONS = [
  "Tecnología", "Derecho", "Finanzas", "Salud", "Arte", "Comunidad", "Otro"
];

export function EditProfileModal({ open, onOpenChange, profile, onProfileUpdated }: EditProfileModalProps) {
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [headline, setHeadline] = useState(profile.headline || "");
  const [vertical, setVertical] = useState(profile.vertical || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [skills, setSkills] = useState(profile.skills ? profile.skills.join(", ") : "");
  const [loading, setLoading] = useState(false);
  const [verticalOther, setVerticalOther] = useState(profile.vertical && !VERTICAL_OPTIONS.includes(profile.vertical) ? profile.vertical : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let vert = vertical;
    if(vert === "Otro" && verticalOther) vert = verticalOther;

    const updatedFields: Partial<Profile> = {
      display_name: displayName,
      headline,
      bio,
      vertical: vert,
      skills: skills.split(",").map(s => s.trim()).filter(Boolean)
    };
    const { error, data } = await supabase
      .from("professional_profiles")
      .update(updatedFields)
      .eq("id", profile.id)
      .select()
      .maybeSingle();

    setLoading(false);

    if (error || !data) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "¡Perfil actualizado!",
      description: "Tus cambios han sido guardados.",
    });
    onProfileUpdated(data as Profile);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nombre visible</label>
            <Input 
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              maxLength={40} required 
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Headline</label>
            <Input 
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Vertical principal</label>
            <select
              value={verticalOptionsValue(vertical, verticalOther)}
              onChange={e => {
                setVertical(e.target.value);
                if(e.target.value !== "Otro") setVerticalOther("");
              }}
              className="w-full border rounded-md px-3 py-2 text-base bg-white"
              required
            >
              <option value="" disabled>Seleccionar</option>
              {VERTICAL_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {vertical === "Otro" && (
              <Input
                className="mt-2"
                placeholder="Especifica tu vertical"
                value={verticalOther}
                required
                onChange={e => setVerticalOther(e.target.value)}
              />
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Skills (separadas por coma)</label>
            <Input
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="Ej: React, Justicia, Innovación"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Bio</label>
            <Textarea 
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={500}
              placeholder="Contanos un poco sobre vos..."
              className="resize-none min-h-[80px] max-h-[180px]"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-terra-cotta hover:bg-terra-cotta/90">
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Helper para manejar el valor correcto según vertical otro
function verticalOptionsValue(vertical: string, verticalOther: string) {
  if (vertical === "Otro" && verticalOther) return "Otro";
  if (vertical && !["Tecnología", "Derecho", "Finanzas", "Salud", "Arte", "Comunidad", "Otro"].includes(vertical)) return "Otro";
  return vertical;
}
