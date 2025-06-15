
import Navbar from "@/components/Navbar";
import { EventForm } from "@/components/EventForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function CrearEvento() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/auth', { replace: true });
    }
  }, [session, loading, navigate]);

  return (
    <>
      <Navbar />
      <div className="bg-crema-claro min-h-screen">
        <div className="container mx-auto mt-10 pb-16">
            {loading || !session ? (
                <div className="max-w-3xl mx-auto">
                    <Skeleton className="h-24 w-full mb-8" />
                    <Skeleton className="h-[500px] w-full" />
                </div>
            ) : (
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-display text-terra-cotta mb-2">📢 Crear un Nuevo Evento</h1>
                        <p className="text-lg text-gris-piedra">
                        Compartí tu meetup, workshop o charla con la comunidad.
                        </p>
                    </div>
                    <EventForm />
                </div>
            )}
        </div>
      </div>
    </>
  );
}
