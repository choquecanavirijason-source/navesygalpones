import { cn } from "@/lib/utils";

interface QuoteStepBarProps {
  /** Paso actual, empezando en 1. */
  current: number;
  total: number;
  /** Texto ya traducido, p. ej. "Paso 2 de 5: Tu proyecto". */
  label: string;
  className?: string;
}

/** Progreso del formulario: texto accesible + barra. */
export function QuoteStepBar({ current, total, label, className }: QuoteStepBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p aria-live="polite" className="text-xs font-bold tracking-wider text-gray-medium uppercase">
        {label}
      </p>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={label}
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className="h-full rounded-full bg-brand-orange transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
