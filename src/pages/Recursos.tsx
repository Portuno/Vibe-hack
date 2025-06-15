
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ResourceCard, Resource } from "@/components/ResourceCard";
import { SearchBar } from "@/components/SearchBar";
import { FormatFilterBar } from "@/components/FormatFilterBar";

const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Guía de Notion para emprender",
    description_short: "Aprende a organizar proyectos y tareas con Notion.",
    format: "guía",
    category: "Tecnología",
    tags: ["productividad", "notion"],
    url: "#",
    created_at: "2024-06-01",
    author: {
      name: "Ana Torres",
      avatar_url: "https://randomuser.me/api/portraits/women/47.jpg",
    },
  },
  {
    id: "2",
    title: "Podcast: Emprender en comunidad",
    description_short: "Historias reales de fundadores del hub.",
    format: "podcast",
    category: "Negocios",
    tags: ["emprendimiento", "comunidad"],
    url: "#",
    created_at: "2024-06-06",
    author: {
      name: "Carlos Ruiz",
      avatar_url: "https://randomuser.me/api/portraits/men/82.jpg",
    },
  },
  {
    id: "3",
    title: "Checklist legal para tu startup",
    description_short: "Chequea estos puntos legales antes de lanzar tu negocio.",
    format: "documento",
    category: "Derecho",
    tags: ["legal", "startup"],
    url: "#",
    created_at: "2024-05-23",
    author: {
      name: "Marta Gómez",
    },
  },
  {
    id: "4",
    title: "Video: Aprende a usar Figma",
    description_short: "Diseña como un profesional y lleva tu idea al siguiente nivel.",
    format: "video",
    category: "Arte",
    tags: ["diseño", "figma", "ux"],
    url: "#",
    created_at: "2024-06-11",
    author: {
      name: "Martin Puig",
      avatar_url: "https://randomuser.me/api/portraits/men/31.jpg",
    },
  },
];

export default function Recursos() {
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("todos");

  const filtered = MOCK_RESOURCES.filter(r => {
    const matchFormat = format === "todos" || r.format.toLowerCase() === format;
    const searchText = (r.title + " " + r.description_short + " " + r.author.name + " " + r.category).toLowerCase();
    return matchFormat && searchText.includes(search.toLowerCase());
  });

  return (
    <>
      <Navbar />
      {/* Hero / Cabecera */}
      <section className="bg-arena px-2 py-10 rounded-b-3xl shadow animate-fade-in-up">
        <div className="container mx-auto flex flex-col md:flex-row md:justify-between items-center gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-display font-bold text-terra-cotta mb-4 flex items-center gap-2">
              <span className="text-5xl">📚</span>
              Recursos abiertos para mentes inquietas
            </h1>
            <p className="max-w-xl text-lg text-negro-suave/80 mb-4">
              Videos, artículos, guías, podcasts y más… seleccionados por la comunidad para crecer juntos.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <SearchBar
                value={search}
                onChange={setSearch}
                className="flex-1 max-w-xl"
                placeholder="Buscar recursos, autores, categorías…"
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-6">
          <FormatFilterBar selected={format} onSelect={setFormat} />
        </div>
      </section>

      {/* Listado de recursos */}
      <section className="container mx-auto pt-6 pb-12 animate-fade-in-up">
        {filtered.length === 0 ? (
          <div className="flex justify-center items-center py-16 text-lg text-gris-piedra">
            No hay recursos con esos filtros…
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
            {filtered.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </section>
    </>
  );
}
