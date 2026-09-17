import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Heading } from "@/presentation/atoms/common/Heading";

interface HeroTitleProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

/** Único `<h1>` de la página cuando la página tiene hero. */
export function HeroTitle({ id, children, className }: HeroTitleProps) {
  return (
    <Heading as="h1" id={id} size="display" className={cn("max-w-4xl", className)}>
      {children}
    </Heading>
  );
}
