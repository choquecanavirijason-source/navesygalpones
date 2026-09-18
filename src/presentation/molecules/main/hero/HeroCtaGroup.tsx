import { ArrowRight, MessageCircle, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ActionLink } from "@/presentation/helpers/types";

export interface HeroCtaGroupProps {
  primaryAction: ActionLink;
  secondaryAction: ActionLink;
  className?: string;
}

/** Fila de CTAs del hero: WhatsApp (sólido, marca) + reproducir (borde oscuro semitransparente). */
export function HeroCtaGroup({ primaryAction, secondaryAction, className }: HeroCtaGroupProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <Button asChild size="lg" className="bg-brand-orange text-white hover:bg-brand-orange/90">
        <Link href={primaryAction.href}>
          <MessageCircle aria-hidden className="text-whatsapp" />
          {primaryAction.label}
          <ArrowRight aria-hidden />
        </Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="border-white/40 bg-black/30 text-white hover:bg-black/50 hover:text-white"
      >
        <Link href={secondaryAction.href}>
          <Play aria-hidden />
          {secondaryAction.label}
        </Link>
      </Button>
    </div>
  );
}
