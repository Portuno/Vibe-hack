
import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const menu = [
  {
    label: "Comunidad",
    children: [
      { label: "Proyectos", href: "#" },
      { label: "Eventos", href: "#" },
      { label: "Profesionales", href: "#" },
    ],
  },
  {
    label: "Recursos",
    children: [
      { label: "Cursos", href: "#" },
      { label: "Recursos", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 w-full z-30 bg-crema/90 backdrop-blur-md shadow-card px-0 py-2 border-b border-arena">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Logo y nombre */}
        <a href="/" className="flex items-center text-2xl font-display font-bold text-terra-cotta tracking-tight gap-2 px-2 py-1">
          🧭 Terreta Hub
        </a>
        {/* Menu desktop */}
        <div className="hidden md:flex gap-1 items-center">
          {menu.map((item) => (
            <div key={item.label} className="relative group">
              <button
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
                onFocus={() => setOpenDropdown(item.label)}
                className={cn(
                  "flex gap-1 font-semibold px-4 py-2 rounded-xl transition hover:bg-arena/80 items-center text-negro-suave"
                )}
              >
                {item.label}
                <ArrowDown className="w-4 h-4" />
              </button>
              <div
                className={cn(
                  "absolute left-0 top-12 min-w-[170px] rounded-2xl bg-white border border-arena shadow-xl transition opacity-0 pointer-events-none z-50 group-hover:opacity-100 group-hover:pointer-events-auto",
                  openDropdown === item.label && "opacity-100 pointer-events-auto"
                )}
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <ul className="py-2">
                  {item.children.map((sub) => (
                    <li key={sub.label}>
                      <a
                        href={sub.href}
                        className="block px-6 py-2 text-negro-suave hover:bg-terra-cotta/10 transition rounded-xl"
                      >
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <a
            href="#"
            className="ml-2 btn-terra shadow-card hover:shadow-lg"
          >
            Login / Perfil
          </a>
        </div>
        {/* Menu mobile (icono hamburger) - placeholder */}
        <div className="md:hidden flex items-center">
          <button className="btn-terra p-2 text-lg">☰</button>
        </div>
      </div>
    </nav>
  );
}
