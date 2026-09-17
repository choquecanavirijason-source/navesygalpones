import type { ReactNode } from "react";

interface SkipLinkProps {
  href: string;
  children: ReactNode;
}

/** Enlace accesible "saltar al contenido": invisible hasta recibir foco con teclado. */
export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:ring-ring focus:outline-none"
    >
      {children}
    </a>
  );
}
