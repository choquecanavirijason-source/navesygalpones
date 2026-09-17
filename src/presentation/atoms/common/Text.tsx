import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    size: {
      lg: "text-lg leading-relaxed sm:text-xl",
      md: "text-base leading-7",
      sm: "text-sm leading-6",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

interface TextProps extends ComponentProps<"p">, VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

export function Text({ as: Tag = "p", size, tone, className, ...props }: TextProps) {
  return <Tag className={cn(textVariants({ size, tone }), className)} {...props} />;
}
