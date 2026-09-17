import type { ReactNode } from "react";

import { MAIN_CONTENT_ID } from "@/constants/ui";
import { SiteFooter } from "@/presentation/organisms/layout/SiteFooter";
import { SiteHeader } from "@/presentation/organisms/layout/SiteHeader";

/** Esqueleto de las páginas públicas: header + contenido + footer. Sin datos propios. */
export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <SiteHeader />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
