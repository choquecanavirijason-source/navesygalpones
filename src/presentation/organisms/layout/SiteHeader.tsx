import { useTranslations } from "next-intl";

import { MAIN_CONTENT_ID } from "@/constants/ui";
import { MAIN_NAV } from "@/content/navigation";
import { Container } from "@/presentation/atoms/layout/Container";
import { Logo } from "@/presentation/atoms/layout/Logo";
import { SkipLink } from "@/presentation/atoms/layout/SkipLink";
import { LocaleSwitcher } from "@/presentation/molecules/layout/LocaleSwitcher";
import { MobileNav } from "@/presentation/molecules/layout/MobileNav";
import { NavList } from "@/presentation/molecules/layout/NavList";

export function SiteHeader() {
  const t = useTranslations("Navigation");
  const siteName = useTranslations("Metadata")("siteName");
  const items = MAIN_NAV.map(({ href, labelKey }) => ({ href, label: t(labelKey) }));

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <SkipLink href={`#${MAIN_CONTENT_ID}`}>{t("skipToContent")}</SkipLink>
      <Container className="flex h-header items-center justify-between gap-6">
        <Logo name={siteName} />
        <NavList items={items} ariaLabel={t("mainNavLabel")} className="hidden md:block" />
        <div className="flex items-center gap-2">
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
    </header>
  );
}
