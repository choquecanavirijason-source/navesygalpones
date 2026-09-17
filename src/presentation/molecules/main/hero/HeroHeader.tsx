import { cn } from "@/lib/utils";
import { HeroBadge } from "@/presentation/atoms/main/hero/HeroBadge";
import { HeroDescription } from "@/presentation/atoms/main/hero/HeroDescription";
import { HeroTitle } from "@/presentation/atoms/main/hero/HeroTitle";

export interface HeroHeaderProps {
  titleId?: string;
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "start";
  className?: string;
}

export function HeroHeader({
  titleId,
  badge,
  title,
  description,
  align = "center",
  className,
}: HeroHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {badge ? <HeroBadge>{badge}</HeroBadge> : null}
      <HeroTitle id={titleId}>{title}</HeroTitle>
      {description ? <HeroDescription>{description}</HeroDescription> : null}
    </div>
  );
}
