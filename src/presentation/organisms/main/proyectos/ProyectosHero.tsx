"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";

import type { ProyectoItem } from "@/presentation/helpers/types";

interface ProyectosHeroProps {
  proyectos: readonly ProyectoItem[];
  /** Plantilla cruda con `{current}` y `{total}` (p. ej. "Obra Destacada {current} / {total}"). */
  badgeTemplate: string;
  ctaLabel: string;
  previousLabel: string;
  nextLabel: string;
  onExplore: (id: string) => void;
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Showcase inmersivo: una foto a pantalla completa por obra. La zona superior queda
 * completamente vacía a pedido (nada de título de marca ni badge ahí); el badge, el título,
 * la descripción, el CTA y las flechas van todos centrados en vertical vía `my-auto`.
 */
export function ProyectosHero({
  proyectos,
  badgeTemplate,
  ctaLabel,
  previousLabel,
  nextLabel,
  onExplore,
}: ProyectosHeroProps) {
  const [index, setIndex] = useState(0);
  const count = proyectos.length;
  const goTo = (next: number) => setIndex((next + count) % count);
  const current = proyectos[index];

  if (!current) return null;

  return (
    <section className="relative isolate flex h-[80vh] min-h-[32rem] flex-col overflow-hidden border-b border-slate-100 bg-slate-950 p-6 md:p-12">
      <div aria-hidden className="absolute inset-0 z-0">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image src={current.images[0] ?? ""} alt="" fill priority sizes="100vw" className="object-cover opacity-50" />
          </m.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
      </div>

      {/* `my-auto` centra este bloque en vertical sin necesidad de una fila superior. */}
      <div className="relative z-10 my-auto mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl space-y-4 text-white">
          <span className="inline-block rounded-full border border-[#F04400]/40 bg-[#F04400]/20 px-3 py-1 text-xs font-bold tracking-wider text-[#F04400] uppercase">
            {badgeTemplate.replace("{current}", pad(index + 1)).replace("{total}", pad(count))}
          </span>
          <h1 className="text-4xl leading-tight font-black tracking-tight md:text-6xl">{current.name}</h1>
          <p className="text-base text-slate-200 md:text-lg">{current.description}</p>
          <button
            type="button"
            onClick={() => onExplore(current.id)}
            className="rounded-xl bg-[#F04400] px-6 py-3.5 font-bold text-white shadow-md shadow-[#F04400]/30 transition-all hover:bg-[#d03a00] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
          >
            {ctaLabel}
          </button>
        </div>

        {count > 1 && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="rounded-full border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md transition-all hover:bg-[#F04400] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <ChevronLeft aria-hidden className="size-6" strokeWidth={2.5} />
              <span className="sr-only">{previousLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="rounded-full border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md transition-all hover:bg-[#F04400] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <ChevronRight aria-hidden className="size-6" strokeWidth={2.5} />
              <span className="sr-only">{nextLabel}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
