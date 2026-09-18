import type { ReactNode } from "react";

/** Etiqueta discreta de sección: línea naranja + texto en mayúsculas. */
export function ObrasEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-sm font-bold tracking-wider md:text-base text-[#F04400] uppercase">
      <span aria-hidden className="h-0.5 w-6 bg-[#F04400]" />
      {children}
    </span>
  );
}
