import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/presentation/atoms/common/Reveal";
import { Text } from "@/presentation/atoms/common/Text";
import { Container } from "@/presentation/atoms/layout/Container";
import { ObrasEyebrow } from "@/presentation/atoms/main/obras/ObrasEyebrow";
import { ObrasGallery } from "@/presentation/molecules/main/obras/ObrasGallery";
import type { ProjectCardProps } from "@/presentation/molecules/main/obras/ProjectCard";
import { TestimonialCard } from "@/presentation/molecules/main/obras/TestimonialCard";

/** Foto de cada obra, en el mismo orden que `Home.obras.projects` (ojo: las extensiones difieren). */
const PROJECT_IMAGES = [
  "/images/galpon1.jpg",
  "/images/galpon2.webp",
  "/images/galpon3.webp",
  "/images/galpon4.webp",
] as const;

interface ObrasSectionProps {
  /** Ancla de la sección; también genera el id del título para `aria-labelledby`. */
  id?: string;
}

/** Sección "Nuestras obras": encabezado + galería de proyectos + testimonio. */
export function ObrasSection({ id = "obras" }: ObrasSectionProps) {
  const t = useTranslations("Home.obras");
  const titleId = `${id}-title`;
  const tCarousel = useTranslations("Home.heroCarousel");
  const projects = (t.raw("projects") as Omit<ProjectCardProps, "image">[]).map((project, index) => ({
    ...project,
    image: PROJECT_IMAGES[index] ?? PROJECT_IMAGES[0],
  }));
  const rating = Number(t("testimonial.rating"));

  return (
    <section id={id} aria-labelledby={titleId} className="bg-background">
      <Container className="grid grid-cols-1 items-stretch gap-4 py-4 lg:grid-cols-[22fr_78fr]">
        <Reveal className="flex flex-col items-start justify-center gap-2">
          <ObrasEyebrow>{t("badge")}</ObrasEyebrow>
          <h2 id={titleId} className="text-xl leading-snug font-extrabold tracking-tight text-balance text-[#282828] md:text-2xl">
            {t("title")}
          </h2>
          <Text size="sm" className="text-xs leading-relaxed text-gray-600">
            {t("description")}
          </Text>
          <Button
            asChild
            variant="outline"
            className="h-auto rounded-md border-[#F04400] bg-transparent px-3 py-1.5 text-xs font-bold text-[#F04400] hover:bg-[#F04400] hover:text-white"
          >
            {/* TODO: definir destino real (listado de obras) */}
            <Link href="#obras">
              {t("ctaLabel")}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Reveal>

        {/* Galería + testimonio comparten fila: el testimonio iguala la altura de las tarjetas. */}
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[56fr_22fr]">
        <Reveal delay={0.1} className="flex flex-col justify-center">
          <ObrasGallery
            projects={projects}
            labelledBy={titleId}
            previousLabel={tCarousel("previous")}
            nextLabel={tCarousel("next")}
            slideLabels={projects.map((_, index) => tCarousel("goToSlide", { index: index + 1 }))}
          />
        </Reveal>

        <Reveal delay={0.2} className="h-full">
          <TestimonialCard
            quote={t("testimonial.quote")}
            authorName={t("testimonial.authorName")}
            authorRole={t("testimonial.authorRole")}
            authorCompany={t("testimonial.authorCompany")}
            rating={rating}
            ratingLabel={`${rating}/5`}
          />
        </Reveal>
        </div>
      </Container>
    </section>
  );
}
