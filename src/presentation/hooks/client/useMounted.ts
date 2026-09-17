import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** `true` solo después de hidratar. Útil para contenido que depende del navegador. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
