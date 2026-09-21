/**
 * Indica si `href` corresponde a la ruta actual. `pathname` debe venir sin
 * prefijo de idioma (tal como lo devuelve `usePathname` de `@/i18n/navigation`).
 *
 * Un enlace con ancla (`/#servicios`) apunta a una sección, no a una página: marcarlo por
 * la ruta encendería todas las anclas de la home a la vez, así que nunca cuenta como activo.
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
