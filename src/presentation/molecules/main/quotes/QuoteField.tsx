import type { QuoteFieldConfig } from "@/content/quotes";
import type { QuoteAnswer } from "@/core/types/modules/quotes/quotes.types";
import { cn } from "@/lib/utils";
import { UNIT_LABEL } from "@/presentation/helpers/quotes/request";

/** Opción de un `select` o de un grupo de checkboxes, con el texto ya traducido. */
export interface QuoteFieldOption {
  value: string;
  label: string;
}

interface QuoteFieldProps {
  field: QuoteFieldConfig;
  /** Texto ya traducido. */
  label: string;
  value: QuoteAnswer;
  onChange: (value: QuoteAnswer) => void;
  options?: readonly QuoteFieldOption[];
  selectPlaceholder?: string;
  /** Mensaje de error ya traducido; `undefined` si el campo es válido. */
  error?: string;
  /** Texto de ayuda debajo del control. */
  hint?: string;
  /** La superficie calculada no se edita a mano. */
  readOnly?: boolean;
}

const CONTROL_CLASS =
  "w-full rounded-md border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-sm text-graphite transition-colors placeholder:text-gray-400 focus:border-brand-orange focus:bg-white focus:ring-1 focus:ring-brand-orange focus:outline-none";

const INVALID_CLASS = "border-red-500 focus:border-red-500 focus:ring-red-500";

/** Un campo del formulario de cotización, renderizado según su configuración. */
export function QuoteField({
  field,
  label,
  value,
  onChange,
  options = [],
  selectPlaceholder,
  error,
  hint,
  readOnly,
}: QuoteFieldProps) {
  const id = `quote-${field.name}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");
  const text = typeof value === "string" ? value : "";
  const checked = Array.isArray(value) ? value : [];
  const controlClass = cn(CONTROL_CLASS, error && INVALID_CLASS);
  const shared = {
    id,
    name: field.name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  } as const;

  return (
    <div className={cn("flex flex-col gap-1.5", field.wide && "sm:col-span-2 xl:col-span-3")}>
      <label
        htmlFor={field.type === "checkboxes" ? undefined : id}
        id={field.type === "checkboxes" ? `${id}-label` : undefined}
        className="text-xs font-semibold tracking-wider text-gray-medium uppercase"
      >
        {label}
        {field.required ? <span className="ml-1 text-brand-orange">*</span> : null}
      </label>

      {field.type === "checkboxes" ? (
        <ul aria-labelledby={`${id}-label`} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {options.map((option) => (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-gray-50/80 px-3 py-2 text-sm text-graphite transition-colors has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  checked={checked.includes(option.value)}
                  onChange={(event) =>
                    onChange(
                      event.target.checked
                        ? [...checked, option.value]
                        : checked.filter((item) => item !== option.value),
                    )
                  }
                  className="size-4 shrink-0 accent-brand-orange"
                />
                {option.label}
              </label>
            </li>
          ))}
        </ul>
      ) : field.type === "select" ? (
        <select
          {...shared}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={cn(controlClass, text === "" && "text-gray-400")}
        >
          <option value="">{selectPlaceholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-graphite">
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          {...shared}
          rows={3}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={cn(controlClass, "resize-none")}
        />
      ) : (
        <div className="relative">
          <input
            {...shared}
            type="text"
            inputMode={field.type === "number" ? "decimal" : undefined}
            readOnly={readOnly}
            value={text}
            onChange={(event) => onChange(event.target.value)}
            className={cn(controlClass, field.unit && "pr-12", readOnly && "bg-gray-100 text-gray-600")}
          />
          {field.unit ? (
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-gray-400"
            >
              {UNIT_LABEL[field.unit]}
            </span>
          ) : null}
        </div>
      )}

      {hint ? (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-semibold text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
