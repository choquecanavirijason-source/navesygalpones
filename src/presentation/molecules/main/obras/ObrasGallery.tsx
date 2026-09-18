"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { ProjectCard, type ProjectCardProps } from "@/presentation/molecules/main/obras/ProjectCard";

export interface ObrasGalleryProps {
  projects: readonly ProjectCardProps[];
  /** id del título de la sección; nombra la región desplazable. */
  labelledBy: string;
  previousLabel: string;
  nextLabel: string;
  /** Un label ya traducido por obra, para los puntos de navegación. */
  slideLabels?: readonly string[];
}

const ARROW_CLASS =
  "flex size-9 shrink-0 items-center justify-center rounded-full bg-graphite text-white transition-colors hover:bg-graphite/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30 lg:disabled:opacity-100";

/**
 * Galería de obras: fila continua con flechas circulares a los lados. Con espacio
 * suficiente (`lg`) entran las 4 tarjetas y las flechas quedan deshabilitadas; en
 * pantallas chicas la fila se desplaza (swipe o flechas).
 */
export function ObrasGallery({ projects, labelledBy, previousLabel, nextLabel, slideLabels = [] }: ObrasGalleryProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [active, setActive] = useState(0);

  const syncArrows = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setCanPrev(list.scrollLeft > 1);
    setCanNext(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
    const items = Array.from(list.children) as HTMLElement[];
    const offset = (item: HTMLElement) => Math.abs(item.offsetLeft - list.offsetLeft - list.scrollLeft);
    setActive(items.reduce((best, item, i) => (offset(item) < offset(items[best]!) ? i : best), 0));
  }, []);

  useEffect(() => {
    syncArrows();
    window.addEventListener("resize", syncArrows);
    return () => window.removeEventListener("resize", syncArrows);
  }, [syncArrows]);

  const scrollByCard = (direction: 1 | -1) => {
    const list = listRef.current;
    const first = list?.firstElementChild as HTMLElement | null;
    if (!list || !first) return;
    list.scrollBy({ left: direction * (first.offsetWidth + 12), behavior: "smooth" });
  };

  const goTo = (index: number) =>
    listRef.current?.children[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });

  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          className={cn(ARROW_CLASS, "self-center")}
        >
          <ChevronLeft aria-hidden />
          <span className="sr-only">{previousLabel}</span>
        </button>

        <ul
          ref={listRef}
          role="region"
          aria-labelledby={labelledBy}
          tabIndex={0}
          onScroll={syncArrows}
          className="flex min-w-0 flex-1 items-start snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:overflow-hidden [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, i) => (
            <li key={i} className="self-start w-[60%] shrink-0 snap-start sm:w-[30%] lg:w-auto lg:min-w-0 lg:flex-1">
              <ProjectCard {...project} />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          className={cn(ARROW_CLASS, "self-center")}
        >
          <ChevronRight aria-hidden />
          <span className="sr-only">{nextLabel}</span>
        </button>
      </div>

      <div className="mt-1.5 flex justify-center gap-1">
        {slideLabels?.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => goTo(i)}
            aria-current={i === active ? "true" : undefined}
            className="p-1"
          >
            <span
              aria-hidden
              className={cn("block size-2 rounded-full transition-colors", i === active ? "bg-[#F04400]" : "bg-gray-300")}
            />
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
