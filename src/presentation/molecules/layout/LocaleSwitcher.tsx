"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
  label: string;
  className?: string;
}

/** Cambia de idioma conservando la ruta actual. */
export function LocaleSwitcher({ label, className }: LocaleSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;
    startTransition(() => router.replace(pathname, { locale: nextLocale }));
  };

  return (
    <div
      role="group"
      aria-label={label}
      aria-busy={isPending || undefined}
      className={cn("flex items-center gap-0.5 rounded-md border p-0.5", className)}
    >
      {routing.locales.map((code) => {
        const isCurrent = code === locale;

        return (
          <Button
            key={code}
            type="button"
            size="xs"
            variant={isCurrent ? "secondary" : "ghost"}
            aria-pressed={isCurrent}
            lang={code}
            disabled={isPending}
            onClick={() => changeLocale(code)}
            className="uppercase"
          >
            {code}
          </Button>
        );
      })}
    </div>
  );
}
