
import Navbar from "@/components/Navbar";

export default function Blog() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-display text-terra-cotta mb-4">Blog</h1>
        <p className="text-gris-piedra">Artículos y noticias de interés para la comunidad.</p>
      </div>
    </>
  );
}
