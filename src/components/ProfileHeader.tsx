
import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { SocialLinks } from "./SocialLinks";
import { useState } from "react";
import { EditProfileModal } from "./EditProfileModal";

interface ProfileHeaderProps {
  profile: Profile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
    const [editOpen, setEditOpen] = useState(false);
    const [localProfile, setLocalProfile] = useState(profile);

    return (
        <div>
            <div className="h-48 bg-gray-200 rounded-t-lg" style={{ backgroundImage: `url(${localProfile.cover_photo_url || 'https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2670&auto=format&fit=crop'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            
            <div className="px-6 -mt-16">
                <div className="flex items-end gap-4">
                    <Avatar className="h-32 w-32 border-4 border-crema-claro">
                        <AvatarImage src={localProfile.avatar_url ?? ""} alt={localProfile.display_name || localProfile.name} />
                        <AvatarFallback>{(localProfile.display_name || localProfile.name).charAt(0)}</AvatarFallback>
                    </Avatar>
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
