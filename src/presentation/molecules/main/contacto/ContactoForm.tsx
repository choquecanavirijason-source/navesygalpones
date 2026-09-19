"use client";

import type { FormEvent } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ContactoFormLabels {
  type: string;
  typeOptions: readonly string[];
  area: string;
  name: string;
  city: string;
  company: string;
  phone: string;
  message: string;
  submit: string;
}

const CONTROL_CLASS =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-sans text-[13px] leading-normal font-medium tracking-normal text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:ring-1 focus:ring-[#F04400] focus:outline-none";

/** Formulario de contacto compacto. Texto ya traducido por props. */
export function ContactoForm({ labels }: { labels: ContactoFormLabels }) {
  // TODO: conectar con backend (flujo /api-feature). Por ahora no envía datos.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <label className="sr-only" htmlFor="contacto-type">{labels.type}</label>
      <select id="contacto-type" name="type" defaultValue="" className={cn(CONTROL_CLASS, "[&:has(option[value='']:checked)]:font-normal [&:has(option[value='']:checked)]:text-gray-400")}>
        <option value="" disabled>{labels.type}</option>
        {labels.typeOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <label className="sr-only" htmlFor="contacto-area">{labels.area}</label>
      <input id="contacto-area" name="area" inputMode="numeric" placeholder={labels.area} className={CONTROL_CLASS} />

      <label className="sr-only" htmlFor="contacto-name">{labels.name}</label>
      <input id="contacto-name" name="name" autoComplete="name" required placeholder={labels.name} className={CONTROL_CLASS} />

      <label className="sr-only" htmlFor="contacto-city">{labels.city}</label>
      <input id="contacto-city" name="city" placeholder={labels.city} className={CONTROL_CLASS} />

      <label className="sr-only" htmlFor="contacto-company">{labels.company}</label>
      <input id="contacto-company" name="company" autoComplete="organization" placeholder={labels.company} className={CONTROL_CLASS} />

      <label className="sr-only" htmlFor="contacto-phone">{labels.phone}</label>
      <input id="contacto-phone" name="phone" type="tel" autoComplete="tel" required placeholder={labels.phone} className={CONTROL_CLASS} />

      <label className="sr-only" htmlFor="contacto-message">{labels.message}</label>
      <textarea id="contacto-message" name="message" rows={2} placeholder={labels.message} className={cn(CONTROL_CLASS, "resize-none sm:col-span-2")} />

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#F04400] py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#d03a00] focus-visible:ring-2 focus-visible:ring-[#F04400] focus-visible:ring-offset-2 focus-visible:outline-none sm:col-span-2"
      >
        {labels.submit}
        <ArrowRight aria-hidden className="size-3.5" />
      </button>
    </form>
  );
}
