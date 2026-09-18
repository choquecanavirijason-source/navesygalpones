"use client";

import type { ReactNode } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { isActivePath } from "@/lib/navigation/isActivePath";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** Fuerza el estado activo (p. ej. anclas de una sola página); si se omite, se deriva de la ruta. */
  active?: boolean;
  /** Ícono al final del label (p. ej. chevron de submenú). Decorativo. */
  trailingIcon?: ReactNode;
}

/** Enlace de navegación con estado activo (`aria-current="page"`). */
export function NavLink({ href, children, className, onClick, active, trailingIcon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = active ?? isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm text-base font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-[current=page]:text-foreground aria-[current=page]:underline aria-[current=page]:decoration-brand-orange aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-4",
        className,
      )}
    >
      {children}
      {trailingIcon}
    </Link>
  );
}
