import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SectionSkeletonProps {
  /** Número de líneas de texto simuladas. */
  lines?: number;
  className?: string;
}

/** Placeholder de carga para secciones que dependen de datos (SWR `isLoading`). */
export function SectionSkeleton({ lines = 3, className }: SectionSkeletonProps) {
  return (
    <div aria-hidden className={cn("flex w-full flex-col gap-3", className)}>
      <Skeleton className="h-8 w-2/3" />
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={cn("h-4", index === lines - 1 ? "w-1/2" : "w-full")} />
      ))}
    </div>
  );
}
