import type { Transition, Variants } from "motion/react";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const DEFAULT_TRANSITION: Transition = {
  duration: 0.6,
  ease: EASE_OUT_EXPO,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Viewport por defecto para animaciones al hacer scroll: una sola vez, con margen. */
export const VIEWPORT_ONCE = { once: true, margin: "0px 0px -10% 0px" } as const;
