"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export interface HeroCarouselProps {
  /** Un label ya traducido por diapositiva; su longitud define la cantidad de slides. */
  slideLabels: readonly string[];
  previousLabel: string;
  nextLabel: string;
}

/**
 * Fondo del hero con controles de carrusel (flechas + puntos). Las diapositivas
 * son un placeholder grafito hasta contar con fotos reales de obra.
 */
export function HeroCarousel({ slideLabels, previousLabel, nextLabel }: HeroCarouselProps) {
  const slideCount = slideLabels.length;
  const [index, setIndex] = useState(0);
  const goTo = (next: number) => setIndex((next + slideCount) % slideCount);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-graphite">
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src="/images/fondo_galpon.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </m.div>
      </AnimatePresence>

      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ChevronLeft aria-hidden />
        <span className="sr-only">{previousLabel}</span>
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ChevronRight aria-hidden />
        <span className="sr-only">{nextLabel}</span>
      </button>

      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-1.5">
        {slideLabels.map((label, dotIndex) => (
          <button
            key={label}
            type="button"
            onClick={() => setIndex(dotIndex)}
            aria-current={dotIndex === index ? "true" : undefined}
            className="p-1.5"
          >
            <span
              aria-hidden
              className={cn(
                "block size-2.5 rounded-full transition-colors",
                dotIndex === index ? "bg-brand-orange" : "bg-white/40 hover:bg-white/60",
              )}
            />
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
