import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ROUTES } from "@/constants/routes";
import { resolveLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { HomePage } from "@/presentation/pages/home/HomePage";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return buildPageMetadata({
    locale,
    pathname: ROUTES.home,
    title: t("home.title"),
    description: t("home.description"),
    siteName: t("siteName"),
  });
}

export default async function Page({ params }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));
  return <HomePage />;
}
