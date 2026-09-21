import { ArrowRight, Check } from "lucide-react";

interface QuoteConfirmCardProps {
  /** Textos ya traducidos. */
  selectedLabel: string;
  description: string;
  question: string;
  confirmLabel: string;
  changeLabel: string;
  onConfirm: () => void;
  onChange: () => void;
}

/**
 * Confirmación de la selección, obligatoria según el documento funcional: antes de pedir
 * datos técnicos el formulario devuelve qué entendió.
 */
export function QuoteConfirmCard({
  selectedLabel,
  description,
  question,
  confirmLabel,
  changeLabel,
  onConfirm,
  onChange,
}: QuoteConfirmCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      <p className="text-lg font-extrabold tracking-tight text-graphite uppercase">{selectedLabel}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>

      <div className="mt-5 flex flex-col gap-3 rounded-lg border border-brand-orange/40 bg-brand-orange/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-graphite">{question}</p>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-brand-orange/90 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Check aria-hidden className="size-4" />
          {confirmLabel}
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={onChange}
        className="mt-3 text-xs font-bold tracking-wider text-gray-medium uppercase underline underline-offset-4 transition-colors hover:text-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:outline-none"
      >
        {changeLabel}
      </button>
    </div>
  );
}
