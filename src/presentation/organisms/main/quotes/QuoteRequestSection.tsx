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
    <section id={id} aria-labelledby={titleId} className="bg-muted/40 py-12 md:py-16">
      <Container className="max-w-5xl">
        <Reveal trigger="mount">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-xs font-bold tracking-[0.18em] text-brand-orange uppercase">
              {t("hero.badge")}
            </p>
            <div className="h-[2px] w-12 bg-brand-orange" />
            <h1
              id={titleId}
              className="text-3xl font-extrabold tracking-tight text-graphite uppercase md:text-4xl"
            >
              {t("hero.title")}
            </h1>
            <p className="max-w-xl text-sm text-pretty text-gray-medium md:text-base">
              {t("hero.description")}
            </p>
          </div>
        </Reveal>

        <Reveal trigger="mount" delay={0.1}>
          <div className="mt-8 rounded-2xl bg-white p-5 shadow-lg md:p-8">
            <QuoteWizard />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
