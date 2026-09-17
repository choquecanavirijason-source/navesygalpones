import { useTranslations } from "next-intl";

import { ROUTES } from "@/constants/routes";
import { HeroSection } from "@/presentation/organisms/main/hero/HeroSection";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

export function HomePage() {
  const t = useTranslations("Home.hero");

  return (
    <MainLayout>
      <HeroSection
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        primaryAction={{ href: ROUTES.forex, label: t("primaryAction") }}
      />
    </MainLayout>
  );
}
