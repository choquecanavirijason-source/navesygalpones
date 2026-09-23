"use client";

import { useState } from "react";

import type { ProyectoItem } from "@/presentation/helpers/types";
import { ProyectoModal, type ProyectoModalLabels } from "@/presentation/organisms/main/proyectos/ProyectoModal";
import { ProyectosGrid } from "@/presentation/organisms/main/proyectos/ProyectosGrid";
import { ProyectosHero } from "@/presentation/organisms/main/proyectos/ProyectosHero";

interface ProyectosSectionProps {
  proyectos: readonly ProyectoItem[];
  heroBadgeTemplate: string;
  heroCtaLabel: string;
  heroPreviousLabel: string;
  heroNextLabel: string;
  gridBadge: string;
  gridTitle: string;
  gridCtaLabel: string;
  modalLabels: ProyectoModalLabels;
}

/**
 * Composition root de cliente de `/proyectos`: es el único punto que sabe qué obra está
 * abierta en la ficha técnica, para que el hero y la grilla puedan abrirla por igual.
 */
export function ProyectosSection({
  proyectos,
  heroBadgeTemplate,
  heroCtaLabel,
  heroPreviousLabel,
  heroNextLabel,
  gridBadge,
  gridTitle,
  gridCtaLabel,
  modalLabels,
}: ProyectosSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const selected = proyectos.find((proyecto) => proyecto.id === selectedId) ?? null;

  const openProyecto = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <>
      <ProyectosHero
        proyectos={proyectos}
        badgeTemplate={heroBadgeTemplate}
        ctaLabel={heroCtaLabel}
        previousLabel={heroPreviousLabel}
        nextLabel={heroNextLabel}
        onExplore={openProyecto}
      />
      <ProyectosGrid
        badge={gridBadge}
        title={gridTitle}
        ctaLabel={gridCtaLabel}
        proyectos={proyectos}
        onSelect={openProyecto}
      />
      <ProyectoModal proyecto={selected} open={open} onOpenChange={setOpen} labels={modalLabels} />
    </>
  );
}
