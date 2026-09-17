import { useTranslations } from "next-intl";

import { ROUTES } from "@/constants/routes";
import { NotFoundSection } from "@/presentation/organisms/common/NotFoundSection";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

export function NotFoundPage() {
  const t = useTranslations("NotFound");

  return (
    <MainLayout>
      <NotFoundSection
        code={t("code")}
        title={t("title")}
        description={t("description")}
        action={{ href: ROUTES.home, label: t("backHome") }}
      />
    </MainLayout>
  );
}
