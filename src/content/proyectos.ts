/**
 * Id y fotos de cada obra del catálogo `/proyectos`, en el mismo orden que
 * `Home.obras.projects` y `Proyectos.items` (se combinan por índice en `ProyectosPage`).
 *
 * Ojo: esto es independiente de `PROJECT_IMAGES` en `organisms/main/obras/ObrasSection.tsx`
 * (el teaser de la home), que sigue usando las fotos reales de `public/images/` sin cambios.
 * Acá, en cambio, la portada (`images[0]`, la que usan el Hero y la tarjeta de la grilla) y el
 * resto de la galería son fotos de stock — ver el TODO de abajo.
 */
export interface ProyectoContentEntry {
  id: string;
  /**
   * TODO: todas estas fotos son de stock de Unsplash, puestas como placeholder (a pedido,
   * mientras no hay fotos reales de cada obra para la portada ni para el resto de la galería).
   * Ninguna es una foto de esa obra puntual. Reemplazarlas por fotos reales en cuanto existan,
   * y sacar entonces `images.unsplash.com` de `next.config.ts`.
   *
   * "Depósito comercial" quedó con la foto real anterior (`/images/galpon3.webp`): la URL de
   * stock pedida para su portada (`photo-1541888946425-d0fbb186a5b3`) devuelve 404 en
   * Unsplash — no existe. Falta una URL válida para reemplazarla.
   */
  images: readonly string[];
}

export const PROYECTOS_CONTENT = [
  {
    id: "centro-logistico",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "planta-industrial",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"],
  },
  {
    id: "deposito-comercial",
    // TODO: la URL de stock pedida para esta portada (photo-1541888946425-d0fbb186a5b3) no
    // existe en Unsplash (404). Queda la foto real anterior hasta tener un reemplazo válido.
    images: ["/images/galpon3.webp"],
  },
  {
    id: "galpon-agroindustrial",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    ],
  },
] as const satisfies readonly ProyectoContentEntry[];
