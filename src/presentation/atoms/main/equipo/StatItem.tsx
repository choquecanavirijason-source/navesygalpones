import type { LucideIcon } from "lucide-react";

interface StatItemProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

/** Dato numérico destacado. El ícono va en un contenedor de altura fija para alinear los 4 en la misma línea. */
export function StatItem({ icon: Icon, value, label }: StatItemProps) {
  return (
    <div className="flex h-full min-w-0 flex-col items-center justify-start gap-2 text-center">
      <div className="flex h-8 items-center justify-center">
        <Icon aria-hidden className="size-6 shrink-0 text-brand-orange" />
      </div>
      <dd className="text-lg font-extrabold tracking-tight text-foreground md:text-xl lg:text-[clamp(0.875rem,3.1cqw,1.25rem)]">
        {value}
      </dd>
      <dt className="order-last text-[10px] leading-tight font-medium text-balance text-foreground/80 uppercase lg:text-[clamp(0.5625rem,1.9cqw,0.625rem)]">
        {label}
      </dt>
    </div>
  );
}
