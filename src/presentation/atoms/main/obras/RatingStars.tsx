import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_STARS = 5;

interface RatingStarsProps {
  /** Cantidad de estrellas llenas (0–5). */
  rating: number;
  /** Texto accesible ya traducido, p. ej. "5 de 5". */
  label: string;
  className?: string;
}

export function RatingStars({ rating, label, className }: RatingStarsProps) {
  return (
    <div role="img" aria-label={label} className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            "size-5",
            index < rating ? "fill-[#F04400] text-[#F04400]" : "text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}
