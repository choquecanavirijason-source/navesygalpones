import { useTranslations } from "next-intl";

import { Text } from "@/presentation/atoms/common/Text";
import { LegalDocument } from "@/presentation/organisms/common/LegalDocument";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

export function TermsPage() {
  const t = useTranslations("Terms");

  return (
    <MainLayout>
      <LegalDocument title={t("title")} description={t("description")}>
        <Text tone="muted">{t("placeholder")}</Text>
      </LegalDocument>
    </MainLayout>
  );
}
