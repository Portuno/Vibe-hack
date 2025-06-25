import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Proyectos from "./pages/Proyectos";
import Recursos from "./pages/Recursos";
import Eventos from "./pages/Eventos";
import MiPerfil from "./pages/MiPerfil";
import Chipi from "./pages/Chipi";
import Contacto from "./pages/Contacto";
import Auth from "./pages/Auth";
import Profesionales from "./pages/Profesionales";
import PerfilProfesional from "./pages/PerfilProfesional";
import Cursos from "./pages/Cursos";
import Blog from "./pages/Blog";
import BlogEditor from "./pages/BlogEditor";
import BlogPost from "./pages/BlogPost";
import SubirProyecto from "./pages/SubirProyecto";
import CrearEvento from "./pages/CrearEvento";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <TooltipProvider> */}
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/proyectos/subir" element={<SubirProyecto />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/crear" element={<CrearEvento />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
          <Route path="/chipi" element={<Chipi />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/profesionales" element={<Profesionales />} />
          <Route path="/profesionales/:id" element={<PerfilProfesional />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/nuevo" element={<BlogEditor />} />
          <Route path="/blog/edit/:id" element={<BlogEditor />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

export default App;
