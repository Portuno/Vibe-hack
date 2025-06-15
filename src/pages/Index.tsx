import Navbar from "@/components/Navbar";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { ProjectCard } from "@/components/ProjectCard";
import { Profile } from "@/types";

const DEMO_PROFESIONALES: Profile[] = [
  {
    id: 'demo-1',
    user_id: 'demo-user-1',
    name: "Raquel Ortega",
    display_name: "Raquel Ortega",
    bio: "Diseñadora UX/UI y community builder. Apasionada por impulsar el talento creativo valenciano. En busca de nuevas colaboraciones tech/art.",
    avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
    vertical: "Arte",
    skills: ["UX/UI", "Figma", "Comunicación", "Branding"],
    social_links: {
      "Portfolio": "https://behance.net/raquelortega",
      "LinkedIn": "#"
    },
    headline: "Diseñadora UX/UI",
    location: "Valencia",
    cover_photo_url: null,
    interests: null,
    what_i_am_looking_for: null,
    notification_preferences: null,
    is_public: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-2',
    user_id: 'demo-user-2',
    name: "Julián Pérez",
    display_name: "Julián Pérez",
    bio: "Legaltech y mentor en aceleradoras. Asesoro startups en temas legales y regulatorios. Abierto a nuevos retos colaborativos.",
    avatar_url: "https://randomuser.me/api/portraits/men/77.jpg",
    vertical: "Legal",
    skills: ["Legal", "Mentoría", "Startups"],
    social_links: { "LinkedIn": "#" },
    headline: "Legaltech y mentor",
    location: "Valencia",
    cover_photo_url: null,
    interests: null,
    what_i_am_looking_for: null,
    notification_preferences: null,
    is_public: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-3',
    user_id: 'demo-user-3',
    name: "Lucía Navarro",
    display_name: "Lucía Navarro",
    bio: "Desarrolladora fullstack y formadora. Me encanta crear soluciones que generan impacto positivo y enseñar programación accesible.",
    avatar_url: "https://randomuser.me/api/portraits/women/34.jpg",
    vertical: "Tecnología",
    skills: ["React", "Node.js", "Docencia"],
    social_links: { "GitHub": "#" },
    headline: "Desarrolladora fullstack",
    location: "Valencia",
    cover_photo_url: null,
    interests: null,
    what_i_am_looking_for: null,
    notification_preferences: null,
    is_public: true,
    created_at: new Date().toISOString()
  },
];

const DEMO_PROYECTOS = [
  {
    name: "Sol y Sombra",
    description: "Plataforma para artistas locales que quieren exponer y vender sus obras en Valencia, conectando talento público y galeristas.",
    vertical: "Arte" as const,
    highlightImg: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    problem: "Falta de visibilidad para nuevos artistas.",
    demoUrl: "#",
    creatorName: "Raquel Ortega",
    creatorAvatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    name: "LexStart",
    description: "Asistente legal digital para startups: contratos, registro, guía en trámites. Simple, ágil y en lenguaje claro.",
    vertical: "Legal" as const,
    highlightImg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    problem: "Complejidad legal de los primeros pasos de una empresa.",
    demoUrl: "#",
    creatorName: "Julián Pérez",
    creatorAvatar: "https://randomuser.me/api/portraits/men/77.jpg"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-crema">
      <Navbar />
      <header className="mt-3 mb-8 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-terra-cotta drop-shadow-sm leading-tight mb-4 animate-fade-in-up">
          Terreta Hub
        </h1>
        <p className="max-w-xl text-xl md:text-2xl text-mediterraneo font-medium text-center mb-2 animate-fade-in-up">
          Comunidad colaborativa para creativos, profesionales y makers de Valencia. 
        </p>
        <p className="max-w-lg text-gris-piedra text-center mb-8 animate-fade-in-up">
          Comparte proyectos, accede a recursos, conecta con talento interdisciplinar y haz crecer tu ecosistema local.
        </p>
        <a href="#" className="btn-terra mt-2 px-8 py-3 text-lg shadow-card">
          Únete a Terreta Hub
        </a>
      </header>

      {/* Demo Grid Comunidad */}
      <section className="container mx-auto mb-12">
        <h2 className="font-display text-3xl text-negro-suave mb-6 tracking-tight">Profesionales destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {DEMO_PROFESIONALES.map((prof) => (
            <ProfessionalCard key={prof.name} profile={prof} />
          ))}
        </div>
      </section>
      {/* Demo Grid Proyectos */}
      <section className="container mx-auto pb-16">
        <h2 className="font-display text-3xl text-negro-suave mb-6 tracking-tight">Proyectos inspiradores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {DEMO_PROYECTOS.map((proj) => (
            <ProjectCard key={proj.name} {...proj} />
          ))}
        </div>
      </section>
      <footer className="text-center text-xs text-gris-piedra font-medium pb-8 pt-10">
        Terreta Hub © {new Date().getFullYear()} &ndash; Comunidad Valenciana
      </footer>
    </div>
  );
};

export default Index;
