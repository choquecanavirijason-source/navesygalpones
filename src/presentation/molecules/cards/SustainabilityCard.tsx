import Image from "next/image";
import { ArrowRight, Leaf, Recycle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SustainabilityCardProps {
  imageSrc: string;
  title: string;
  description: string;
  ctaText: string;
  features: {
    materials: string;
    waste: string;
    energy: string;
  };
}

/**
 * SustainabilityCard Molecule
 * Tarjeta destacada para la sección de "Construcción Sustentable".
 * Utiliza un layout relativo con una imagen de fondo y un overlay oscuro
 * para que el contenido de texto (blanco) resalte adecuadamente.
 */
export function SustainabilityCard({ imageSrc, title, description, ctaText, features }: SustainabilityCardProps) {
  return (
    <div className="relative flex h-full min-h-[400px] flex-col justify-between overflow-hidden rounded-lg bg-graphite p-8 text-white">
      {/* Imagen de fondo con object-cover */}
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover opacity-50 mix-blend-overlay"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      
      {/* Overlay adicional para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-r from-graphite/90 to-graphite/20" />

      {/* Contenido principal (arriba/medio) */}
      <div className="relative z-10 flex max-w-[80%] flex-col items-start gap-4">
        <h3 className="text-2xl font-bold uppercase leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-200 leading-relaxed">
          {description}
        </p>
        <Button
          variant="outline"
          className="mt-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white bg-transparent"
        >
          {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Íconos inferiores */}
      <div className="relative z-10 mt-8 grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
        <div className="flex items-center gap-2">
          <Recycle className="h-6 w-6 shrink-0 text-gray-300" strokeWidth={1.5} />
          <span className="text-[10px] sm:text-xs leading-tight text-gray-300">
            {features.materials}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 shrink-0 text-gray-300" strokeWidth={1.5} />
          <span className="text-[10px] sm:text-xs leading-tight text-gray-300">
            {features.waste}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 shrink-0 text-gray-300" strokeWidth={1.5} />
          <span className="text-[10px] sm:text-xs leading-tight text-gray-300">
            {features.energy}
          </span>
        </div>
      </div>
    </div>
  );
}
