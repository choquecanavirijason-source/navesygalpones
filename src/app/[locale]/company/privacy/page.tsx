import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ROUTES } from "@/constants/routes";
import { resolveLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PrivacyPage } from "@/presentation/pages/company/privacy/PrivacyPage";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Metadata.privacy" });

  return buildPageMetadata({
    locale,
    pathname: ROUTES.privacy,
    title: t("title"),
    description: t("description"),
  });
}

export default async function Page({ params }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));
  return <PrivacyPage />;
}
