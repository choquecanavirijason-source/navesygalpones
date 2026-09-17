"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";
import { SWRConfig } from "swr";

import { swrConfig } from "@/config/swr.config";

/** Carga diferida de las features de animación: no bloquean el bundle inicial. */
const loadMotionFeatures = () =>
  import("@/presentation/helpers/motion/features").then((mod) => mod.default);

/**
 * Providers globales de cliente.
 * - `LazyMotion strict`: obliga a usar `m.*` (lanza error si se usa `motion.*`).
 * - `MotionConfig reducedMotion="user"`: respeta `prefers-reduced-motion`.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={swrConfig}>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </SWRConfig>
  );
}
