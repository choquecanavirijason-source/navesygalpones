"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { m } from "motion/react";

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

const AUTOPLAY_MS = 6000;
const SLIDE_DURATION_S = 0.5;

function cardsForWidth(width: number): number {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 2; // Mostramos 2 tarjetas en desktop para que sean más grandes (antes eran muchas o muy angostas).
}

/**
 * Galería de obras: usa la misma lógica de bucle infinito que el carrusel de servicios.
 */
export function ObrasGallery({ projects, labelledBy, previousLabel, nextLabel, slideLabels = [] }: ObrasGalleryProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(2);
  const [isJumping, setIsJumping] = useState(false);

  const jumpFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setCardsPerView(cardsForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const total = projects.length;
  // Dos copias: la segunda cubre el tramo final mientras se reposiciona el track
  const loop = [...projects, ...projects];

  const goNext = useCallback(() => {
    setIsJumping(false);
    setIndex((current) => current + 1);
  }, []);

  const goPrev = useCallback(() => {
    setIsJumping(false);
    setIndex((current) => {
      if (current <= 0) return total - 1;
      return current - 1;
    });
  }, [total]);

  const handleAnimationComplete = useCallback(() => {
    if (index < total) return;
    setIsJumping(true);
    setIndex((current) => current - total);
  }, [index, total]);

  useEffect(() => {
    if (!isJumping) return;
    jumpFrameRef.current = requestAnimationFrame(() => {
      jumpFrameRef.current = null;
      setIsJumping(false);
    });
    return () => {
      if (jumpFrameRef.current !== null) cancelAnimationFrame(jumpFrameRef.current);
    };
  }, [isJumping]);

  useEffect(() => {
    if (isPaused || total <= cardsPerView) return;
    const timer = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, total, cardsPerView, goNext]);

  const stepPercent = 100 / loop.length;
  const activeDot = ((index % total) + total) % total;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-labelledby={labelledBy}
    >
      <div className="overflow-hidden px-1 py-4">
        <m.div
          className="flex items-stretch"
          style={{ width: `${(loop.length / cardsPerView) * 100}%` }}
          animate={{ x: `-${index * stepPercent}%` }}
          transition={isJumping ? { duration: 0 } : { duration: SLIDE_DURATION_S, ease: "easeInOut" }}
          onAnimationComplete={handleAnimationComplete}
        >
          {loop.map((project, position) => (
            <div
              key={`${project.name}-${position}`}
              aria-hidden={position >= total}
              className="px-2 shrink-0 flex"
              style={{ width: `${stepPercent}%` }}
            >
              <ProjectCard {...project} />
            </div>
          ))}
        </m.div>
      </div>

      {total > cardsPerView && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-800 shadow-md transition-colors hover:bg-[#F04400] hover:text-white hover:border-[#F04400] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ChevronLeft aria-hidden className="h-5 w-5" />
            <span className="sr-only">{previousLabel}</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-800 shadow-md transition-colors hover:bg-[#F04400] hover:text-white hover:border-[#F04400] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ChevronRight aria-hidden className="h-5 w-5" />
            <span className="sr-only">{nextLabel}</span>
          </button>
        </>
      )}

      {total > cardsPerView && slideLabels && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slideLabels.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setIsJumping(false);
                setIndex(i);
              }}
              aria-current={i === activeDot ? "true" : undefined}
              className="p-1"
            >
              <span
                aria-hidden
                className={cn(
                  "block size-2.5 rounded-full transition-all duration-300",
                  i === activeDot ? "bg-[#F04400] scale-125" : "bg-gray-300 hover:bg-gray-400",
                )}
              />
              <span className="sr-only">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
