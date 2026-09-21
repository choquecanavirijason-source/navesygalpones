"use client";

import { useEffect } from "react";

import { usePathname } from "@/i18n/navigation";

/**
 * Deja la página parada en la sección del ancla cuando se llega desde otra ruta.
 *
 * Hacen falta las dos cosas que arregla:
 *
 * - Entrando por URL (`/es#contacto`) el navegador salta enseguida, pero la home sigue
 *   creciendo mientras cargan imágenes y video, así que termina más arriba de la sección.
 * - Navegando desde otra página, Next busca el elemento antes de que exista y no scrollea.
 *
 * Por eso reintenta mientras la altura se acomoda, y se rinde apenas el visitante toca algo
 * para no pelearle el scroll.
 *
 * No se ejecuta al pulsar un ancla de la misma página: ahí no cambia la ruta y el salto
 * nativo (suave, por `scroll-behavior`) ya funciona.
 */
const RETRIES_MS = [0, 80, 250, 600, 1200, 2000];

export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    events.forEach((event) => window.addEventListener(event, cancel, { passive: true }));

    // `block: "start"` respeta `scroll-padding-top`, así que frena debajo del header.
    const align = () => {
      if (cancelled) return;
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    };

    const timers = RETRIES_MS.map((ms) => window.setTimeout(align, ms));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      events.forEach((event) => window.removeEventListener(event, cancel));
    };
  }, [pathname]);

  return null;
}
