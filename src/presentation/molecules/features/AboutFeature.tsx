import { ReactNode } from "react";

interface AboutFeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

/**
 * AboutFeature Molecule
 * Se utiliza en la sección "Sobre Nosotros" para mostrar la Misión, Visión y Valores.
 * Recibe el ícono como ReactNode para dar flexibilidad al padre sobre qué ícono renderizar.
 */
export function AboutFeature({ icon, title, description }: AboutFeatureProps) {
  return (
    <div className="flex items-start gap-4">
      {/* 
        Contenedor del ícono. Usamos text-brand-orange para que el ícono 
        tome el color primario de la marca definido en globals.css 
      */}
      <div className="flex shrink-0 items-center justify-center p-1 text-brand-orange">
        {icon}
      </div>
      
      {/* Contenedor del texto */}
      <div className="flex flex-col gap-1">
        <h4 className="font-bold text-graphite uppercase tracking-wide">
          {title}
        </h4>
        <p className="text-sm text-gray-medium leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
