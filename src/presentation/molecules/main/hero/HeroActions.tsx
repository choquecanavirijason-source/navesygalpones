import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ActionLink } from "@/presentation/helpers/types";

export interface HeroActionsProps {
  primaryAction?: ActionLink;
  secondaryAction?: ActionLink;
  align?: "center" | "start";
  className?: string;
}

export function HeroActions({
  primaryAction,
  secondaryAction,
  align = "center",
  className,
}: HeroActionsProps) {
  if (!primaryAction && !secondaryAction) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row",
        align === "center" ? "sm:justify-center" : "sm:justify-start",
        className,
      )}
    >
      {primaryAction ? (
        <Button asChild size="lg">
          <Link href={primaryAction.href}>
            {primaryAction.label}
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      ) : null}
      {secondaryAction ? (
        <Button asChild size="lg" variant="outline">
          <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}
