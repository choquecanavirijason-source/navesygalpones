"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CollapsingHeaderProps {
  children: ReactNode;
  /**
   * `false` en páginas que ya se dibujan con una sola fila: no hay barra superior que
   * esconder, así que el header queda fijo arriba y `data-collapsed` nace en `true`.
   */
  collapsible?: boolean;
  className?: string;
}

/**
 * Header que queda reducido a la barra de navegación en cuanto el visitante deja atrás la
 * primera sección de la página.
 *
 * Cómo funciona, y por qué así:
 *
 * - Observa la primera sección de `<main>` con `IntersectionObserver` en vez de escuchar el
 *   scroll: el navegador avisa solo cuando cruza el borde, sin trabajo en cada píxel.
 * - Al colapsar no oculta la barra superior: mueve el punto de pegado (`top`) hacia arriba
 *   justo su alto. El header conserva su altura en el flujo, así que el contenido de abajo
 *   no pega ningún salto; la barra superior simplemente queda fuera de pantalla.
 * - Publica el estado como `data-collapsed`. Los hijos son componentes de servidor y
 *   reaccionan solo con CSS (`group-data-[collapsed=true]/header:…`), sin volverse cliente.
 */
export function CollapsingHeader({
  children,
  collapsible = true,
  className,
}: CollapsingHeaderProps) {
  const [scrolledPast, setScrolledPast] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const collapsed = collapsible ? scrolledPast : true;

  useEffect(() => {
    if (!collapsible) return;

    const header = headerRef.current;
    const firstSection = document.querySelector("main > *");
    if (!header || !firstSection) return;

    // El alto en el flujo no cambia al colapsar, así que este margen sirve para siempre.
    const observer = new IntersectionObserver(
      ([entry]) => setScrolledPast(entry ? !entry.isIntersecting : false),
      { rootMargin: `-${header.offsetHeight}px 0px 0px 0px`, threshold: 0 },
    );

    observer.observe(firstSection);
    return () => observer.disconnect();
  }, [collapsible]);

  useEffect(() => {
    // Las anclas tienen que frenar debajo de lo que realmente tapa el header.
    const { style } = document.documentElement;
    style.setProperty(
      "scroll-padding-top",
      collapsed ? "var(--header-height)" : "calc(var(--topbar-height) + var(--header-height))",
    );
    return () => {
      style.removeProperty("scroll-padding-top");
    };
  }, [collapsed]);

  return (
    <header
      ref={headerRef}
      data-collapsed={collapsed}
      className={cn(
        "group/header sticky top-0 z-40 bg-background",
        collapsible &&
          "transition-[top] duration-300 ease-out motion-reduce:transition-none data-[collapsed=true]:-top-topbar",
        className,
      )}
    >
      {children}
    </header>
  );
}
