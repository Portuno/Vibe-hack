
import Navbar from "@/components/Navbar";
import { ProjectForm } from "@/components/ProjectForm";

export default function SubirProyecto() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display text-terra-cotta mb-2">📤 Subí tu Proyecto</h1>
            <p className="text-lg text-gris-piedra">
              Compartí tu idea, producto o iniciativa con la comunidad de Terreta Hub.
            </p>
            <p className="mt-2 text-negro-suave max-w-2xl mx-auto">
              Hacé visible tu trabajo, conectá con colaboradores y recibí feedback del ecosistema emprendedor de Valencia y más allá.
            </p>
          </div>
          <ProjectForm />
        </div>
      </div>
    </>
  );
}
