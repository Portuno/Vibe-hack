
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { VERTICALES, INTERESES } from "@/constants/onboarding";
import { Dispatch, SetStateAction } from "react";
import { Users, Star, Info, CheckCircle, ChevronRight, Edit3 } from "lucide-react";

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

function SlideWrapper({ children }: { children: React.ReactNode }) {
  // Card centrada, máx ancho, padding, fondo blanco, sombra, bordes redondeados
  return (
    <div className="
      flex flex-col items-center justify-center 
      bg-white rounded-2xl shadow-card p-6 md:px-16 w-full
      min-h-[360px] max-w-2xl mx-auto
      animate-fade-in-up
    ">
      {children}
    </div>
  );
}

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

  // Utilidad para títulos grandes y bonitos
  const StepTitle = ({ icon, children }: { icon: React.ReactNode, children: React.ReactNode }) => (
    <h2 className="flex items-center gap-2 justify-center text-xl sm:text-2xl md:text-3xl font-display font-bold text-terra-cotta mb-2 animate-fade-in-up">
      <span className="">{icon}</span>
      <span>{children}</span>
    </h2>
  );

  switch (slide) {
    case 0:
      return (
        <SlideWrapper>
          <div className="flex flex-col items-center justify-center gap-2 w-full">
            <img src="https://lovable.dev/opengraph-image-p98pqg.png" alt="Terreta Hub Logo" className="w-16 h-16 rounded-full shadow-sm mb-2" />
            <h2 className="text-3xl md:text-4xl font-display text-terra-cotta font-bold mb-2 drop-shadow animate-fade-in-up text-center">
              ¡Hola! Soy Chipi. Bienvenid@ a Terreta Hub
            </h2>
            <p className="mb-2 text-md sm:text-lg text-mediterraneo font-semibold animate-fade-in-up text-center">
              Este lugar está lleno de ideas, talento y ganas de crear.<br />
              <span className="font-normal text-negro-suave/80">Antes de que empieces a explorar, ¿te parece si nos conocemos un poco mejor?</span>
            </p>
            <Button 
              className="mt-6 gap-2 bg-terra-cotta hover:bg-terra-cotta/90 w-full sm:w-auto text-base px-8 py-3 rounded-xl shadow-card transition-transform hover:scale-105"
              onClick={handleNext}
              size="lg"
            >
              Empezar <ChevronRight className="ml-1" />
            </Button>
          </div>
        </SlideWrapper>
      );
    case 1:
      return (
        <SlideWrapper>
          <StepTitle icon={<Users className="text-terra-cotta" />}>
            ¿Cómo te presentamos <span className="hidden sm:inline">ante la comunidad</span>?
          </StepTitle>
          <p className="text-mediterraneo text-center max-w-sm mb-2 animate-fade-in-up">
            Puedes usar tu nombre completo, alias profesional o como prefieras que te llamen aquí.
          </p>
          <div className="w-full max-w-xs flex flex-col gap-2 items-center">
            <Input
              type="text"
              placeholder="Nombre visible*"
              required
              value={nombreVisible}
              onChange={e => setNombreVisible(e.target.value)}
              maxLength={80}
              className="text-center text-lg border-terra-cotta focus:border-terra-cotta focus:ring-terra-cotta/60 font-semibold"
            />
          </div>
          <Button 
            className="mt-6 bg-terra-cotta w-full sm:w-auto text-base px-8 py-3 rounded-xl shadow-card"
            onClick={handleNext}
            size="lg"
          >
            Siguiente <ChevronRight className="ml-1" />
          </Button>
        </SlideWrapper>
      );
    case 2:
      return (
        <SlideWrapper>
          <StepTitle icon={<Edit3 className="text-terra-cotta" />}>
            ¿A qué te dedicas?
          </StepTitle>
          <p className="text-mediterraneo text-center max-w-md mb-2">
            Cuenta en pocas palabras tu rol principal o lo que mejor te define. 
          </p>
          <Input
            type="text"
            placeholder="Ejemplo: Observador profesional de aves"
            value={headline}
            maxLength={100}
            onChange={e => setHeadline(e.target.value)}
            className="text-center border-terra-cotta focus:border-terra-cotta focus:ring-terra-cotta/60 font-medium"
          />
          <Button 
            className="mt-6 bg-terra-cotta w-full sm:w-auto text-base px-8 py-3 rounded-xl shadow-card"
            onClick={handleNext}
            size="lg"
          >
            Siguiente <ChevronRight className="ml-1" />
          </Button>
        </SlideWrapper>
      );
    case 3:
      return (
        <SlideWrapper>
          <StepTitle icon={<Star className="text-terra-cotta" />}>
            ¿Qué áreas te interesan o forman parte de tu trabajo?
          </StepTitle>
          <p className="text-mediterraneo text-center max-w-md mb-2">
            Seleccioná una o varias. Así podemos mostrarte contenido más relevante.
          </p>
          <div className="flex flex-wrap justify-center gap-3 w-full mb-2">
            {VERTICALES.map(vert => (
              <label 
                key={vert} 
                className={`
                  flex items-center gap-2 rounded-lg px-3 py-1.5
                  bg-arena border border-gris-piedra
                  font-medium cursor-pointer transition-all
                  ${verticales.includes(vert) ? 'border-terra-cotta bg-terra-cotta/10 text-terra-cotta shadow-sm' : 'hover:border-terra-cotta/70'}
                `}
              >
                <Checkbox
                  checked={verticales.includes(vert)}
                  onCheckedChange={(checked) => {
                    setVerticales(checked
                      ? [...verticales, vert]
                      : verticales.filter(item => item !== vert));
                  }}
                />
                {vert}
              </label>
            ))}
          </div>
          {verticales.includes("Otro") && (
            <Input
              type="text"
              placeholder="¿Cuál?"
              value={otroVertical}
              onChange={e => setOtroVertical(e.target.value)}
              className="mt-2 border-terra-cotta focus:border-terra-cotta focus:ring-terra-cotta/50 w-full max-w-xs"
              maxLength={50}
            />
          )}
          <Button 
            className="mt-6 bg-terra-cotta w-full sm:w-auto text-base px-8 py-3 rounded-xl"
            onClick={handleNext}
            size="lg"
          >
            Siguiente <ChevronRight className="ml-1" />
          </Button>
        </SlideWrapper>
      );
    case 4:
      return (
        <SlideWrapper>
          <StepTitle icon={<Info className="text-terra-cotta" />}>
            ¿Qué te gustaría encontrar en Terreta Hub?
          </StepTitle>
          <p className="text-mediterraneo text-center max-w-md mb-2">
            Marcá todo lo que te interese. Esto nos ayuda a personalizar tu experiencia.
          </p>
          <div className="flex flex-wrap justify-center gap-3 w-full mb-2">
            {INTERESES.map(opt => (
              <label 
                key={opt.value} 
                className={`
                  flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all bg-arena border border-gris-piedra font-medium cursor-pointer
                  ${intereses.includes(opt.label) ? 'border-mediterraneo bg-mediterraneo/10 text-mediterraneo shadow-sm' : 'hover:border-mediterraneo/70'}
                `}
              >
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
          <Button 
            className="mt-6 bg-terra-cotta w-full sm:w-auto text-base px-8 py-3 rounded-xl"
            onClick={handleNext}
            size="lg"
          >
            Siguiente <ChevronRight className="ml-1" />
          </Button>
        </SlideWrapper>
      );
    case 5:
      return (
        <SlideWrapper>
          <StepTitle icon={<Edit3 className="text-terra-cotta" />}>
            Contanos un poco más sobre vos
          </StepTitle>
          <p className="text-mediterraneo text-center max-w-md mb-2">
            Escribí una breve presentación para que los demás sepan quién sos, qué hacés o qué te apasiona.<br/>
            <span className="ml-2 text-xs text-gris-piedra">(Este texto se mostrará en tu perfil)</span>
          </p>
          <Textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={500}
            placeholder="Máx. 500 caracteres"
            className="resize-none border-terra-cotta focus:border-terra-cotta focus:ring-terra-cotta/50 w-full text-base font-medium"
            rows={5}
          />
          <Button 
            className="mt-6 bg-terra-cotta w-full sm:w-auto text-base px-8 py-3 rounded-xl"
            onClick={handleNext}
            size="lg"
          >
            Siguiente <ChevronRight className="ml-1" />
          </Button>
        </SlideWrapper>
      );
    case 6:
      return (
        <SlideWrapper>
          <CheckCircle className="mx-auto text-verde-olivo mb-3" size={52} />
          <h2 className="text-3xl font-display text-terra-cotta font-bold mb-2 animate-fade-in-up text-center">
            ¡Todo listo!
          </h2>
          <p className="mb-2 text-lg text-mediterraneo font-semibold animate-fade-in-up text-center">
            Ya puedes empezar a explorar perfiles, descubrir proyectos o compartir lo tuyo.<br/> 
            Esta comunidad es tan activa como vos quieras que sea.
          </p>
          <Button 
            className="mt-6 w-full sm:w-auto bg-mediterraneo text-white text-base px-8 py-3 rounded-xl shadow-card transition-transform hover:scale-105"
            onClick={handleFinish}
            size="lg"
          >
            Ir al inicio <ChevronRight className="ml-1" />
          </Button>
        </SlideWrapper>
      );
    default:
      return null;
  }
}

