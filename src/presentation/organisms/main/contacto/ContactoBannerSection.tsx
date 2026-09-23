import { BadgeCheck, Lock, Zap, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Reveal } from "@/presentation/atoms/common/Reveal";
import { BenefitItem } from "@/presentation/atoms/main/contacto/BenefitItem";
import { ContactoFormPanel } from "@/presentation/organisms/main/contacto/ContactoFormPanel";

const BENEFITS = [
  { key: "fast", icon: Zap },
  { key: "advice", icon: BadgeCheck },
  { key: "privacy", icon: Lock },
] as const satisfies readonly { key: string; icon: LucideIcon }[];

interface ContactoBannerSectionProps {
  /** Ancla de la sección; también genera el id del título para `aria-labelledby`. */
  id?: string;
}

/** Banner de contacto: fondo con overlay, mensaje + beneficios, formulario flotante y frase de marca. */
export function ContactoBannerSection({ id = "contacto" }: ContactoBannerSectionProps) {
  const t = useTranslations("Home.contacto");
  const titleId = `${id}-title`;
  const typeOptions = t.raw("form.typeOptions") as string[];

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="relative isolate flex min-h-[calc(100dvh-var(--topbar-height)-var(--header-height))] overflow-hidden bg-graphite"
    >
      {/* Capa 0: fondo de obra (sin obrero) */}
      <Image src="/images/fondo3.png" alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/30" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/*
        La fila es el único hijo en flujo: se estira a toda la altura de la sección (100dvh
        menos el header sticky). En `lg` no lleva padding vertical —cada columna pone el suyo—
        para que la columna del obrero llegue a los bordes y él quede apoyado en el inferior.
      */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-col items-center justify-center gap-8 px-6 py-10 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8 lg:px-12 lg:py-0">
        <Reveal className="flex w-full max-w-[340px] shrink-0 flex-col justify-center lg:max-w-[300px] lg:py-10 xl:max-w-[320px]">
          <h2 id={titleId} className="text-left text-2xl leading-tight font-black tracking-tight whitespace-pre-line text-white uppercase md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 mb-5 text-left text-xs leading-normal text-gray-200 opacity-90 md:text-sm">{t("description")}</p>
          <ul className="grid w-full grid-cols-3 gap-2">
            {BENEFITS.map(({ key, icon }) => (
              <BenefitItem key={key} icon={icon} label={t(`benefits.${key}`)} />
            ))}
          </ul>
        </Reveal>

        <Reveal
          delay={0.1}
          className="relative z-20 w-full max-w-[440px] shrink-0 self-center rounded-xl bg-white p-4 shadow-xl lg:my-10 lg:max-w-[400px] xl:max-w-[420px]"
        >
          <ContactoFormPanel
            labels={{
              type: t("form.type"),
              typeOptions,
              area: t("form.area"),
              name: t("form.name"),
              city: t("form.city"),
              company: t("form.company"),
              phone: t("form.phone"),
              message: t("form.message"),
              submit: t("form.submit"),
              sending: t("form.sending"),
            }}
          />
        </Reveal>

        {/* Obrero + frase: la columna ocupa el ancho restante y toda la altura de la sección. */}
        <Reveal
          delay={0.2}
          className="relative z-0 flex w-full min-w-0 items-center justify-center lg:w-auto lg:flex-1 lg:justify-end lg:py-10"
        >
          {/* Franja del obrero: de borde a borde en vertical, dejando libre el ancho de la frase.
              Solo desde xl: la foto es apaisada (1582×994), así que a más altura más ancho —
              el 65% de la sección lo deja apoyado abajo sin taparle el formulario. */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-[11rem] left-0 hidden xl:block">
            <Image
              src="/images/obrero3.png"
              alt=""
              width={1582}
              height={994}
              sizes="720px"
              className="absolute bottom-0 left-1/2 h-[65%] max-h-[34rem] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
            />
          </div>
          <p className="relative z-10 w-full text-center text-lg leading-snug font-black text-white uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] md:text-xl lg:max-w-[10rem] lg:text-lg lg:text-right xl:max-w-[11rem] xl:text-xl">
            {t("tagline")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
