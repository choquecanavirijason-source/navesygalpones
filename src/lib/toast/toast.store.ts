import { TOAST_DURATION_MS, TOAST_LIMIT } from "@/config/constants";
import type { ToastOptions, ToastRecord, ToastVariant } from "@/lib/toast/toast.types";

type Listener = () => void;

const EMPTY: readonly ToastRecord[] = [];

let toasts: readonly ToastRecord[] = EMPTY;
let counter = 0;
const listeners = new Set<Listener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function setToasts(next: readonly ToastRecord[]): void {
  toasts = next;
  listeners.forEach((listener) => listener());
}

/**
 * Store de notificaciones sin dependencias, compatible con `useSyncExternalStore`.
 * Se puede llamar desde cualquier código cliente (no solo componentes).
 */
export const toastStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): readonly ToastRecord[] {
    return toasts;
  },

  getServerSnapshot(): readonly ToastRecord[] {
    return EMPTY;
  },

  add({ title, description, variant = "default", duration = TOAST_DURATION_MS }: ToastOptions): string {
    const id = `toast-${++counter}`;
    const record: ToastRecord = { id, title, description, variant, duration };
    const next = [...toasts, record];
    const overflow = next.slice(0, Math.max(0, next.length - TOAST_LIMIT));

    overflow.forEach((item) => clearTimer(item.id));
    setToasts(next.slice(-TOAST_LIMIT));

    if (duration > 0) {
      timers.set(id, setTimeout(() => toastStore.dismiss(id), duration));
    }

    return id;
  },

  dismiss(id: string): void {
    clearTimer(id);
    setToasts(toasts.filter((item) => item.id !== id));
  },

  clear(): void {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    setToasts(EMPTY);
  },
};

function clearTimer(id: string): void {
  const timer = timers.get(id);
  if (timer) clearTimeout(timer);
  timers.delete(id);
}

type ShortcutOptions = Omit<ToastOptions, "title" | "variant">;

const withVariant =
  (variant: ToastVariant) =>
  (title: string, options?: ShortcutOptions): string =>
    toastStore.add({ ...options, title, variant });

/** API imperativa: `toast({ title })`, `toast.success(title)`, `toast.dismiss(id)`. */
export const toast = Object.assign((options: ToastOptions) => toastStore.add(options), {
  success: withVariant("success"),
  error: withVariant("error"),
  warning: withVariant("warning"),
  info: withVariant("info"),
  dismiss: (id: string) => toastStore.dismiss(id),
  clear: () => toastStore.clear(),
});
