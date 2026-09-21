"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { m } from "motion/react";

import { cn } from "@/lib/utils";
import { ServiceCard } from "@/presentation/molecules/cards/ServiceCard";

export interface ServiceItem {
  id: number;
  title: string;
  imageSrc: string;
}

interface ServicesCarouselProps {
  services: ServiceItem[];
  previousLabel: string;
  nextLabel: string;
  /** Un label ya traducido por servicio, para los puntos de navegación. */
  slideLabels: readonly string[];
}

const AUTOPLAY_MS = 5000;
const SLIDE_DURATION_S = 0.5;

/** Tarjetas visibles a la vez, por breakpoint. */
function cardsForWidth(width: number): number {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}

/**
 * ServicesCarousel Molecule
 *
 * Carrusel infinito de tarjetas de servicios.
 *
 * El truco del loop: se renderiza la lista dos veces y se desplaza un track continuo. Al
 * llegar al final de la primera copia, el track ya está mostrando la segunda —idéntica—, así
 * que se puede saltar al inicio sin transición y el corte es invisible. Sin esto, un carrusel
 * paginado deja huecos cuando el total de tarjetas no es múltiplo de las visibles (7 servicios
 * en páginas de 3 dejaban una última página con una sola tarjeta y dos huecos).
 */
export function ServicesCarousel({
  services,
  previousLabel,
  nextLabel,
  slideLabels,
}: ServicesCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);
  /** Desactiva la transición para el salto de reposicionamiento del loop. */
  const [isJumping, setIsJumping] = useState(false);

  const jumpFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setCardsPerView(cardsForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const total = services.length;
  // Dos copias: la segunda es la que cubre el tramo final mientras se reposiciona el track.
  const loop = [...services, ...services];

  const goNext = useCallback(() => {
    setIsJumping(false);
    setIndex((current) => current + 1);
  }, []);

  const goPrev = useCallback(() => {
    setIsJumping(false);
    setIndex((current) => {
      // Desde el arranque no se puede ir a -1: se salta sin animar al clon equivalente del
      // final y recién desde ahí se anima hacia atrás (se resuelve en el efecto de abajo).
      if (current <= 0) return total - 1;
      return current - 1;
    });
  }, [total]);

  /*
   * Reposicionamiento: al pasar de la primera copia a la segunda, el contenido en pantalla es
   * el mismo, así que se descuenta una vuelta sin transición y nadie lo nota.
   */
  const handleAnimationComplete = useCallback(() => {
    if (index < total) return;
    setIsJumping(true);
    setIndex((current) => current - total);
  }, [index, total]);

  // Tras el salto instantáneo hay que devolver la transición para el próximo avance.
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

  /*
   * El track mide `loop.length / cardsPerView` veces el contenedor, así que un paso equivale
   * a `100 / loop.length` por ciento del propio track. Mantener todo en porcentajes del track
   * evita depender de medir anchos en píxeles al redimensionar.
   */
  const stepPercent = 100 / loop.length;
  const activeDot = ((index % total) + total) % total;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* `-mx-2` compensa el `px-2` que cada tarjeta usa como separación, para que la primera
          y la última queden alineadas con el borde del contenedor. */}
      <div className="-mx-2 overflow-hidden">
        <m.div
          className="flex"
          style={{ width: `${(loop.length / cardsPerView) * 100}%` }}
          animate={{ x: `-${index * stepPercent}%` }}
          transition={isJumping ? { duration: 0 } : { duration: SLIDE_DURATION_S, ease: "easeInOut" }}
          onAnimationComplete={handleAnimationComplete}
        >
          {loop.map((service, position) => (
            <div
              key={`${service.id}-${position}`}
              // La segunda copia es decorativa: existe solo para cubrir el salto del loop.
              aria-hidden={position >= total}
              className="h-[320px] shrink-0 px-2 sm:h-[380px] lg:h-[440px]"
              style={{ width: `${stepPercent}%` }}
            >
              <ServiceCard title={service.title} imageSrc={service.imageSrc} />
            </div>
          ))}
        </m.div>
      </div>

      {total > cardsPerView && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-light bg-white p-2 text-graphite shadow-md transition-colors hover:bg-brand-orange hover:text-white hover:border-brand-orange focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ChevronLeft aria-hidden className="h-5 w-5" />
            <span className="sr-only">{previousLabel}</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-light bg-white p-2 text-graphite shadow-md transition-colors hover:bg-brand-orange hover:text-white hover:border-brand-orange focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ChevronRight aria-hidden className="h-5 w-5" />
            <span className="sr-only">{nextLabel}</span>
          </button>
        </>
      )}

      {total > cardsPerView && (
        <div className="mt-6 flex items-center justify-center gap-2">
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
                  i === activeDot ? "bg-brand-orange scale-125" : "bg-gray-light hover:bg-gray-medium",
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
