import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { resolveLocale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

/** Captura cualquier ruta localizada inexistente y renderiza `[locale]/not-found.tsx`. */
export default async function CatchAllNotFound({ params }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));
  notFound();
}
