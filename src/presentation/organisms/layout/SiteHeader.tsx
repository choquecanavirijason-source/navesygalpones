import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { MAIN_CONTENT_ID } from "@/constants/ui";
import { HEADER_NAV } from "@/content/navigation";
import { Link } from "@/i18n/navigation";
import { Container } from "@/presentation/atoms/layout/Container";
import { Logo } from "@/presentation/atoms/layout/Logo";
import { SkipLink } from "@/presentation/atoms/layout/SkipLink";
import { TopbarItem } from "@/presentation/atoms/layout/TopbarItem";
import { LocaleSwitcher } from "@/presentation/molecules/layout/LocaleSwitcher";
import { MobileNav } from "@/presentation/molecules/layout/MobileNav";
import { NavList } from "@/presentation/molecules/layout/NavList";

export function SiteHeader() {
  const t = useTranslations("Navigation");
  const tTopbar = useTranslations("Header.topbar");
  const tNav = useTranslations("Header.nav");
  const siteName = useTranslations("Metadata")("siteName");
  const items = HEADER_NAV.map(({ href, labelKey, hasDropdown, active }) => ({
    href,
    label: tNav(labelKey),
    hasDropdown,
    active,
  }));

  return (
    <header className="sticky top-0 z-40 bg-background">
      <SkipLink href={`#${MAIN_CONTENT_ID}`}>{t("skipToContent")}</SkipLink>

      {/* Nivel 1 desktop: logo + contacto + CTA. */}
      <div className="hidden h-topbar items-center md:flex">
        <Container className="flex items-center justify-between gap-4">
          <Logo name={siteName} />
          <div className="flex items-center gap-6 text-base">
            <TopbarItem icon={<MapPin aria-hidden className="size-5" />} className="hidden lg:inline-flex">
              {tTopbar("coverageLabel")}
            </TopbarItem>
            <TopbarItem icon={<Phone aria-hidden className="size-5" />}>
              <span className="font-light text-graphite/70">{tTopbar("phoneLabel")}</span>{" "}
              <span className="font-semibold">{tTopbar("phoneNumber")}</span>
            </TopbarItem>
            <MessageCircle aria-hidden className="size-5 text-whatsapp" />
            <Button
              asChild
              className="bg-brand-orange text-white hover:bg-brand-orange/90"
            >
              <Link href="#contacto">
                {tTopbar("ctaButton")}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </Container>
      </div>

      {/* Nivel 1 mobile: logo + WhatsApp (simplificado). */}
      <div className="flex h-topbar items-center md:hidden">
        <Container className="flex items-center justify-between">
          <Logo name={siteName} />
          <MessageCircle aria-hidden className="size-6 text-whatsapp" />
        </Container>
      </div>

      {/* Nivel 2: nav principal centrado. */}
      <div className="border-b border-border/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <Container className="grid h-header grid-cols-[1fr_auto_1fr] items-center gap-6">
          <div className="col-start-1" />
          <NavList
            items={items}
            ariaLabel={t("mainNavLabel")}
            className="col-start-2 hidden justify-self-center md:block"
          />
          <div className="col-start-3 flex items-center justify-self-end gap-2">
            <LocaleSwitcher label={t("language")} className="hidden md:flex" />
            <MobileNav
              items={items}
              title={siteName}
              ariaLabel={t("mainNavLabel")}
              openLabel={t("openMenu")}
              closeLabel={t("closeMenu")}
              className="md:hidden"
              footer={<LocaleSwitcher label={t("language")} className="w-fit" />}
            />
          </div>
        </Container>
      </div>
    </header>
  );
}
