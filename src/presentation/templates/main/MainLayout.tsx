import type { ReactNode } from "react";

import { MAIN_CONTENT_ID } from "@/constants/ui";
import { HashScroll } from "@/presentation/atoms/common/HashScroll";
import { SiteFooter } from "@/presentation/organisms/layout/SiteFooter";
import { SiteHeader } from "@/presentation/organisms/layout/SiteHeader";

interface MainLayoutProps {
  children: ReactNode;
  /** Header de una sola fila (solo el nav), para páginas internas. */
  compactHeader?: boolean;
}

/** Esqueleto de las páginas públicas: header + contenido + footer. Sin datos propios. */
export function MainLayout({ children, compactHeader = false }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <HashScroll />
      <SiteHeader compact={compactHeader} />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
