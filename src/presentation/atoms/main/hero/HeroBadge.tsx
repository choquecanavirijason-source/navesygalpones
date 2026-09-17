import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HeroBadgeProps {
  children: ReactNode;
  className?: string;
}

export function HeroBadge({ children, className }: HeroBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("bg-background/60 px-3 py-1 backdrop-blur-sm", className)}
    >
      {children}
    </Badge>
  );
}
