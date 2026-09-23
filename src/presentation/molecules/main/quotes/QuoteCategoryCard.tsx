import { ChevronDown, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuoteCategoryCardProps {
  /** Número de orden que muestra la tarjeta. */
  index: number;
  icon: LucideIcon;
  /** Textos ya traducidos. */
  name: string;
  short: string;
  full: string;
  ideal: string;
  idealLabel: string;
  detailLabel: string;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onToggleDetail: () => void;
}

/**
 * Tarjeta del selector de tipo de obra: nombre + frase corta siempre visibles y la
 * explicación completa desplegable, que es el criterio UX del documento funcional.
 */
export function QuoteCategoryCard({
  index,
  icon: Icon,
  name,
  short,
  full,
  ideal,
  idealLabel,
  detailLabel,
  selected,
  expanded,
  onSelect,
  onToggleDetail,
}: QuoteCategoryCardProps) {
  const detailId = `quote-category-detail-${index}`;

  return (
    <li
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-white transition-colors",
        selected ? "border-brand-orange ring-1 ring-brand-orange" : "border-gray-200 hover:border-brand-orange/60",
      )}
    >
      {/*
        Solo nombre + frase corta a la vista: es el criterio UX del documento funcional y,
        de paso, permite ver las diez opciones sin scrollear. El "ideal para" y la
        explicación completa viven en el desplegable.
      */}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="flex flex-1 flex-col gap-1.5 p-3 text-left focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:outline-none"
      >
        <span className="flex items-center gap-1.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-[11px] font-bold text-brand-orange">
            {index}
          </span>
          <Icon aria-hidden className="size-4 shrink-0 text-brand-orange" />
          <span className="text-[13px] leading-tight font-extrabold tracking-tight text-graphite uppercase">
            {name}
          </span>
        </span>
        <span className="text-xs leading-snug text-gray-600">{short}</span>
      </button>

      <button
        type="button"
        onClick={onToggleDetail}
        aria-expanded={expanded}
        aria-controls={detailId}
        className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 px-3 py-1.5 text-[10px] font-bold tracking-wider text-brand-orange uppercase transition-colors hover:bg-brand-orange/5 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:outline-none"
      >
        {detailLabel}
        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
      </button>

      <div
        id={detailId}
        hidden={!expanded}
        className="border-t border-gray-100 bg-gray-50 px-3 py-2.5 text-xs leading-relaxed text-gray-600"
      >
        <p>{full}</p>
        <p className="mt-2 font-semibold text-gray-500">
          {idealLabel}: {ideal}
        </p>
      </div>
    </li>
  );
}
