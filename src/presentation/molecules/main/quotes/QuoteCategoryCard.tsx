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
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="flex flex-1 flex-col gap-2 p-4 text-left focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:outline-none"
      >
        <span className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
            {index}
          </span>
          <Icon aria-hidden className="size-5 shrink-0 text-brand-orange" />
          <span className="text-sm font-extrabold tracking-tight text-graphite uppercase">{name}</span>
        </span>
        <span className="text-xs leading-relaxed text-gray-600">{short}</span>
        <span className="mt-auto pt-2 text-[11px] leading-snug font-semibold text-gray-500">
          {idealLabel}: {ideal}
        </span>
      </button>

      <button
        type="button"
        onClick={onToggleDetail}
        aria-expanded={expanded}
        aria-controls={detailId}
        className="flex items-center justify-between gap-2 border-t border-gray-100 px-4 py-2 text-[11px] font-bold tracking-wider text-brand-orange uppercase transition-colors hover:bg-brand-orange/5 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:outline-none"
      >
        {detailLabel}
        <ChevronDown aria-hidden className={cn("size-4 transition-transform", expanded && "rotate-180")} />
      </button>

      <p
        id={detailId}
        hidden={!expanded}
        className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600"
      >
        {full}
      </p>
    </li>
  );
}
