import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

import { ROUTES } from "@/constants/routes";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Alto del isotipo. El ancho sale de la relación de aspecto del SVG. */
const logoVariants = cva("w-auto", {
  variants: {
    size: {
      sm: "h-10",
      md: "h-12 md:h-14",
      lg: "h-14 md:h-20",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface LogoProps extends VariantProps<typeof logoVariants> {
  name: string;
  className?: string;
}

/**
 * Isotipo NyG (`public/logos/logo.svg`). Sin texto al lado: `name` queda como
 * `alt` para accesibilidad. El alto se controla con `size`, nunca con clases
 * sueltas, para que el header y el footer no se desalineen.
 */
export function Logo({ name, size, className }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      className={cn(
        "inline-flex items-center rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      <Image
        src="/logos/logo.svg"
        alt={name}
        width={534}
        height={419}
        priority
        className={logoVariants({ size })}
      />
    </Link>
  );
}
