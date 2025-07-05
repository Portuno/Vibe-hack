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
import { LogOut, User, Search, Menu } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  // --- Buscador semántico ---
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
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
    <nav className="sticky top-0 w-full z-30 bg-crema backdrop-blur-md shadow-card px-2 sm:px-4 py-2 border-b border-arena">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-8">
        {/* Logo - Más compacto en móvil */}
        <Link
          to="/"
          className="flex items-center text-lg sm:text-2xl font-display font-bold text-terra-cotta tracking-tight gap-1 sm:gap-2 px-1 sm:px-2 py-1 flex-shrink-0"
        >
          <img
            src="/lovable-uploads/d22d48c9-9c4a-4a8f-8b75-5e286178de8a.png"
            alt="Logo Terreta"
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-arena object-contain"
            style={{ boxShadow: '0 2px 8px 0 rgba(216,108,91,0.15)' }}
          />
          <span className="hidden xs:inline">Terreta Hub</span>
          <span className="xs:hidden">TH</span>
        </Link>

        {/* Menú desktop - Oculto en móvil */}
        {!isMobile && (
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
        )}

        {/* Controles de la derecha */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Buscador */}
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="rounded-full border-arena p-2" 
            onClick={() => setOpen(true)} 
            aria-label="Búsqueda global"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Menú móvil */}
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full border-arena p-2">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-crema w-[280px]">
                <SheetHeader>
                  <SheetTitle className="text-terra-cotta font-display">Navegación</SheetTitle>
                  <SheetDescription className="text-gris-piedra">
                    Explora todas las secciones de Terreta Hub
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-negro-suave mb-2">Comunidad</h3>
                    <div className="space-y-2 ml-2">
                      {comunidadComponents.map((item) => (
                        <Link
                          key={item.title}
                          to={item.href}
                          className="block text-sm text-gris-piedra hover:text-terra-cotta transition-colors py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-negro-suave mb-2">Recursos</h3>
                    <div className="space-y-2 ml-2">
                      {recursosComponents.map((item) => (
                        <Link
                          key={item.title}
                          to={item.href}
                          className="block text-sm text-gris-piedra hover:text-terra-cotta transition-colors py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <Link
                      to="/chipi"
                      className="block font-semibold text-negro-suave hover:text-terra-cotta transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Chipi
                    </Link>
                    <Link
                      to="/contacto"
                      className="block font-semibold text-negro-suave hover:text-terra-cotta transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contacto
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Login/Perfil */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0"
                >
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-arena">
                    <AvatarImage
                      src={profile?.avatar_url ?? ""}
                      alt={profile?.name ?? "Avatar de usuario"}
                    />
                    <AvatarFallback className="text-xs sm:text-sm">
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
            <Button 
              asChild 
              size={isMobile ? "sm" : "default"}
              className="bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card hover:shadow-lg text-xs sm:text-sm px-2 sm:px-4"
            >
              <Link to="/auth">
                <span className="hidden sm:inline">Login / Registrarse</span>
                <span className="sm:hidden">Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Dialog de búsqueda */}
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
