
const VERTICALS = [
  "Todos",
  "Tecnología",
  "Finanzas",
  "Derecho",
  "Marketing",
  "Negocios",
  "Innovación",
  "Sostenibilidad",
];

export function VerticalFilterBar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (vertical: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {VERTICALS.map(v => (
        <button
          key={v}
          className={`px-4 py-1 rounded-full text-sm font-medium border focus:outline-none transition ${
            v === selected
              ? "bg-terra-cotta text-white border-terra-cotta shadow"
              : "bg-crema text-mediterraneo border-arena hover:bg-terra-cotta/10"
          }`}
          onClick={() => onSelect(v)}
          type="button"
        >
          {v}
        </button>
      ))}
    </div>
  );
}
