
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <Card className="overflow-hidden bg-crema shadow-card hover-scale duration-300 transition hover:shadow-lg group flex flex-col h-full">
      <div className="h-40 w-full bg-arena flex items-center justify-center overflow-hidden">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="object-cover w-full h-full group-hover:scale-105 transition"
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
  );
}
