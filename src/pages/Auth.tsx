
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, onboardingRequired, profile, loading: authLoading } = useAuth();

  // Ref para evitar doble navegación
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    // Si no está cargando el auth y hay sesión
    if (!authLoading && session && onboardingRequired && !hasCheckedOnboarding) {
      setHasCheckedOnboarding(true);
      navigate("/onboarding", { replace: true });
    } else if (!authLoading && session && !onboardingRequired && !hasCheckedOnboarding) {
      setHasCheckedOnboarding(true);
      navigate("/", { replace: true });
    }
    // Si se destruye el componente (logout, etc), resetea el flag
    if (!session) {
      setHasCheckedOnboarding(false);
    }
  }, [session, onboardingRequired, authLoading, navigate, hasCheckedOnboarding]);

  // Si el perfil recién se cargó después y no se chequeó aún, chequea de nuevo
  useEffect(() => {
    if (session && typeof onboardingRequired === "boolean" && !hasCheckedOnboarding) {
      setHasCheckedOnboarding(false); // Fuerza el paso anterior a re-evaluarse
    }
  }, [profile, session, onboardingRequired]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });
      // No navegamos manualmente, esperar redirección por efecto
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      toast({
        title: "Error al registrarse",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Registro exitoso!",
        description: "Revisa tu correo para verificar tu cuenta.",
      });
    }
    setLoading(false);
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
  }

  return (
    <>
    <Navbar />
    <div className="w-full h-[calc(100vh-68px)] flex items-center justify-center bg-crema">
      <Tabs defaultValue="login" className="w-[400px]" onValueChange={clearForm}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Iniciar sesión</CardTitle>
              <CardDescription>
                Accede a tu cuenta de Terreta Hub.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email-login">Email</Label>
                    <Input id="email-login" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password-login">Contraseña</Label>
                    <Input id="password-login" type="password" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4 bg-terra-cotta hover:bg-terra-cotta/90" disabled={loading}>
                  {loading ? 'Cargando...' : 'Iniciar sesión'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Registrarse</CardTitle>
              <CardDescription>
                Crea una nueva cuenta en Terreta Hub.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                 <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email-register">Email</Label>
                    <Input id="email-register" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password-register">Contraseña</Label>
                    <Input id="password-register" type="password" placeholder="Crea una contraseña segura" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4 bg-terra-cotta hover:bg-terra-cotta/90" disabled={loading}>
                  {loading ? 'Cargando...' : 'Crear cuenta'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}

