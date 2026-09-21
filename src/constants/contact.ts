/**
 * Canales de contacto de la empresa.
 *
 * TODO: confirmar el número con el cliente. Está derivado del teléfono que ya figura en
 * `Header.topbar.phoneNumber` (11 4493-6915) al formato internacional que pide wa.me:
 * código de país (54) + 9 de celular + característica sin el 0 + número sin el 15.
 */
export const WHATSAPP_NUMBER = "5491144936915";

/** Enlace de WhatsApp con mensaje precargado. */
export const buildWhatsAppUrl = (message: string, phone: string = WHATSAPP_NUMBER) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
