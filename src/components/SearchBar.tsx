
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-piedra" />
      <Input
        type="text"
        placeholder={placeholder || "Buscar cursos, talleres, creadores..."}
        className="pl-10 pr-4 py-2 bg-crema border-arena text-base placeholder:text-gris-piedra"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
