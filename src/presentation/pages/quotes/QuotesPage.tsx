import { QuoteRequestSection } from "@/presentation/organisms/main/quotes/QuoteRequestSection";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

/**
 * Página de cotizaciones. Header de una sola fila y todo en una pantalla: acá manda el
 * formulario, y que no haya que scrollear para ver en qué paso estás ni dónde seguir.
 */
export function QuotesPage() {
  return (
    <MainLayout compactHeader fitViewport>
      <QuoteRequestSection />
    </MainLayout>
  );
}
