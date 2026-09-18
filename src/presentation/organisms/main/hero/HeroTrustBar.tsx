import { Clock, HardHat, Key, Leaf, MapPin, ShieldCheck, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Container } from "@/presentation/atoms/layout/Container";

const TRUST_BAR_ITEMS = [
  "experience",
  "solutions",
  "quality",
  "team",
  "sustainability",
  "coverage",
] as const;

const TRUST_BAR_ICONS = {
  experience: Clock,
  solutions: Key,
  quality: ShieldCheck,
  team: HardHat,
  sustainability: Leaf,
  coverage: MapPin,
} as const satisfies Record<(typeof TRUST_BAR_ITEMS)[number], LucideIcon>;

/** Franja de confianza debajo del hero: 6 datos clave, namespace `Home.heroTrustBar`. */
export function HeroTrustBar() {
  const t = useTranslations("Home.heroTrustBar");

  return (
    <section className="bg-graphite py-14 text-white">
      <Container>
        <ul className="flex flex-wrap items-center justify-between gap-x-6 gap-y-8">
          {TRUST_BAR_ITEMS.map((key) => {
            const Icon = TRUST_BAR_ICONS[key];

            return (
              <li
                key={key}
                className="flex min-w-0 basis-[45%] items-center gap-4 sm:basis-[30%] lg:basis-auto"
              >
                <Icon aria-hidden className="size-9 shrink-0 text-brand-orange sm:size-10" />
                <div className={cn("min-w-0", key === "team" && "max-w-[6rem]")}>
                  <p className="text-lg font-bold text-balance">{t(`${key}.title`)}</p>
                  <p className="text-sm font-light text-white/70">{t(`${key}.subtitle`)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
