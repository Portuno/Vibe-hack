
import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { SocialLinks } from "./SocialLinks";

interface ProfileHeaderProps {
  profile: Profile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
    return (
        <div>
            <div className="h-48 bg-gray-200 rounded-t-lg" style={{ backgroundImage: `url(${profile.cover_photo_url || 'https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2670&auto=format&fit=crop'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            
            <div className="px-6 -mt-16">
                <div className="flex items-end gap-4">
                    <Avatar className="h-32 w-32 border-4 border-crema-claro">
                        <AvatarImage src={profile.avatar_url ?? ""} alt={profile.display_name || profile.name} />
                        <AvatarFallback>{(profile.display_name || profile.name).charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow pb-4 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{profile.display_name || profile.name}</h1>
                            <p className="text-gray-600">{profile.headline}</p>
                            {profile.location && <div className="flex items-center text-sm text-gray-500 mt-1"><MapPin className="h-4 w-4 mr-1" /> {profile.location}</div>}
                        </div>
                        <div className="flex gap-2">
                             <Button variant="outline">✏️ Editar Perfil</Button>
                             <Button disabled>Seguir</Button>
                        </div>
                    </div>
                </div>
            </div>
             <div className="px-6 pt-4 pb-6 border-b border-arena">
                <p className="text-gray-700">{profile.bio}</p>
                <div className="mt-4">
                    <SocialLinks links={profile.social_links} />
                </div>
            </div>
        </div>
    )
}
