"use client";

import { m, type HTMLMotionProps } from "motion/react";

import {
  DEFAULT_TRANSITION,
  fadeInUp,
  VIEWPORT_ONCE,
} from "@/presentation/helpers/motion/variants";

interface RevealProps
  extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "whileInView" | "variants"> {
  delay?: number;
  /**
   * `inView`: anima al entrar en pantalla (contenido bajo el pliegue).
   * `mount`: anima al montar (contenido visible al cargar, p. ej. el hero).
   */
  trigger?: "inView" | "mount";
}

/**
 * Único punto de entrada de animaciones de aparición. Permite que organismos
 * de servidor se animen sin convertirse en componentes cliente.
 */
export function Reveal({ delay = 0, trigger = "inView", transition, ...props }: RevealProps) {
  const triggerProps =
    trigger === "mount"
      ? { animate: "visible" }
      : { whileInView: "visible", viewport: VIEWPORT_ONCE };

  return (
    <m.div
      variants={fadeInUp}
      initial="hidden"
      transition={{ ...DEFAULT_TRANSITION, delay, ...transition }}
      {...triggerProps}
      {...props}
    />
  );
}
