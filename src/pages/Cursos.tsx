
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import { VerticalFilterBar } from "@/components/VerticalFilterBar";
import { SearchBar } from "@/components/SearchBar";
import { Plus } from "lucide-react";

const MOCK_COURSES = [
  {
    id: "1",
    title: "Introducción práctica a la programación web",
    description_short: "Aprendé los fundamentos de desarrollo web creando tu primer sitio.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    verticals: ["Tecnología"],
    creator: {
      name: "Marta Gómez",
      avatar_url: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    level: "Básico",
    type: "Gratuito",
    tag: "Nuevo",
  },
  {
    id: "2",
    title: "Finanzas para emprendedores",
    description_short: "Domina conceptos clave para gestionar tu proyecto y maximizar beneficios.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
    verticals: ["Finanzas", "Negocios"],
    creator: {
      name: "Carlos Ruiz",
      avatar_url: "https://randomuser.me/api/portraits/men/88.jpg",
    },
    level: "Intermedio",
    type: "Pago",
    tag: "Destacado",
  },
  {
    id: "3",
    title: "Claves legales para startups",
    description_short: "Identificá los aspectos legales esenciales para lanzar tu negocio.",
    image: "",
    verticals: ["Derecho", "Innovación"],
    creator: {
      name: "Ana Torres",
      avatar_url: "https://randomuser.me/api/portraits/women/31.jpg",
    },
    level: "Básico",
    type: "Gratuito",
    tag: "",
  },
];

export default function Cursos() {
  const [search, setSearch] = useState("");
  const [vertical, setVertical] = useState("Todos");

  const filteredCourses = MOCK_COURSES.filter(c => {
    const matchVertical =
      vertical === "Todos" || c.verticals.includes(vertical);
    const searchText = (
      c.title +
      " " +
      c.description_short +
      " " +
      c.creator.name
    ).toLocaleLowerCase();
    return matchVertical && searchText.includes(search.toLocaleLowerCase());
  });

  return (
    <>
      <Navbar />
      {/* Hero/encabezado */}
      <section className="bg-arena px-2 py-10 rounded-b-3xl shadow animate-fade-in-up">
        <div className="container mx-auto flex flex-col md:flex-row md:justify-between items-center gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-display font-bold text-terra-cotta mb-4 flex items-center gap-2">
              <span className="text-5xl">🎓</span>
              Aprendé, creá y conectá desde la Terreta
            </h1>
            <p className="max-w-xl text-lg text-negro-suave/80 mb-4">
              Descubrí cursos, talleres y formaciones de calidad creadas por y para la comunidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <SearchBar
                value={search}
                onChange={setSearch}
                className="flex-1 max-w-xl"
                placeholder="Buscar cursos, talleres, creadores…"
              />
              <Button className="h-12 text-base font-semibold bg-terra-cotta hover:bg-terra-cotta/80 shadow hover-scale transition" size="lg">
                <Plus className="mr-2" /> Subir un curso
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-6">
          <VerticalFilterBar selected={vertical} onSelect={v => setVertical(v)} />
        </div>
      </section>

      {/* Listado de cursos */}
      <section className="container mx-auto pt-6 pb-12 animate-fade-in-up">
        {filteredCourses.length === 0 ? (
          <div className="flex justify-center items-center py-16 text-lg text-gris-piedra">
            No hay cursos con esos filtros…
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2">
            {filteredCourses.map(c => <CourseCard course={c} key={c.id} />)}
          </div>
        )}
      </section>
    </>
  );
}
