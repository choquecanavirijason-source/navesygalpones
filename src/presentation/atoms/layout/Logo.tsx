import { ROUTES } from "@/constants/routes";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LogoProps {
  name: string;
  className?: string;
}

/**
 * Placeholder de marca: inicial + nombre. Reemplazar el marcador por un
 * `next/image` desde `public/logos/` cuando exista el logotipo.
 */
export function Logo({ name, className }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      className={cn(
        "inline-flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-md bg-primary text-sm text-primary-foreground"
      >
        {name.charAt(0)}
      </span>
      <span>{name}</span>
    </Link>
  );
}
