import { BadgeCheck, Lock, Zap, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Reveal } from "@/presentation/atoms/common/Reveal";
import { BenefitItem } from "@/presentation/atoms/main/contacto/BenefitItem";
import { ContactoForm } from "@/presentation/molecules/main/contacto/ContactoForm";

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
    <section id={id} aria-labelledby={titleId} className="relative isolate overflow-hidden bg-graphite">
      {/* Capa 0: fondo de obra (sin obrero) */}
      <Image src="/images/fondo3.png" alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/30" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* Flex simétrico: mismo margen exterior a ambos lados y el mismo `gap` entre los bloques. */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1320px] flex-col items-center gap-6 px-6 py-6 md:py-8 lg:flex-row lg:justify-between lg:gap-8 lg:px-12">
        <Reveal className="w-full max-w-[340px] flex-shrink-0">
          <div className="flex w-full flex-col items-start text-left">
            <h2 id={titleId} className="max-w-full text-left text-2xl leading-tight font-black tracking-tight whitespace-pre-line text-white uppercase md:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-2.5 mb-4 max-w-full text-left text-xs leading-normal text-gray-200 opacity-90 md:text-sm">{t("description")}</p>
            <ul className="grid w-full grid-cols-3 gap-2">
              {BENEFITS.map(({ key, icon }) => (
                <BenefitItem key={key} icon={icon} label={t(`benefits.${key}`)} />
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative z-20 mx-auto w-full max-w-[440px] flex-shrink-0 rounded-xl bg-white p-4 shadow-lg lg:mx-0">
          <ContactoForm
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
            }}
          />
        </Reveal>

        {/* Obrero + frase: ocupan el ancho restante; el obrero va centrado en él y la frase a la derecha. */}
        <Reveal delay={0.2} className="relative z-20 flex w-full min-w-0 items-center justify-end lg:-my-8 lg:min-h-[calc(100%+4rem)] lg:flex-1 lg:self-stretch">
          <Image
            src="/images/obrero3.png"
            alt=""
            aria-hidden
            width={1582}
            height={994}
            sizes="440px"
            className="pointer-events-none absolute bottom-0 left-[28%] z-10 hidden h-[85%] w-auto max-w-none -translate-x-1/2 object-contain lg:block"
          />
          <p className="relative z-20 w-full text-right text-lg leading-snug font-black text-white uppercase md:text-xl lg:max-w-[10rem] lg:pr-2">
            {t("tagline")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
