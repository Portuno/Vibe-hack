
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Badge } from "@/components/Badge";

export default function MiPerfil() {
  const { profile, loading } = useAuth();
  
  const renderSkeleton = () => (
    <div className="container mx-auto mt-10 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md">
        <Skeleton className="h-48 w-full rounded-t-lg" />
        <div className="px-6 -mt-16 flex items-end gap-4">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-crema" />
            <div className="flex-grow pb-4">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-64" />
            </div>
        </div>
        <div className="p-6 border-b border-arena">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-3/4 mb-4" />
            <Skeleton className="h-6 w-24" />
        </div>
        <div className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        {renderSkeleton()}
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto mt-10 text-center">
            <h1 className="text-3xl font-display text-terra-cotta mb-4">Perfil no encontrado</h1>
            <p className="text-gris-piedra">No pudimos cargar tu perfil. Es posible que aún no lo hayas creado. Intenta recargar o crearlo.</p>
        </div>
      </>
    )
  }

  return (
    <div className="bg-crema-claro min-h-screen pb-16">
      <Navbar />
      <div className="container mx-auto mt-10 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ProfileHeader profile={profile} />
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Verticales de Interés</h2>
                <div className="flex flex-wrap gap-2">
                    <Badge label={profile.vertical} vertical={profile.vertical as any} />
                </div>
                 <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">Habilidades</h2>
                 <div className="flex flex-wrap gap-2">
                    {profile.skills?.map(skill => (
                        <span key={skill} className="bg-arena text-terra-cotta px-3 py-1 rounded-xl text-xs font-semibold">{skill}</span>
                    ))}
                 </div>
                 {profile.what_i_am_looking_for && (
                    <>
                        <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">¿Qué estoy buscando?</h2>
                        <p className="text-gray-700">{profile.what_i_am_looking_for}</p>
                    </>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}
