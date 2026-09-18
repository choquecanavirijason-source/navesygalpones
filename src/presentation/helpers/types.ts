/** Enlace ya traducido, listo para renderizar. */
export interface NavLinkItem {
  href: string;
  label: string;
  /** Fuerza el estado activo sin depender de la ruta (p. ej. anclas dentro de una sola página). */
  active?: boolean;
  /** Indicador visual de submenú (chevron). El dropdown en sí se resuelve más adelante. */
  hasDropdown?: boolean;
}

/** Acción (CTA) ya traducida. */
export interface ActionLink {
  href: string;
  label: string;
}
