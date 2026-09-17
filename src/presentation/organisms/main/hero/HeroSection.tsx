import { Reveal } from "@/presentation/atoms/common/Reveal";
import { Container } from "@/presentation/atoms/layout/Container";
import { HeroActions, type HeroActionsProps } from "@/presentation/molecules/main/hero/HeroActions";
import { HeroHeader, type HeroHeaderProps } from "@/presentation/molecules/main/hero/HeroHeader";

type HeroSectionProps = Omit<HeroHeaderProps, "titleId" | "className"> &
  Omit<HeroActionsProps, "className"> & {
    /** Ancla de la sección; también genera el id del título para `aria-labelledby`. */
    id?: string;
  };

/**
 * Hero reutilizable. Recibe contenido ya traducido por props: la página
 * decide QUÉ se muestra, el organismo decide CÓMO.
 */
export function HeroSection({
  id = "hero",
  align = "center",
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
}: HeroSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={titleId} className="relative isolate overflow-hidden">
      <div aria-hidden className="hero-backdrop absolute inset-0 -z-10" />
      <Container className="flex flex-col gap-10 py-24 sm:py-32 lg:py-40">
        <Reveal trigger="mount">
          <HeroHeader
            titleId={titleId}
            align={align}
            badge={badge}
            title={title}
            description={description}
          />
        </Reveal>
        <Reveal trigger="mount" delay={0.15}>
          <HeroActions
            align={align}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
          />
        </Reveal>
      </Container>
    </section>
  );
}
