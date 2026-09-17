import { useSyncExternalStore } from "react";

import { toast, toastStore } from "@/lib/toast/toast.store";

/** Acceso reactivo a las notificaciones y a la API `toast`. */
export function useToast() {
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );

  return { toasts, toast, dismiss: toast.dismiss };
}
