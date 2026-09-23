"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProyectoSpec } from "@/presentation/atoms/main/proyectos/ProyectoSpec";
import type { ProyectoItem } from "@/presentation/helpers/types";

export interface ProyectoModalLabels {
  tag: string;
  close: string;
  surfaceLabel: string;
  locationLabel: string;
  structureLabel: string;
  timelineLabel: string;
  previousPhoto: string;
  nextPhoto: string;
  /** Plantilla cruda con `{current}` y `{total}` (p. ej. "Foto {current} / {total}") — no puede
   * ser una función: cruzaría el límite servidor/cliente al venir de un Server Component. */
  photoCounterTemplate: string;
}

interface ProyectoModalProps {
  proyecto: ProyectoItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: ProyectoModalLabels;
}

/** Ficha técnica de una obra: visor de fotos a la izquierda, datos a la derecha. Sin scroll desde `sm`. */
export function ProyectoModal({ proyecto, open, onOpenChange, labels }: ProyectoModalProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  // El índice de foto no se resetea mientras el modal cierra (evita un parpadeo visible),
  // solo cuando se abre una obra distinta.
  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (next) setPhotoIndex(0);
  };

  if (!proyecto) return null;

  const photos = proyecto.images;
  const photoCount = photos.length;
  const goToPhoto = (next: number) => setPhotoIndex((next + photoCount) % photoCount);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl md:p-8"
      >
        <DialogClose className="absolute top-5 right-5 z-10 flex size-9 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-400 transition hover:bg-slate-200 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-[#F04400] focus-visible:outline-none">
          <span aria-hidden>✕</span>
          <span className="sr-only">{labels.close}</span>
        </DialogClose>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 md:col-span-6 md:h-[380px]">
            <Image
              key={photoIndex}
              src={photos[photoIndex] ?? ""}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />

            {photoCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goToPhoto(photoIndex - 1)}
                  className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-slate-900/70 p-2.5 text-white transition hover:bg-[#F04400] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <ChevronLeft aria-hidden className="size-5" strokeWidth={2.5} />
                  <span className="sr-only">{labels.previousPhoto}</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToPhoto(photoIndex + 1)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-slate-900/70 p-2.5 text-white transition hover:bg-[#F04400] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <ChevronRight aria-hidden className="size-5" strokeWidth={2.5} />
                  <span className="sr-only">{labels.nextPhoto}</span>
                </button>
              </>
            )}

            <span
              aria-hidden
              className="absolute right-3 bottom-3 rounded-full bg-slate-900/80 px-2.5 py-1 font-mono text-[11px] text-white"
            >
              {labels.photoCounterTemplate
                .replace("{current}", String(photoIndex + 1))
                .replace("{total}", String(photoCount))}
            </span>
          </div>

          <div className="space-y-5 md:col-span-6">
            <div>
              <span className="rounded-full border border-[#F04400]/30 bg-[#F04400]/10 px-3 py-1 text-xs font-bold tracking-wider text-[#F04400] uppercase">
                {labels.tag}
              </span>
              <DialogTitle className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">
                {proyecto.name}
              </DialogTitle>
            </div>

            <dl className="grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
              <ProyectoSpec label={labels.surfaceLabel} value={proyecto.size} />
              <ProyectoSpec label={labels.locationLabel} value={proyecto.location} />
              <ProyectoSpec label={labels.structureLabel} value={proyecto.structure} />
              <ProyectoSpec label={labels.timelineLabel} value={proyecto.timeline} />
            </dl>

            <p className="text-sm leading-relaxed text-slate-600">{proyecto.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
