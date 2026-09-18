import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface HeroEyebrowProps {
  children: ReactNode;
  className?: string;
}

/** Etiqueta pequeña en mayúsculas sobre el título del hero. */
export function HeroEyebrow({ children, className }: HeroEyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full bg-brand-orange px-4 py-1.5 text-sm font-semibold tracking-wide text-white uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
