
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

// Opciones verticales
const VERTICALES = [
  "Tecnología",
  "Derecho",
  "Finanzas",
  "Salud",
  "Arte",
  "Comunidad",
  "Otro",
];

const INTERESES = [
  { label: "Compartir mis proyectos", value: "proyectos" },
  { label: "Colaborar con otras personas", value: "colaborar" },
  { label: "Subir recursos o guías", value: "recursos" },
  { label: "Participar en eventos", value: "eventos" },
  { label: "Aprender de la comunidad", value: "aprender" },
  { label: "Ofrecer mentoría", value: "mentoria" },
  { label: "Buscar oportunidades laborales", value: "empleo" },
  { label: "Inspirarme / explorar", value: "explorar" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();

  // Estados de cada slide y sus campos
  const [slide, setSlide] = useState(0);
  const [nombreVisible, setNombreVisible] = useState("");
  const [headline, setHeadline] = useState("");
  const [verticales, setVerticales] = useState<string[]>([]);
  const [otroVertical, setOtroVertical] = useState("");
  const [intereses, setIntereses] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  useEffect(() => {
    // Si el usuario ya tiene el perfil completo, salta el onboarding
    if (!loading && profile && profile.display_name && profile.headline && profile.vertical && profile.skills && profile.what_i_am_looking_for && profile.bio) {
      navigate("/");
    }
    // Si no hay sesión, redirigir al login
    if (!loading && !session) {
      navigate("/auth");
    }
    // Si hay data parcial, precarga los campos
    if (profile) {
      setNombreVisible(profile.display_name || "");
      setHeadline(profile.headline || "");
      setVerticales(profile.skills || []);
      setBio(profile.bio || "");
      // Los intereses y what_i_am_looking_for podrían necesitar más lógica según cómo los guardas
    }
  }, [profile, loading, session, navigate]);

  // Valida y pasa al siguiente paso
  const handleNext = async () => {
    // Slide 2 (nombre visible) obligatorio
    if (slide === 1 && !nombreVisible.trim()) {
      toast({
        title: "Campo obligatorio",
        description: "Por favor ingresa un nombre visible.",
        variant: "destructive",
      });
      return;
    }
    // Slide 4: if "Otro" está seleccionado pero no completaron el campo
    if (slide === 3 && verticales.includes("Otro") && !otroVertical.trim()) {
      toast({
        title: "Especifica el área",
        description: "Por favor indica el área 'Otro'.",
        variant: "destructive",
      });
      return;
    }
    // Slide 6: limitar longitud de bio
    if (slide === 5 && bio.length > 500) {
      toast({
        title: "Bio demasiado larga",
        description: "El texto debe tener máximo 500 caracteres.",
        variant: "destructive",
      });
      return;
    }
    setSlide(slide + 1);
  };

  // Guarda el perfil al terminar
  const handleFinish = async () => {
    // Prepara verticales
    let finalVerticales = verticales;
    if (verticales.includes("Otro") && otroVertical.trim()) {
      finalVerticales = verticales.filter(v => v !== "Otro").concat([otroVertical]);
    }
    try {
      await supabase
        .from("professional_profiles")
        .update({
          display_name: nombreVisible,
          headline,
          vertical: finalVerticales[0] || "",
          skills: finalVerticales,
          interests: intereses,
          what_i_am_looking_for: intereses.join(", "),
          bio,
          is_public: true
        })
        .eq("user_id", session?.user.id);
      toast({
        title: "¡Perfecto!",
        description: "Tu perfil inicial ha sido creado.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "No se pudo completar el onboarding",
        description: error?.message || "Hubo un problema",
        variant: "destructive"
      });
    }
  };

  // Componente de la slide
  function renderSlide() {
    switch (slide) {
      case 0:
        return (
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-display text-terra-cotta mb-4">¡Hola! Soy Chipi. Bienvenid@ a Terreta Hub</h2>
            <p>Este lugar está lleno de ideas, talento y ganas de crear.<br />Antes de que empieces a explorar, ¿te parece si nos conocemos un poco mejor?</p>
            <Button className="mt-8 bg-terra-cotta hover:bg-terra-cotta/90" onClick={handleNext}>Empezar</Button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">¿Cómo te presentamos ante la comunidad?</h2>
            <p>Puedes usar tu nombre completo, alias profesional, o como prefieras que te llamen aquí.</p>
            <Input
              type="text"
              placeholder="Nombre visible*"
              required
              value={nombreVisible}
              onChange={e => setNombreVisible(e.target.value)}
              maxLength={80}
            />
            <Button className="bg-terra-cotta" onClick={handleNext}>Siguiente</Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">¿A qué te dedicas?</h2>
            <p>Cuenta en pocas palabras tu rol principal o lo que mejor te define.</p>
            <Input
              type="text"
              placeholder="Ejemplo: Observador profesional de aves"
              value={headline}
              maxLength={100}
              onChange={e => setHeadline(e.target.value)}
            />
            <Button className="bg-terra-cotta" onClick={handleNext}>Siguiente</Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">¿Qué áreas te interesan o forman parte de tu trabajo?</h2>
            <p>Seleccioná una o varias. Así podemos mostrarte contenido más relevante.</p>
            <div className="flex flex-wrap gap-2">
              {VERTICALES.map(vert => (
                <label key={vert} className="flex items-center gap-2">
                  <Checkbox
                    checked={verticales.includes(vert)}
                    onCheckedChange={(checked) => {
                      setVerticales(checked
                        ? [...verticales, vert]
                        : verticales.filter(item => item !== vert));
                    }}
                  /> {vert}
                </label>
              ))}
            </div>
            {verticales.includes("Otro") && (
              <Input
                type="text"
                placeholder="¿Cuál?"
                value={otroVertical}
                onChange={e => setOtroVertical(e.target.value)}
                className="mt-2"
                maxLength={50}
              />
            )}
            <Button className="bg-terra-cotta" onClick={handleNext}>Siguiente</Button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">¿Qué te gustaría encontrar en Terreta Hub?</h2>
            <p>Marcá todo lo que te interese. Esto nos ayuda a personalizar tu experiencia.</p>
            <div className="flex flex-wrap gap-2">
              {INTERESES.map(opt => (
                <label key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={intereses.includes(opt.label)}
                    onCheckedChange={(checked) => {
                      setIntereses(checked
                        ? [...intereses, opt.label]
                        : intereses.filter(item => item !== opt.label));
                    }}
                  /> 
                  {opt.label}
                </label>
              ))}
            </div>
            <Button className="bg-terra-cotta" onClick={handleNext}>Siguiente</Button>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">Contanos un poco más sobre vos</h2>
            <p>
              Escribí una breve presentación para que los demás sepan quién sos, qué hacés o qué te apasiona.
              <span className="ml-2 text-xs text-muted-foreground">(Este texto se mostrará en tu perfil)</span>
            </p>
            <Textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={500}
              placeholder="Máx. 500 caracteres"
              className="resize-none"
            />
            <Button className="bg-terra-cotta" onClick={handleNext}>Siguiente</Button>
          </div>
        );
      case 6:
        return (
          <div className="text-center space-y-5">
            <h2 className="text-3xl font-display text-terra-cotta mb-2">¡Todo listo!</h2>
            <p>Ya puedes empezar a explorar perfiles, descubrir proyectos o compartir lo tuyo. Esta comunidad es tan activa como vos quieras que sea.</p>
            <Button className="bg-terra-cotta" onClick={handleFinish}>Ir al inicio</Button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-crema px-2">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl p-8">
        {renderSlide()}
      </div>
    </div>
  );
}
