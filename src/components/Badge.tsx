
import { cn } from "@/lib/utils";

type Colors = "Legal" | "Arte" | "Tecnología" | "Educación" | "Ciencia" | "Social";

const badgeColor: Record<Colors, string> = {
  Legal: "bg-mediterraneo text-white",
  Arte: "bg-terra-cotta text-white",
  Tecnología: "bg-verde-olivo text-white",
  Educación: "bg-arena text-negro-suave",
  Ciencia: "bg-gray-200 text-gris-piedra",
  Social: "bg-rojo-oxidado text-white",
};

export function Badge({ label, vertical }: { label: string; vertical: Colors }) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold px-3 py-1 rounded-xl mr-2 select-none shadow-sm",
        badgeColor[vertical] || "bg-arena"
      )}
    >
      {label}
    </span>
  );
}
