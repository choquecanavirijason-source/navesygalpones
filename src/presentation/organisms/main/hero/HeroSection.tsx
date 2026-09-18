import { useTranslations } from "next-intl";

import { Reveal } from "@/presentation/atoms/common/Reveal";
import { Text } from "@/presentation/atoms/common/Text";
import { Container } from "@/presentation/atoms/layout/Container";
import { HeroEyebrow } from "@/presentation/atoms/main/hero/HeroEyebrow";
import { HeroHeadline } from "@/presentation/atoms/main/hero/HeroHeadline";
import { HeroTagline } from "@/presentation/atoms/main/hero/HeroTagline";
import { HeroCarousel } from "@/presentation/molecules/main/hero/HeroCarousel";
import { HeroCtaGroup } from "@/presentation/molecules/main/hero/HeroCtaGroup";

const SLIDE_COUNT = 5;

interface HeroSectionProps {
  /** Ancla de la sección; también genera el id del título para `aria-labelledby`. */
  id?: string;
}

/** Hero de la home: carrusel de fondo (placeholder) + contenido de marca superpuesto. */
export function HeroSection({ id = "inicio" }: HeroSectionProps) {
  const t = useTranslations("Home.hero");
  const tCarousel = useTranslations("Home.heroCarousel");
  const titleId = `${id}-title`;
  const lines: [string, string, string] = [t("title.line1"), t("title.line2"), t("title.line3")];

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="relative isolate flex min-h-[calc(100dvh-var(--topbar-height)-var(--header-height))] items-center overflow-hidden"
    >
      <HeroCarousel
        previousLabel={tCarousel("previous")}
        nextLabel={tCarousel("next")}
        slideLabels={Array.from({ length: SLIDE_COUNT }, (_, index) =>
          tCarousel("goToSlide", { index: index + 1 }),
        )}
      />

      <Container className="flex flex-col gap-6 py-24">
        <Reveal trigger="mount">
          <HeroEyebrow>{t("badge")}</HeroEyebrow>
        </Reveal>
        <Reveal trigger="mount" delay={0.1}>
          <HeroHeadline id={titleId} lines={lines} />
        </Reveal>
        <Reveal trigger="mount" delay={0.2}>
          <Text size="lg" className="max-w-2xl text-pretty text-white/90">
            {t("description")}
          </Text>
        </Reveal>
        <Reveal trigger="mount" delay={0.3}>
          <HeroCtaGroup
            primaryAction={{ href: "#contacto", label: t("ctaPrimary") }}
            secondaryAction={{ href: "#obras", label: t("ctaSecondary") }}
          />
        </Reveal>
      </Container>

      <div className="absolute right-6 bottom-6 z-10 hidden sm:block">
        <HeroTagline>{t("tagline")}</HeroTagline>
      </div>
    </section>
  );
}
