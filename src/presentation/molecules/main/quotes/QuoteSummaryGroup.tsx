import { Pencil } from "lucide-react";

import type { QuoteSummaryLine } from "@/presentation/helpers/quotes/request";

interface QuoteSummaryGroupProps {
  /** Textos ya traducidos. */
  title: string;
  editLabel: string;
  lines: readonly QuoteSummaryLine[];
  emptyLabel: string;
  onEdit: () => void;
}

/** Bloque del resumen: una sección editable con sus pares dato/valor. */
export function QuoteSummaryGroup({
  title,
  editLabel,
  lines,
  emptyLabel,
  onEdit,
}: QuoteSummaryGroupProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
        <h3 className="text-xs font-bold tracking-wider text-graphite uppercase">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-brand-orange uppercase transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:outline-none"
        >
          <Pencil aria-hidden className="size-3.5" />
          {editLabel}
        </button>
      </header>

      <dl className="divide-y divide-gray-100">
        {lines.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="text-xs font-semibold tracking-wide text-gray-medium uppercase sm:w-2/5 sm:shrink-0">
              {label}
            </dt>
            <dd className="text-sm text-graphite">{value.trim() === "" ? emptyLabel : value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
