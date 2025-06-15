
import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const menu = [
  {
    label: "Proyectos",
    href: "/proyectos",
  },
  {
    label: "Recursos",
    href: "/recursos",
  },
  {
    label: "Eventos",
    href: "/eventos",
  },
  {
    label: "Chipi",
    href: "/chipi",
  },
  {
    label: "Contacto",
    href: "/contacto",
  },
];

export default function Navbar() {
  const location = useLocation();
  // El botón de login/perfil será reemplazado por lógica real de auth en el futuro

  return (
    <nav className="sticky top-0 w-full z-30 bg-crema/90 backdrop-blur-md shadow-card px-0 py-2 border-b border-arena">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center text-2xl font-display font-bold text-terra-cotta tracking-tight gap-2 px-2 py-1"
        >
          🧭 Terreta Hub
        </Link>
        {/* Menú central */}
        <div className="flex-1 flex justify-center">
          <div className="flex gap-2 items-center">
            {menu.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "font-semibold px-4 py-2 rounded-xl transition hover:bg-arena/80 items-center text-negro-suave",
                  location.pathname === item.href && "bg-arena font-bold"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Botón Login/Perfil a la derecha  */}
        <div className="flex items-center">
          {/* Mostraré siempre "Login / Perfil" por ahora */}
          <Link
            to="/mi-perfil"
            className="ml-2 btn-terra shadow-card hover:shadow-lg"
          >
            Login / Perfil
          </Link>
        </div>
      </div>
    </nav>
  );
}
