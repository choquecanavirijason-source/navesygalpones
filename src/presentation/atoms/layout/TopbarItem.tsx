import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TopbarItemProps {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Ícono de marca (naranja) + texto grafito para la barra superior del header. */
export function TopbarItem({ icon, children, className }: TopbarItemProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-graphite", className)}>
      <span aria-hidden className="inline-flex shrink-0 items-center text-brand-orange">
        {icon}
      </span>
      {children}
    </span>
  );
}
