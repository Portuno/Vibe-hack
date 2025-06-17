
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, User } from "lucide-react";

type Course = {
  id: string;
  title: string;
  description_short: string;
  image?: string;
  verticals: string[];
  creator: {
    name: string;
    avatar_url: string;
  };
  level: "Básico" | "Intermedio" | "Avanzado";
  type: "Gratuito" | "Pago";
  tag?: "Nuevo" | "Destacado";
};

export function CourseCard({ course }: { course: Course }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card 
        className="overflow-hidden bg-crema shadow-card hover-scale duration-300 transition hover:shadow-lg group flex flex-col h-full cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="h-40 w-full bg-arena flex items-center justify-center overflow-hidden">
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              className="object-cover w-full h-full group-hover:scale-105 transition"
              onError={(e) => {
                // Si la imagen falla, mostrar el emoji por defecto
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl bg-arena text-mediterraneo">🎓</div>';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-arena text-mediterraneo">
              🎓
            </div>
          )}
        </div>
        <CardContent className="flex flex-col gap-3 p-4 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {course.tag && (
              <Badge variant="secondary" className="uppercase">{course.tag}</Badge>
            )}
            {course.verticals.map(v => (
              <Badge variant="outline" key={v}>{v}</Badge>
            ))}
          </div>
          <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
          <p className="text-gris-piedra text-base line-clamp-2">{course.description_short}</p>
          <div className="flex gap-2 items-center mt-auto">
            <img
              src={course.creator.avatar_url}
              alt={course.creator.name}
              className="size-8 rounded-full border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=terreta";
              }}
            />
            <span className="text-sm text-mediterraneo">{course.creator.name}</span>
          </div>
          <div className="flex gap-2 items-center flex-wrap pt-2">
            <Badge variant="outline">{course.level}</Badge>
            <Badge variant={course.type === "Gratuito" ? "secondary" : "default"}>
              {course.type}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles del curso */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-terra-cotta">
              {course.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Imagen destacada */}
            {course.image && (
              <div className="w-full h-64 bg-arena rounded-lg overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-6xl bg-arena text-mediterraneo">🎓</div>';
                  }}
                />
              </div>
            )}

            {/* Información del creador */}
            <div className="flex items-center gap-3 p-4 bg-arena rounded-lg">
              <img
                src={course.creator.avatar_url}
                alt={course.creator.name}
                className="size-12 rounded-full border-2 border-mediterraneo"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=terreta";
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-mediterraneo" />
                  <span className="font-semibold text-mediterraneo">Creado por</span>
                </div>
                <p className="text-lg font-bold">{course.creator.name}</p>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-mediterraneo">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{course.description_short}</p>
            </div>

            {/* Detalles del curso */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-mediterraneo mb-2">Nivel</h4>
                <Badge variant="outline" className="text-sm">{course.level}</Badge>
              </div>
              <div>
                <h4 className="font-semibold text-mediterraneo mb-2">Tipo</h4>
                <Badge variant={course.type === "Gratuito" ? "secondary" : "default"} className="text-sm">
                  {course.type}
                </Badge>
              </div>
            </div>

            {/* Categorías */}
            <div>
              <h4 className="font-semibold text-mediterraneo mb-2">Categorías</h4>
              <div className="flex flex-wrap gap-2">
                {course.verticals.map(v => (
                  <Badge variant="outline" key={v}>{v}</Badge>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                className="flex-1 bg-terra-cotta hover:bg-terra-cotta/80"
                onClick={() => {
                  // Aquí podrías redirigir a una página específica del curso
                  console.log("Acceder al curso:", course.id);
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Acceder al curso
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowDetails(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
