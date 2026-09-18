import Image from "next/image";

import { ROUTES } from "@/constants/routes";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LogoProps {
  name: string;
  className?: string;
}

/**
 * Logo NyG recortado de `public/logos/logoNyG.jpeg` (lockup cuadrado con mucho
 * margen propio): ícono + wordmark, sin la leyenda inferior. Sin texto al lado;
 * `name` queda como `alt` para accesibilidad.
 */
export function Logo({ name, className }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      className={cn(
        "inline-flex items-center rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      <Image src="/logos/logoNyG-header.png" alt={name} width={1055} height={580} className="h-10 w-auto" />
    </Link>
  );
}
