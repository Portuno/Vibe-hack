
import Navbar from "@/components/Navbar";

export default function MiPerfil() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-display text-terra-cotta mb-4">Mi Perfil</h1>
        <p className="text-gris-piedra">Tu perfil y configuración en Terreta Hub.</p>
      </div>
    </>
  );
}
