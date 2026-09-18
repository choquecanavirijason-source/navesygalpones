"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, m } from "motion/react";

import { cn } from "@/lib/utils";
import { ServiceCard } from "@/presentation/molecules/cards/ServiceCard";

export interface ServiceItem {
  id: number;
  title: string;
  imageSrc: string;
}

interface ServicesCarouselProps {
  services: ServiceItem[];
}

/**
 * ServicesCarousel Molecule
 * Carrusel horizontal de tarjetas de servicios construido con Motion,
 * siguiendo el patrón del HeroCarousel existente en el proyecto.
 *
 * Muestra varias tarjetas a la vez (responsive) y permite navegar
 * con flechas laterales y puntos indicadores.
 *
 * Auto-play cada 5 segundos, se pausa al hacer hover.
 */
export function ServicesCarousel({ services }: ServicesCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = adelante, -1 = atrás

  // Cantidad de tarjetas visibles según breakpoint (calculado con CSS grid,
  // pero aquí necesitamos saberlo para la paginación):
  // móvil: 1, tablet: 2, desktop: 3
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalPages = Math.ceil(services.length / cardsPerView);

  const goTo = useCallback(
    (page: number, dir?: number) => {
      const next = (page + totalPages) % totalPages;
      setDirection(dir ?? (next > currentPage ? 1 : -1));
      setCurrentPage(next);
    },
    [totalPages, currentPage],
  );

  // Auto-play
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    const timer = setInterval(() => goTo(currentPage + 1, 1), 5000);
    return () => clearInterval(timer);
  }, [isPaused, currentPage, totalPages, goTo]);

  // Slice de servicios para la página actual
  const startIndex = currentPage * cardsPerView;
  const visibleServices = services.slice(startIndex, startIndex + cardsPerView);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Contenedor del carrusel con overflow oculto */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <m.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="grid gap-4 pb-4"
            style={{
              gridTemplateColumns: `repeat(${cardsPerView}, 1fr)`,
            }}
          >
            {visibleServices.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                imageSrc={service.imageSrc}
              />
            ))}
          </m.div>
        </AnimatePresence>
      </div>

      {/* Flechas de navegación */}
      {totalPages > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(currentPage - 1, -1)}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-light bg-white p-2 text-graphite shadow-md transition-colors hover:bg-brand-orange hover:text-white hover:border-brand-orange focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ChevronLeft aria-hidden className="h-5 w-5" />
            <span className="sr-only">Anterior</span>
          </button>
          <button
            type="button"
            onClick={() => goTo(currentPage + 1, 1)}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-light bg-white p-2 text-graphite shadow-md transition-colors hover:bg-brand-orange hover:text-white hover:border-brand-orange focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ChevronRight aria-hidden className="h-5 w-5" />
            <span className="sr-only">Siguiente</span>
          </button>
        </>
      )}

      {/* Indicadores de página (puntos) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === currentPage ? "true" : undefined}
              className="p-1"
            >
              <span
                aria-hidden
                className={cn(
                  "block size-2.5 rounded-full transition-all duration-300",
                  i === currentPage
                    ? "bg-brand-orange scale-125"
                    : "bg-gray-light hover:bg-gray-medium",
                )}
              />
              <span className="sr-only">Página {i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
