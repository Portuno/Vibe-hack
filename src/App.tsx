import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
          <Route path="/chipi" element={<Chipi />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
