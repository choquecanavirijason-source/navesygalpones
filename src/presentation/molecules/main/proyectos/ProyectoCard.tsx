import type { KeyboardEvent } from "react";
import Image from "next/image";

import type { ProyectoItem } from "@/presentation/helpers/types";

interface ProyectoCardProps {
  proyecto: ProyectoItem;
  ctaLabel: string;
  onSelect: () => void;
}

/**
 * Tarjeta de una obra en la grilla del catálogo. Toda la tarjeta es interactiva (como en el
 * prototipo); el botón visual de abajo es un `span` para no anidar un botón dentro de otro.
 */
export function ProyectoCard({ proyecto, ctaLabel, onSelect }: ProyectoCardProps) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-[#F04400] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#F04400] focus-visible:outline-none"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={proyecto.images[0] ?? ""}
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-xl font-bold text-slate-900 transition group-hover:text-[#F04400]">
          {proyecto.name}
        </h3>
        <p className="text-xs font-medium text-slate-500">
          {proyecto.location} • {proyecto.size}
        </p>
        <span className="mt-2 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 uppercase transition group-hover:border-[#F04400] group-hover:bg-[#F04400] group-hover:text-white">
          {ctaLabel}
        </span>
      </div>
    </div>
  );
}
