"use client";

import { useTranslations } from "next-intl";

import type { SendContactoInput } from "@/core/types/modules/contacto/contacto.types";
import { ErrorHandler } from "@/application/errors/ErrorHandler";
import { toast } from "@/lib/toast/toast.store";
import { useSendContacto } from "@/presentation/hooks/modules/contacto/useContacto";
import {
  ContactoForm,
  type ContactoFormLabels,
} from "@/presentation/molecules/main/contacto/ContactoForm";

/**
 * Une el formulario con el envío real.
 *
 * Es el único componente cliente del banner de contacto: la sección sigue siendo de
 * servidor. Acá vive el hook de datos porque las moléculas reciben todo por props.
 */
export function ContactoFormPanel({ labels }: { labels: ContactoFormLabels }) {
  const t = useTranslations("Home.contacto.form");
  const tErrors = useTranslations("Errors");
  const { trigger, isMutating } = useSendContacto();

  const handleSubmit = async (values: SendContactoInput): Promise<boolean> => {
    try {
      await trigger(values);
      toast.success(t("success"));
      return true;
    } catch (error) {
      // La UI muestra el código traducido, nunca el mensaje técnico del error.
      toast.error(tErrors(ErrorHandler.getMessageKey(error)));
      return false;
    }
  };

  return <ContactoForm labels={labels} onSubmit={handleSubmit} isSubmitting={isMutating} />;
}
