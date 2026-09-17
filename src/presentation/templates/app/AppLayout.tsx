import type { ReactNode } from "react";

import { Toaster } from "@/components/toast/Toaster";
import { AppProviders } from "@/presentation/templates/app/AppProviders";

/** Envoltorio de toda la aplicación: providers globales + regiones globales (toasts). */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      {children}
      <Toaster />
    </AppProviders>
  );
}
