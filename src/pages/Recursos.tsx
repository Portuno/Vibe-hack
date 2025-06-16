
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ResourceCard, Resource } from "@/components/ResourceCard";
import { SearchBar } from "@/components/SearchBar";
import { FormatFilterBar } from "@/components/FormatFilterBar";
import { ResourceForm } from "@/components/ResourceForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function Recursos() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("todos");
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    console.log("Cargando recursos...");
    const { data, error } = await supabase
      .from("resources")
      .select(`
        id, name, description, description_short, resource_type, category, url, created_at,
        profiles:creator_id ( name, avatar_url )
      `)
      .eq("status", "publicado")
      .order("created_at", { ascending: false });
    
    console.log("Datos de recursos:", data);
    console.log("Error al cargar recursos:", error);
    
    setLoading(false);
    if (!error && data) {
      setResources(
        data.map((r: any) => ({
          ...r,
          tags: [], // Por ahora tags vacío hasta que se agregue la columna
          author: {
            name: r.profiles?.name ?? "Sin nombre",
            avatar_url: r.profiles?.avatar_url ?? undefined
          }
        }))
      );
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const filtered = resources.filter(r => {
    const matchFormat = format === "todos" || (r.resource_type ?? "").toLowerCase() === format;
    const searchText = (
      r.name +
      " " + (r.description_short ?? "") +
      " " + (r.author?.name ?? "") +
      " " + (r.category ?? "")
    ).toLowerCase();
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
              <Button
                className="h-12 text-base font-semibold bg-terra-cotta hover:bg-terra-cotta/80 shadow hover-scale transition"
                size="lg"
                onClick={() => setOpenForm(true)}
              >
                + Subir recurso
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-6">
          <FormatFilterBar selected={format} onSelect={setFormat} />
        </div>
      </section>

      {/* Listado de recursos */}
      <section className="container mx-auto pt-6 pb-12 animate-fade-in-up">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-lg text-gris-piedra">
            Cargando recursos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex justify-center items-center py-16 text-lg text-gris-piedra">
            {resources.length === 0 ? "No hay recursos disponibles..." : "No hay recursos con esos filtros…"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
            {filtered.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </section>

      {/* Modal para crear recurso */}
      <ResourceForm open={openForm} onOpenChange={(v) => {
        setOpenForm(v);
        if (!v) reload();
      }} onCreated={reload} />
    </>
  );
}
