import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Text } from "@/presentation/atoms/common/Text";

interface HeroDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function HeroDescription({ children, className }: HeroDescriptionProps) {
  return (
    <Text size="lg" tone="muted" className={cn("max-w-2xl text-pretty", className)}>
      {children}
    </Text>
  );
}
