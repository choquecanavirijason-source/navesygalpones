import { useTranslations } from "next-intl";

import { Reveal } from "@/presentation/atoms/common/Reveal";
import { Container } from "@/presentation/atoms/layout/Container";
import { QuoteWizard } from "@/presentation/organisms/main/quotes/QuoteWizard";

interface QuoteRequestSectionProps {
  /** Ancla de la sección; también genera el id del título para `aria-labelledby`. */
  id?: string;
}

/**
 * Sección de solicitud de cotización: encabezado + formulario inteligente.
 *
 * El encabezado es de servidor; toda la interacción vive en `QuoteWizard`, que es el único
 * componente cliente de la página.
 */
export function QuoteRequestSection({ id = "cotizaciones" }: QuoteRequestSectionProps) {
  const t = useTranslations("Quotes");
  const titleId = `${id}-title`;

  return (
    /*
     * Desde `md` la sección se estira hasta llenar el hueco que dejan header y footer
     * (`fitViewport` en la página), así el formulario ocupa la pantalla en vez de flotar en
     * un recuadro chico. Pero es un piso, no un techo: un paso con más campos de los que
     * entran hace crecer la sección y se ve completo —nada queda cortado.
     */
    <section
      id={id}
      aria-labelledby={titleId}
      className="flex flex-col bg-muted/40 py-8 md:flex-1 md:py-6"
    >
      <Container className="flex min-h-0 max-w-5xl flex-1 flex-col">
        <Reveal trigger="mount" className="shrink-0">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs font-bold tracking-[0.18em] text-brand-orange uppercase">
              {t("hero.badge")}
            </p>
            <div className="h-[2px] w-12 bg-brand-orange" />
            <h1
              id={titleId}
              className="text-2xl font-extrabold tracking-tight text-graphite uppercase md:text-3xl"
            >
              {t("hero.title")}
            </h1>
            <p className="max-w-xl text-sm text-pretty text-gray-medium">{t("hero.description")}</p>
          </div>
        </Reveal>

        <Reveal trigger="mount" delay={0.1} className="mt-4 flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-white p-4 shadow-lg md:p-5">
            <QuoteWizard />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
