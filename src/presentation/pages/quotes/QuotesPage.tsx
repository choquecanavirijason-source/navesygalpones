import { QuoteRequestSection } from "@/presentation/organisms/main/quotes/QuoteRequestSection";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

/** Página de cotizaciones. Header de una sola fila: acá manda el formulario. */
export function QuotesPage() {
  return (
    <MainLayout compactHeader>
      <QuoteRequestSection />
    </MainLayout>
  );
}
