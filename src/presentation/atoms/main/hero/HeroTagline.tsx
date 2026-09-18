import { cn } from "@/lib/utils";

interface HeroTaglineProps {
  children: string;
  className?: string;
}

/** Frase decorativa en cursiva, pensada para la esquina inferior derecha del hero. */
export function HeroTagline({ children, className }: HeroTaglineProps) {
  return (
    <p className={cn("text-sm font-light text-white/80 italic sm:text-base", className)}>{children}</p>
  );
}
