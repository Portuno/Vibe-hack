
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

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
  const { session, profile, signOut } = useAuth();

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
          {session ? (
            profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border-2 border-arena">
                      <AvatarImage
                        src={profile.avatar_url ?? ""}
                        alt={profile.name}
                      />
                      <AvatarFallback>
                        {profile.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/mi-perfil" className="cursor-pointer w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="h-10 w-10 rounded-full bg-arena animate-pulse" />
            )
          ) : (
            <Button asChild className="ml-2 bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card hover:shadow-lg">
              <Link to="/auth">Login / Registrarse</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
