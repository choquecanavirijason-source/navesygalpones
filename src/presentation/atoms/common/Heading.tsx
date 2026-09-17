import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("font-semibold tracking-tight text-balance text-foreground", {
  variants: {
    size: {
      display: "text-4xl sm:text-5xl lg:text-6xl",
      xl: "text-3xl sm:text-4xl",
      lg: "text-2xl sm:text-3xl",
      md: "text-xl sm:text-2xl",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

interface HeadingProps extends ComponentProps<"h2">, VariantProps<typeof headingVariants> {
  /** Nivel semántico. Independiente del tamaño visual. */
  as?: HeadingLevel;
}

export function Heading({ as: Tag = "h2", size, className, ...props }: HeadingProps) {
  return <Tag className={cn(headingVariants({ size }), className)} {...props} />;
}
