import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  imageSrc: string;
}

/**
 * ServiceCard Molecule
 * Representa cada tarjeta individual en la sección de servicios.
 * Se utiliza para aislar la lógica y estilos de la tarjeta, permitiendo
 * reutilizarla fácilmente si se añaden más servicios en el futuro.
 */
export function ServiceCard({ title, imageSrc }: ServiceCardProps) {
  return (
    <div className="group relative h-[180px] w-full md:h-[220px] overflow-hidden rounded-md bg-muted">
      {/* 
        La imagen de fondo usa fill y object-cover para asegurar que 
        llene la tarjeta sin deformarse.
      */}
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Overlay oscuro en la parte inferior para que el texto sea legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/40 to-transparent" />

      {/* Contenedor del texto y el ícono en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
        <h3 className="text-sm font-semibold text-white uppercase max-w-[85%] leading-tight">
          {title}
        </h3>
        <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}
