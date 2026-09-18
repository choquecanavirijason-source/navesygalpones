import { ArrowRight, HardHat, Handshake, Settings, Users, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/presentation/atoms/common/Reveal";
import { Text } from "@/presentation/atoms/common/Text";
import { EquipoStats } from "@/presentation/molecules/main/equipo/EquipoStats";

/** Ícono de cada stat, en el mismo orden que `Home.equipo.stats`. */
const STAT_ICONS: readonly LucideIcon[] = [HardHat, Settings, Users, Handshake];

interface Stat {
  value: string;
  label: string;
}

interface EquipoStatsSectionProps {
  /** Ancla de la sección; también genera el id del título para `aria-labelledby`. */
  id?: string;
}

/**
 * Sección de equipo: fondo en dos capas (fondo2 a todo el ancho + foto del obrero a la
 * izquierda fundida hacia la derecha) con texto + CTA y tarjeta blanca de estadísticas encima.
 */
export function EquipoStatsSection({ id = "equipo" }: EquipoStatsSectionProps) {
  const t = useTranslations("Home.equipo");
  const titleId = `${id}-title`;
  const stats = t.raw("stats") as Stat[];

  return (
    <section id={id} aria-labelledby={titleId} className="relative overflow-hidden bg-black">
      {/* Capa 2: fondo principal (va primero en el DOM para quedar detrás del obrero) */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/fondo2.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-black/60" />
      </div>

      {/* Capa 1: obrero en el extremo izquierdo; la máscara lo funde con fondo2 sin corte duro */}
      <div
        className="absolute inset-y-0 left-0 z-0 w-[22%] md:w-[24%]"
        style={{
          maskImage: "linear-gradient(to right, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, black 70%, transparent 100%)",
        }}
      >
        <Image
          src="/images/obrero.jpg"
          alt=""
          fill
          sizes="24vw"
          className="object-cover object-left"
        />
        {/* En mobile el texto se apila sobre la foto: overlay para que se lea. */}
        <div aria-hidden className="absolute inset-0 bg-black/60 md:hidden" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent via-black/60 to-black"
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 items-center gap-4 px-4 py-6 md:py-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8 md:pr-6 md:pl-[26%] lg:pr-10">
        <Reveal className="flex max-w-lg flex-col items-start gap-3 text-white">
          <h2 id={titleId} className="text-xl leading-tight font-bold tracking-tight text-balance md:text-2xl">
            {t("title")}
          </h2>
          <Text size="sm" className="max-w-md text-xs leading-relaxed text-gray-200 md:text-sm">
            {t("description")}
          </Text>
          <Button
            asChild
            className="h-auto rounded-sm bg-brand-orange px-3.5 py-1.5 text-xs font-bold tracking-wide text-white uppercase hover:bg-brand-orange/90"
          >
            {/* TODO: definir destino real del CTA (página de equipo) */}
            <Link href="#equipo">
              {t("ctaLabel")}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Ancho explícito: al ser @container el ancho no depende del contenido. */}
          <div className="@container w-full rounded-2xl bg-background p-3 shadow-2xl md:w-[22rem] md:p-4 lg:w-[42vw] xl:w-[38vw]">
            <EquipoStats
              stats={stats.map((stat, index) => ({ ...stat, icon: STAT_ICONS[index] ?? HardHat }))}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
