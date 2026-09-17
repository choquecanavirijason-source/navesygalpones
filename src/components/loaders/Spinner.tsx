import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  /** Texto accesible (traducido por quien lo usa). */
  label: string;
  className?: string;
}

export function Spinner({ label, className }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex items-center", className)}>
      <LoaderCircle aria-hidden className="size-5 animate-spin text-muted-foreground" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
