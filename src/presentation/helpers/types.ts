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

/** Obra del catálogo `/proyectos`, ya traducida y con sus imágenes resueltas. */
export interface ProyectoItem {
  id: string;
  name: string;
  location: string;
  size: string;
  structure: string;
  timeline: string;
  description: string;
  /** Fotos de la obra; hoy solo hay una por obra (ver TODO en ProyectosPage). */
  images: readonly string[];
}
