import { useTranslations } from "next-intl";

import { ROUTES } from "@/constants/routes";
import { HeroSection } from "@/presentation/organisms/main/hero/HeroSection";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

export function ForexPage() {
  const t = useTranslations("Forex.hero");

  return (
    <MainLayout>
      <HeroSection
        id="forex-hero"
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        primaryAction={{ href: ROUTES.home, label: t("primaryAction") }}
      />
    </MainLayout>
  );
}
