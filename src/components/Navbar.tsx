
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
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
import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const comunidadComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Proyectos",
    href: "/proyectos",
    description: "Explora los proyectos de la comunidad.",
  },
  {
    title: "Eventos",
    href: "/eventos",
    description: "Participa en nuestros eventos y meetups.",
  },
  {
    title: "Profesionales",
    href: "/profesionales",
    description: "Conecta con otros profesionales de la terreta.",
  },
];

const recursosComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Cursos",
    href: "/cursos",
    description: "Formación y cursos para mejorar tus habilidades.",
  },
  {
    title: "Recursos",
    href: "/recursos",
    description: "Una biblioteca de recursos útiles y herramientas.",
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Artículos y noticias de interés para la comunidad.",
  },
];

export default function Navbar() {
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
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-semibold px-4 py-2 rounded-xl transition hover:bg-arena/80 focus:bg-arena text-negro-suave data-[state=open]:bg-arena">Comunidad</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid grid-cols-1 gap-3 p-4 w-[300px] md:w-[400px]">
                    {comunidadComponents.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        to={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-semibold px-4 py-2 rounded-xl transition hover:bg-arena/80 focus:bg-arena text-negro-suave data-[state=open]:bg-arena">Recursos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid grid-cols-1 gap-3 p-4 w-[300px] md:w-[400px]">
                    {recursosComponents.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        to={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/chipi" className={cn(navigationMenuTriggerStyle(), "bg-transparent font-semibold px-4 py-2 rounded-xl transition hover:bg-arena/80 focus:bg-arena text-negro-suave")}>
                  Chipi
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contacto" className={cn(navigationMenuTriggerStyle(), "bg-transparent font-semibold px-4 py-2 rounded-xl transition hover:bg-arena/80 focus:bg-arena text-negro-suave")}>
                  Contacto
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

