
const FORMATS = [
  { id: "todos", label: "Todos" },
  { id: "video", label: "Video" },
  { id: "artículo", label: "Artículo" },
  { id: "podcast", label: "Podcast" },
  { id: "guía", label: "Guía" },
  { id: "documento", label: "Documento" },
  { id: "tool", label: "Tool" },
  { id: "plantilla", label: "Plantilla" },
];

export function FormatFilterBar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (format: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {FORMATS.map(f => (
        <button
          key={f.id}
          className={`px-4 py-1 rounded-full text-sm font-medium border focus:outline-none transition ${
            selected === f.id
              ? "bg-terra-cotta text-white border-terra-cotta shadow"
              : "bg-crema text-mediterraneo border-arena hover:bg-terra-cotta/10"
          }`}
          onClick={() => onSelect(f.id)}
          type="button"
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
