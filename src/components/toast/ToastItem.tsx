import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ToastRecord, ToastVariant } from "@/lib/toast/toast.types";

const VARIANT_ICON: Record<ToastVariant, LucideIcon | null> = {
  default: null,
  success: CircleCheck,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
};

const VARIANT_ICON_CLASS: Record<ToastVariant, string> = {
  default: "",
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
  info: "text-info",
};

interface ToastItemProps {
  toast: ToastRecord;
  closeLabel: string;
  onDismiss: () => void;
}

export function ToastItem({ toast, closeLabel, onDismiss }: ToastItemProps) {
  const Icon = VARIANT_ICON[toast.variant];
  const isAlert = toast.variant === "error" || toast.variant === "warning";

  return (
    <div
      role={isAlert ? "alert" : "status"}
      aria-live={isAlert ? "assertive" : "polite"}
      className="flex w-full items-start gap-3 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg"
    >
      {Icon ? (
        <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", VARIANT_ICON_CLASS[toast.variant])} />
      ) : null}
      <div className="grid flex-1 gap-1">
        <p className="text-sm font-medium leading-none">{toast.title}</p>
        {toast.description ? (
          <p className="text-sm text-muted-foreground">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="-m-1 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <X aria-hidden className="size-4" />
        <span className="sr-only">{closeLabel}</span>
      </button>
    </div>
  );
}
