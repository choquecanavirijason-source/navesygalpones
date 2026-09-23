import { useTranslations } from "next-intl";

import { LEGAL_NAV } from "@/content/navigation";
import { Text } from "@/presentation/atoms/common/Text";
import { Container } from "@/presentation/atoms/layout/Container";
import { Logo } from "@/presentation/atoms/layout/Logo";
import { NavList } from "@/presentation/molecules/layout/NavList";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");
  const siteName = useTranslations("Metadata")("siteName");
  const items = LEGAL_NAV.map(({ href, labelKey }) => ({ href, label: tNav(labelKey) }));
  // String: evita que ICU formatee el año con separador de miles (p. ej. "2.026").
  const year = String(new Date().getFullYear());

  return (
    /*
     * Grafito, el mismo tono con el que cierra la sección de contacto.
     *
     * La clase `dark` reapunta los tokens semánticos (`foreground`, `muted-foreground`,
     * `border`) solo dentro del footer: así los enlaces legales y el copyright se leen sobre
     * el fondo oscuro sin tener que pasarles colores sueltos ni tocar los átomos compartidos.
     */
    <footer className="dark border-t border-border/60 bg-graphite text-foreground">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <Logo name={siteName} size="sm" />
        <NavList items={items} ariaLabel={tNav("legalNavLabel")} />
        <Text size="sm" tone="muted">
          {t("copyright", { year, siteName })}
        </Text>
      </Container>
    </footer>
  );
}
