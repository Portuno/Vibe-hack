
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
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
import { LogOut, User, Search } from "lucide-react";
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
import { CommandDialog, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";

const comunidadComponents = [
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

const recursosComponents = [
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

  // --- Buscador semántico ---
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();

  // --- Hacer que el buscador esté siempre visible en navbar ---
  // Simulación de resultados (en futuro, fetch dinámico)
  const results = [
    {
      section: "Proyectos",
      label: "Plataforma de eventos open source",
      value: "/proyectos",
    },
    {
      section: "Profesionales",
      label: "Marta Gómez",
      value: "/profesionales",
    },
    {
      section: "Recursos",
      label: "Guía de Notion para emprender",
      value: "/recursos",
    },
    {
      section: "Cursos",
      label: "Introducción práctica a la programación web",
      value: "/cursos",
    },
    {
      section: "Blog",
      label: "Cómo crear tu primer startup",
      value: "/blog",
    },
    {
      section: "Eventos",
      label: "Meetup de innovación legal",
      value: "/eventos",
    }
  ].filter(r =>
    search.length === 0
      ? false
      : r.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        r.section.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <nav className="sticky top-0 w-full z-30 bg-crema backdrop-blur-md shadow-card px-0 py-2 border-b border-arena">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center text-2xl font-display font-bold text-terra-cotta tracking-tight gap-2 px-2 py-1"
        >
          <img
            src="/lovable-uploads/d22d48c9-9c4a-4a8f-8b75-5e286178de8a.png"
            alt="Logo Terreta"
            className="w-8 h-8 mr-1 sm:mr-2 rounded-full bg-arena object-contain"
            style={{ boxShadow: '0 2px 8px 0 rgba(216,108,91,0.15)' }}
          />
          Terreta Hub
        </Link>
        {/* Menú central */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-semibold px-4 py-2 rounded-xl transition hover:bg-arena focus:bg-arena text-negro-suave data-[state=open]:bg-arena">Comunidad</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-crema">
                  <ul className="grid grid-cols-1 gap-3 p-4 w-[300px] md:w-[400px]">
                    {comunidadComponents.map((component) => (
                      <ForwardedListItem
                        key={component.title}
                        title={component.title}
                        to={component.href}
                      >
                        {component.description}
                      </ForwardedListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-semibold px-4 py-2 rounded-xl transition hover:bg-arena focus:bg-arena text-negro-suave data-[state=open]:bg-arena">Recursos</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-crema">
                  <ul className="grid grid-cols-1 gap-3 p-4 w-[300px] md:w-[400px]">
                    {recursosComponents.map((component) => (
                      <ForwardedListItem
                        key={component.title}
                        title={component.title}
                        to={component.href}
                      >
                        {component.description}
                      </ForwardedListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/chipi" className={cn(navigationMenuTriggerStyle(), "bg-transparent font-semibold px-4 py-2 rounded-xl transition hover:bg-arena focus:bg-arena text-negro-suave")}>
                  Chipi
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contacto" className={cn(navigationMenuTriggerStyle(), "bg-transparent font-semibold px-4 py-2 rounded-xl transition hover:bg-arena focus:bg-arena text-negro-suave")}>
                  Contacto
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* --- Buscador semántico SIEMPRE visible (no solo con botón) --- */}
        <div className="flex items-center gap-2">
          <div>
            <Button variant="outline" className="rounded-full border-arena" onClick={() => setOpen(true)} aria-label="Búsqueda global">
              <Search className="w-5 h-5" />
              <span className="sr-only">Buscar en Terreta Hub</span>
            </Button>
            <CommandDialog open={open} onOpenChange={(o) => { setOpen(o); setSearch(""); }}>
              <CommandInput
                autoFocus
                value={search}
                onValueChange={setSearch}
                placeholder="Buscá profesionales, recursos, proyectos, cursos..."
              />
              <CommandList>
                {results.length === 0 && search.length > 0 ? (
                  <CommandEmpty>No se encontraron coincidencias.</CommandEmpty>
                ) : (
                  results.map((item, idx) => (
                    <CommandItem
                      key={item.section + item.label + idx}
                      value={item.value}
                      onSelect={() => {
                        setOpen(false);
                        navigate(item.value);
                      }}
                    >
                      <span className="font-semibold mr-2 text-mediterraneo">{item.section}:</span> {item.label}
                    </CommandItem>
                  ))
                )}
              </CommandList>
            </CommandDialog>
          </div>
          {/* Botón Login/Perfil a la derecha  */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-arena">
                    <AvatarImage
                      src={profile?.avatar_url ?? ""}
                      alt={profile?.name ?? "Avatar de usuario"}
                    />
                    <AvatarFallback>
                      {profile?.name
                        ? profile.name.charAt(0).toUpperCase()
                        : session.user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-crema" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.name ?? session.user.email}
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
            <Button asChild className="ml-2 bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card hover:shadow-lg">
              <Link to="/auth">Login / Registrarse</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

type ListItemProps = {
  className?: string;
  title: string;
  to: string;
  children?: React.ReactNode;
};

function ListItem(
  { className, title, to, children }: ListItemProps,
  ref: React.Ref<HTMLAnchorElement>
) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          to={to}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
const ForwardedListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(ListItem);
ForwardedListItem.displayName = "ListItem";
