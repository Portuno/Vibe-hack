
import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Camera } from "lucide-react";
import { SocialLinks } from "./SocialLinks";
import { useState, useRef } from "react";
import { EditProfileModal } from "./EditProfileModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  profile: Profile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
    const [editOpen, setEditOpen] = useState(false);
    const [localProfile, setLocalProfile] = useState(profile);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarUploading(true);
        // subir archivo a storage
        const filename = `avatars/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from("avatars").upload(filename, file, { upsert: true });
        if (error) {
            toast({ title: "Error", description: "No se pudo subir la foto de perfil.", variant: "destructive" });
            setAvatarUploading(false);
            return;
        }
        const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
        const imageUrl = data.publicUrl;
        // actualizar profile
        const { error: updateError, data: updated } = await supabase
            .from("professional_profiles")
            .update({ avatar_url: imageUrl })
            .eq("id", profile.id)
            .select()
            .maybeSingle();
        setAvatarUploading(false);
        if (updateError || !updated) {
            toast({ title: "Error", description: "No se pudo actualizar el perfil.", variant: "destructive" });
            return;
        }
        setLocalProfile(prev => ({ ...prev, avatar_url: imageUrl }));
        toast({ title: "¡Foto de perfil actualizada!" });
    };

    return (
        <div>
            <div className="flex items-end gap-4 px-6 pt-5 pb-0"> {/* Quitar portada */}
                <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-crema-claro">
                        <AvatarImage src={localProfile.avatar_url ?? ""} alt={localProfile.display_name || localProfile.name} />
                        <AvatarFallback>{(localProfile.display_name || localProfile.name).charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button
                        size="icon"
                        variant="outline"
                        className="absolute bottom-1 right-1 rounded-full border shadow bg-white/70"
                        onClick={() => inputFileRef.current?.click()}
                        disabled={avatarUploading}
                        aria-label="Cambiar foto de perfil"
                    >
                        <Camera className="w-6 h-6" />
                    </Button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={inputFileRef}
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={avatarUploading}
                    />
                </div>
                <div className="flex-grow pb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{localProfile.display_name || localProfile.name}</h1>
                        <p className="text-gray-600">{localProfile.headline}</p>
                        {localProfile.location && <div className="flex items-center text-sm text-gray-500 mt-1"><MapPin className="h-4 w-4 mr-1" /> {localProfile.location}</div>}
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline" onClick={() => setEditOpen(true)}>✏️ Editar Perfil</Button>
                         <Button disabled>Seguir</Button>
                    </div>
                </div>
            </div>
            <div className="px-6 pt-4 pb-6 border-b border-arena">
                <p className="text-gray-700">{localProfile.bio}</p>
                <div className="mt-4">
                    <SocialLinks links={localProfile.social_links} />
                </div>
            </div>
            <EditProfileModal 
              open={editOpen} 
              onOpenChange={setEditOpen}
              profile={localProfile}
              onProfileUpdated={setLocalProfile}
            />
        </div>
    )
}
