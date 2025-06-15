
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { VERTICALES, INTERESES } from "@/constants/onboarding";
import { Dispatch, SetStateAction } from "react";

type Props = {
  slide: number;
  nombreVisible: string;
  setNombreVisible: Dispatch<SetStateAction<string>>;
  headline: string;
  setHeadline: Dispatch<SetStateAction<string>>;
  verticales: string[];
  setVerticales: Dispatch<SetStateAction<string[]>>;
  otroVertical: string;
  setOtroVertical: Dispatch<SetStateAction<string>>;
  intereses: string[];
  setIntereses: Dispatch<SetStateAction<string[]>>;
  bio: string;
  setBio: Dispatch<SetStateAction<string>>;
  handleNext: () => void;
  handleFinish: () => void;
};

export function OnboardingSlides({
  slide,
  nombreVisible, setNombreVisible,
  headline, setHeadline,
  verticales, setVerticales,
  otroVertical, setOtroVertical,
  intereses, setIntereses,
  bio, setBio,
  handleNext,
  handleFinish
}: Props) {

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
