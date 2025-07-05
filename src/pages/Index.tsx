
import Navbar from "@/components/Navbar";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { ProjectCard } from "@/components/ProjectCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

function sanitizeProfile(raw: any): Profile {
  // Ensure social_links matches type requirements: Record<string, string> | null
  let social_links: Record<string, string> | null = null;
  if (
    raw.social_links &&
    typeof raw.social_links === "object" &&
    !Array.isArray(raw.social_links)
  ) {
    // Narrow only to string-to-string values, ignoring any bad values from the db
    const obj = Object.entries(raw.social_links).reduce<Record<string, string>>((acc, [k, v]) => {
      if (typeof v === "string") acc[k] = v;
      return acc;
    }, {});
    social_links = Object.keys(obj).length > 0 ? obj : null;
  } else {
    social_links = null;
  }
  return {
    ...raw,
    social_links,
  };
}

const Index = () => {
  const [profesionales, setProfesionales] = useState<Profile[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar profesionales públicos (máximo 2 random sin Chipi, y añadir siempre a Chipi)
  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from("professional_profiles")
        .select("*")
        .eq("is_public", true);

      let profs: Profile[] = (data ?? [])
        .filter(p => p.name !== "Chipi")
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(sanitizeProfile);

      setProfesionales([getChipiProfile(), ...profs]);
    }
    fetchProfiles();
  }, []);

  // Cargar 3 proyectos al azar
  useEffect(() => {
    async function fetchProyectos() {
      const { data: projectsData, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "publicado");

      if (!projectsData || projectsData.length === 0) {
        setLoading(false);
        return;
      }

      // Obtener los IDs únicos de creadores
      const creatorIds = [...new Set(projectsData.map(project => project.creator_id))].filter(Boolean);
      
      let profilesData = [];
      if (creatorIds.length > 0) {
        // Obtener perfiles profesionales
        const { data: profiles } = await supabase
          .from("professional_profiles")
          .select("user_id, name, display_name, avatar_url")
          .in("user_id", creatorIds);
        
        profilesData = profiles || [];
      }

      // Crear un mapa de perfiles para búsqueda rápida
      const profilesMap = new Map(
        profilesData.map(profile => [profile.user_id, profile])
      );

      let all = projectsData.map((project: any) => {
        const profile = profilesMap.get(project.creator_id);
        
        return {
          ...project,
          creator: {
            name: profile?.display_name || profile?.name || "Anónimo",
            avatar_url: profile?.avatar_url
          }
        };
      });

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
      <header className="mb-8 flex flex-col items-center justify-center px-4 w-full bg-gradient-to-b from-arena/50 to-crema pt-8 pb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-terra-cotta drop-shadow-sm leading-tight mb-4 animate-fade-in-up text-center max-w-4xl">
          Terreta Hub
        </h1>
        <p className="max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl text-mediterraneo font-medium text-center mb-3 animate-fade-in-up px-2">
          Comunidad colaborativa para creativos, profesionales y makers de Valencia
        </p>
        <p className="max-w-xl text-sm sm:text-base md:text-lg text-gris-piedra text-center mb-6 animate-fade-in-up px-4 leading-relaxed">
          Comparte proyectos, accede a recursos, conecta con talento interdisciplinar y haz crecer tu ecosistema local
        </p>
        <Link 
          to="/auth" 
          className="btn-terra mt-2 px-6 py-3 text-base font-semibold shadow-card block w-full max-w-xs text-center rounded-xl hover:shadow-lg transition-all"
        >
          Únete a Terreta Hub
        </Link>
      </header>

      {/* Profesionales destacados */}
      <section className="container mx-auto mb-8 px-4">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-negro-suave mb-6 tracking-tight text-center sm:text-left">
          Profesionales destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profesionales.map((prof) =>
            prof.id === "chipi" ? (
              <div
                key="chipi"
                className="relative group w-full"
              >
                <div className="bg-gradient-to-br from-white via-arena/70 to-arena/40 card-fade-in p-6 rounded-2xl card-shadow flex flex-col gap-4 w-full shadow-lg border border-arena min-h-[320px]">
                  <div className="flex flex-col items-center gap-4 flex-1">
                    <img
                      src={prof.avatar_url}
                      alt="Chipi"
                      className="rounded-full w-16 h-16 sm:w-20 sm:h-20 border-4 border-terra-cotta shadow-lg bg-white object-cover"
                      style={{ background: "#fff" }}
                    />
                    <span className="font-display text-lg sm:text-xl font-bold text-terra-cotta text-center">Chipi</span>
                    <span className="inline-block text-mediterraneo text-xs font-semibold px-3 py-1 rounded-full bg-arena shadow">
                      Asistente Virtual
                    </span>
                  </div>
                  <p className="text-sm text-center text-gris-piedra italic mb-3 leading-relaxed">{prof.bio}</p>
                  <Link
                    to="/chipi"
                    className="btn-terra w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all hover:shadow-md"
                  >
                    Chatea conmigo
                  </Link>
                </div>
              </div>
            ) : (
              <ProfessionalCard key={prof.id} profile={prof} />
            )
          )}
        </div>
      </section>

      {/* Proyectos inspiradores */}
      <section className="container mx-auto mb-8 px-4">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-negro-suave mb-6 tracking-tight text-center sm:text-left">
          Proyectos inspiradores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <div className="bg-arena animate-pulse h-[280px] rounded-2xl" />
              <div className="bg-arena animate-pulse h-[280px] rounded-2xl" />
              <div className="bg-arena animate-pulse h-[280px] rounded-2xl" />
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
                websiteUrl={proj.website_url}
                repoUrl={proj.repo_url}
                creatorName={proj.creator?.name || 'Anónimo'}
                creatorAvatar={proj.creator?.avatar_url}
              />
            ))
          )}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />

      <footer className="text-center text-xs text-gris-piedra font-medium pb-8 pt-10 px-4">
        Terreta Hub © {new Date().getFullYear()} &ndash; Comunidad Valenciana
      </footer>
    </div>
  );
};

export default Index;
