import { createNavigation } from "next-intl/navigation";

import { routing } from "@/i18n/routing";

/** Usar SIEMPRE estas APIs en lugar de `next/link` y `next/navigation`. */
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
