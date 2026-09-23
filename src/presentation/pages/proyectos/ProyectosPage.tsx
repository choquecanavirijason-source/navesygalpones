import { getTranslations } from "next-intl/server";

import { PROYECTOS_CONTENT } from "@/content/proyectos";
import type { ProyectoItem } from "@/presentation/helpers/types";
import { ProyectosSection } from "@/presentation/organisms/main/proyectos/ProyectosSection";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

interface ProjectText {
  name: string;
  location: string;
  size: string;
}

interface ProjectExtraText {
  structure: string;
  timeline: string;
  description: string;
}

/**
 * Página `/proyectos`: showcase inmersivo + catálogo completo + ficha técnica en modal.
 * Reutiliza el nombre/ubicación/superficie ya cargados en `Home.obras.projects` (mismas 4
 * obras que se ven en la home) y les suma estructura/plazo/descripción de `Proyectos.items`.
 */
export async function ProyectosPage() {
  const [tObras, tProyectos] = await Promise.all([
    getTranslations("Home.obras"),
    getTranslations("Proyectos"),
  ]);

  const baseProjects = tObras.raw("projects") as ProjectText[];
  const extraProjects = tProyectos.raw("items") as ProjectExtraText[];

  const proyectos: ProyectoItem[] = PROYECTOS_CONTENT.map((content, index) => {
    const base = baseProjects[index];
    const extra = extraProjects[index];

    return {
      id: content.id,
      name: base?.name ?? "",
      location: base?.location ?? "",
      size: base?.size ?? "",
      structure: extra?.structure ?? "",
      timeline: extra?.timeline ?? "",
      description: extra?.description ?? "",
      images: content.images,
    };
  });

  return (
    <MainLayout>
      <ProyectosSection
        proyectos={proyectos}
        // Plantilla cruda (sin interpolar): ver el comentario de `photoCounterTemplate` más abajo.
        heroBadgeTemplate={tProyectos.raw("hero.badgeTemplate") as string}
        heroCtaLabel={tProyectos("hero.cta")}
        heroPreviousLabel={tProyectos("hero.previous")}
        heroNextLabel={tProyectos("hero.next")}
        gridBadge={tProyectos("grid.badge")}
        gridTitle={tProyectos("grid.title")}
        gridCtaLabel={tProyectos("grid.cta")}
        modalLabels={{
          tag: tProyectos("modal.tag"),
          close: tProyectos("modal.close"),
          surfaceLabel: tProyectos("modal.specs.surface"),
          locationLabel: tProyectos("modal.specs.location"),
          structureLabel: tProyectos("modal.specs.structure"),
          timelineLabel: tProyectos("modal.specs.timeline"),
          previousPhoto: tProyectos("modal.previousPhoto"),
          nextPhoto: tProyectos("modal.nextPhoto"),
          // Plantilla cruda (sin interpolar): pasar una función haría que Next intente cruzar
          // una función del servidor al cliente, lo que no está permitido.
          photoCounterTemplate: tProyectos.raw("modal.photoCounter") as string,
        }}
      />
    </MainLayout>
  );
}
