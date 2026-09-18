import { Heading } from "@/presentation/atoms/common/Heading";
import { cn } from "@/lib/utils";

interface HeroHeadlineProps {
  id?: string;
  /** Exactamente 3 líneas: la primera blanca, la segunda y la tercera en naranja de marca. */
  lines: readonly [string, string, string];
  className?: string;
}

/** Único `<h1>` del hero, partido en 3 líneas con el esquema de color de marca. */
export function HeroHeadline({ id, lines, className }: HeroHeadlineProps) {
  const [first, second, third] = lines;

  return (
    <Heading as="h1" id={id} size="display" className={cn("max-w-3xl text-white", className)}>
      <span className="block">{first}</span>
      <span className="block text-brand-orange">{second}</span>
      <span className="block text-brand-orange">{third}</span>
    </Heading>
  );
}
