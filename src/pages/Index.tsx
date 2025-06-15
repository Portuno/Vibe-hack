
import Navbar from "@/components/Navbar";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { ProjectCard } from "@/components/ProjectCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

function getChipiProfile(): Profile {
  return {
    id: "chipi",
    user_id: "chipi",
    name: "Chipi",
    display_name: "Chipi",
    bio: "Soy Chipi, tu asistente-bot de Terreta Hub 🐤. Resuelvo dudas, conecto talento y ayudo a navegar la comunidad. ¡Pío pío, chatea conmigo!",
    avatar_url: "/lovable-uploads/cd8f5122-d206-49ff-bf94-0fc1da28a181.png",
    vertical: "Tecnología",
    skills: ["AI", "Asistencia", "Automatización"],
    social_links: {},
    headline: "Asistente virtual de Terreta Hub",
    location: "Comunidad Valenciana",
    cover_photo_url: null,
    interests: null,
    what_i_am_looking_for: null,
    notification_preferences: null,
    is_public: true,
    created_at: new Date().toISOString(),
  };
}

const Index = () => {
  const [profesionales, setProfesionales] = useState<Profile[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar profesionales públicos (máximo 2 random sin Chipi, y añadir siempre a Chipi)
  useEffect(() => {
    async function fetchProfiles() {
      // Coger solo perfiles públicos y ordenados al azar, 2 máximo.
      const { data, error } = await supabase
        .from("professional_profiles")
        .select("*")
        .eq("is_public", true);

      let profs: Profile[] = data ?? [];
      // Mezclar aleatoriamente
      profs = profs
        .filter(p => p.name !== "Chipi")
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      // Chipi siempre primero
      setProfesionales([getChipiProfile(), ...profs]);
    }
    fetchProfiles();
  }, []);

  // Cargar 3 proyectos al azar
  useEffect(() => {
    async function fetchProyectos() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "publicado");

      let all = data ?? [];
      // Mezclar y tomar 3
      all = all.sort(() => Math.random() - 0.5).slice(0, 3);
      setProyectos(all);
      setLoading(false);
    }
    fetchProyectos();
  }, []);

  return (
    <div className="min-h-screen bg-crema flex flex-col">
      <Navbar />
      <header className="mb-10 flex flex-col items-center justify-center px-3 sm:px-0 w-full bg-gradient-to-b from-arena/50 to-crema pt-7 pb-6">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-terra-cotta drop-shadow-sm leading-tight mb-4 animate-fade-in-up text-center">
          Terreta Hub
        </h1>
        <p className="max-w-xl text-lg sm:text-2xl text-mediterraneo font-medium text-center mb-2 animate-fade-in-up">
          Comunidad colaborativa para creativos, profesionales y makers de Valencia. 
        </p>
        <p className="max-w-lg text-gris-piedra text-center mb-8 animate-fade-in-up text-base sm:text-lg">
          Comparte proyectos, accede a recursos, conecta con talento interdisciplinar y haz crecer tu ecosistema local.
        </p>
        <a 
          href="#" 
          className="btn-terra mt-2 px-5 py-2 sm:px-8 sm:py-3 text-base sm:text-lg shadow-card block w-full max-w-xs sm:max-w-fit text-center rounded-xl"
        >
          Únete a Terreta Hub
        </a>
      </header>

      {/* Profesionales destacados */}
      <section className="container mx-auto mb-10 px-2">
        <h2 className="font-display text-2xl sm:text-3xl text-negro-suave mb-4 sm:mb-6 tracking-tight">
          Profesionales destacados
        </h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-7">
          {profesionales.map((prof) =>
            prof.id === "chipi" ? (
              <div
                key="chipi"
                className="relative group"
              >
                <div className="bg-gradient-to-br from-white via-arena/70 to-arena/40 card-fade-in p-5 rounded-2xl card-shadow flex flex-col gap-3 w-full max-w-sm shadow-lg border border-arena">
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={prof.avatar_url}
                      alt="Chipi"
                      className="rounded-full w-20 h-20 border-4 border-terra-cotta shadow-lg bg-white object-cover mb-1"
                      style={{ background: "#fff" }}
                    />
                    <span className="font-display text-xl font-bold text-terra-cotta">Chipi</span>
                    <span className="inline-block text-mediterraneo text-xs font-semibold px-2 py-0.5 rounded bg-arena shadow">Asistente Virtual</span>
                  </div>
                  <p className="text-sm text-center text-gris-piedra italic mb-2">{prof.bio}</p>
                  <a
                    href="/chipi"
                    className="btn-terra w-full px-4 py-2 mt-2 text-sm font-semibold rounded-xl transition"
                  >
                    Chatea conmigo
                  </a>
                </div>
              </div>
            ) : (
              <ProfessionalCard key={prof.id} profile={prof} />
            )
          )}
        </div>
      </section>

      {/* Proyectos inspiradores */}
      <section className="container mx-auto mb-10 px-2">
        <h2 className="font-display text-2xl sm:text-3xl text-negro-suave mb-4 sm:mb-6 tracking-tight">
          Proyectos inspiradores
        </h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-7">
          {loading ? (
            <>
              <div className="bg-arena animate-pulse h-[270px] rounded-2xl" />
              <div className="bg-arena animate-pulse h-[270px] rounded-2xl" />
              <div className="bg-arena animate-pulse h-[270px] rounded-2xl" />
            </>
          ) : (
            proyectos.map((proj) => (
              <ProjectCard
                key={proj.id}
                name={proj.name}
                description={proj.description}
                vertical={proj.vertical}
                highlightImg={proj.highlight_img}
                problem={proj.problem}
                demoUrl={proj.demo_url}
                creatorName={proj.creator_id}
                creatorAvatar={undefined}
              />
            ))
          )}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />

      <footer className="text-center text-xs text-gris-piedra font-medium pb-8 pt-10">
        Terreta Hub © {new Date().getFullYear()} &ndash; Comunidad Valenciana
      </footer>
    </div>
  );
};

export default Index;
