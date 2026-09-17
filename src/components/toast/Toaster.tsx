"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";

import { toastStore } from "@/lib/toast/toast.store";
import { ToastItem } from "@/components/toast/ToastItem";

/** Región de notificaciones. Se monta una sola vez en `AppLayout`. */
export function Toaster() {
  const t = useTranslations("Common");
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );

  return (
    <section
      aria-label={t("notifications")}
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:left-auto sm:w-full sm:max-w-sm"
    >
      <ol className="flex w-full flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <m.li
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="pointer-events-auto"
            >
              <ToastItem
                toast={toast}
                closeLabel={t("close")}
                onDismiss={() => toastStore.dismiss(toast.id)}
              />
            </m.li>
          ))}
        </AnimatePresence>
      </ol>
    </section>
  );
}
