/**
 * Indica si `href` corresponde a la ruta actual. `pathname` debe venir sin
 * prefijo de idioma (tal como lo devuelve `usePathname` de `@/i18n/navigation`).
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
