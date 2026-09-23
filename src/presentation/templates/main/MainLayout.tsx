import type { ReactNode } from "react";

import { MAIN_CONTENT_ID } from "@/constants/ui";
import { cn } from "@/lib/utils";
import { HashScroll } from "@/presentation/atoms/common/HashScroll";
import { SiteFooter } from "@/presentation/organisms/layout/SiteFooter";
import { SiteHeader } from "@/presentation/organisms/layout/SiteHeader";

interface MainLayoutProps {
  children: ReactNode;
  /** Header de una sola fila (solo el nav), para páginas internas. */
  compactHeader?: boolean;
  /**
   * El contenido llena la pantalla: el `<main>` pasa a ser columna flex y reparte el alto que
   * sobra entre header y footer, así la sección puede pedirlo con `flex-1` sin calcular a mano
   * cuánto miden.
   *
   * Es un piso, no un techo: el contenedor sigue en `min-h-dvh`, de modo que una sección con
   * más contenido del que entra crece y se ve entera, en vez de recortarse.
   * Solo desde `md`: en mobile el scroll normal es lo natural.
   */
  fitViewport?: boolean;
}

/** Esqueleto de las páginas públicas: header + contenido + footer. Sin datos propios. */
export function MainLayout({
  children,
  compactHeader = false,
  fitViewport = false,
}: MainLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <HashScroll />
      <SiteHeader compact={compactHeader} />
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className={cn("flex-1 focus:outline-none", fitViewport && "md:flex md:min-h-0 md:flex-col")}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
