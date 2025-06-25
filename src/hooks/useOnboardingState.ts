
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { VERTICALES, INTERESES } from "@/constants/onboarding";

// Hook para manejar todo el estado y lógica del onboarding
export function useOnboardingState() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, profile, loading } = useAuth();
  
  // Obtener la URL de redirect de los parámetros de búsqueda
  const redirectTo = searchParams.get("redirect") || "/";

  // Slides: 0 = bienvenida, 1 = nombre, etc
  const [slide, setSlide] = useState(0);
  const [nombreVisible, setNombreVisible] = useState("");
  const [headline, setHeadline] = useState("");
  const [verticales, setVerticales] = useState<string[]>([]);
  const [otroVertical, setOtroVertical] = useState("");
  const [intereses, setIntereses] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!loading && profile && profile.display_name && profile.headline && profile.vertical && profile.skills && profile.what_i_am_looking_for && profile.bio) {
      navigate(redirectTo);
    }
    if (!loading && !session) {
      navigate("/auth");
    }
    if (profile) {
      setNombreVisible(profile.display_name || "");
      setHeadline(profile.headline || "");
      setVerticales(profile.skills || []);
      setBio(profile.bio || "");
    }
  }, [profile, loading, session, navigate, redirectTo]);

  function slideValidation() {
    // Slide 2 (nombre visible) obligatorio
    if (slide === 1 && !nombreVisible.trim()) {
      toast({
        title: "Campo obligatorio",
        description: "Por favor ingresa un nombre visible.",
        variant: "destructive",
      });
      return false;
    }
    // Slide 4: if "Otro" está seleccionado pero no completaron el campo
    if (slide === 3 && verticales.includes("Otro") && !otroVertical.trim()) {
      toast({
        title: "Especifica el área",
        description: "Por favor indica el área 'Otro'.",
        variant: "destructive",
      });
      return false;
    }
    // Slide 6: limitar longitud de bio
    if (slide === 5 && bio.length > 500) {
      toast({
        title: "Bio demasiado larga",
        description: "El texto debe tener máximo 500 caracteres.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }

  const handleNext = () => {
    if (!slideValidation()) return;
    setSlide(slide + 1);
  };

  const handleFinish = async () => {
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
          is_public: true,
        })
        .eq("user_id", session?.user.id);
      toast({
        title: "¡Perfecto!",
        description: "Tu perfil inicial ha sido creado.",
      });
      navigate(redirectTo);
    } catch (error: any) {
      toast({
        title: "No se pudo completar el onboarding",
        description: error?.message || "Hubo un problema",
        variant: "destructive"
      });
    }
  };

  return {
    slide,
    setSlide,
    nombreVisible,
    setNombreVisible,
    headline,
    setHeadline,
    verticales,
    setVerticales,
    otroVertical,
    setOtroVertical,
    intereses,
    setIntereses,
    bio,
    setBio,
    handleNext,
    handleFinish,
  };
}
