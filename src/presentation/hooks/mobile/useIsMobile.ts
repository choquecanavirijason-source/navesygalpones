import { BREAKPOINTS } from "@/constants/ui";
import { useMediaQuery } from "@/presentation/hooks/client/useMediaQuery";

/**
 * `true` por debajo del breakpoint `md`. Preferir clases responsive de Tailwind;
 * usar este hook solo cuando cambia el comportamiento, no solo el estilo.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}
